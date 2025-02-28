---
title: Stitching together videos and images with FFmpeg
date: 2025-02-25
syntax: true
tags:
  - ffmpeg
  - bash
---
<style>
    .icon { width: 15px; height: 15px;}
</style>

I wanted do a quick write-up about something I figured out with code. 

Back in early January I was trying to create one of those year-end highlight reels you see on social media that quickly goes through a bunch of photos and videos. Google Photos has a feature where you can combine photos and videos into a "movie" but it has a limit of 50 items, I had 124 items 😬. I knew there was a way to do this with FFmpeg but I had never tried it before. So I took a crack at it and it wasn't that hard in the end. 

The data source:
- I had photos in either landscape or portrait mode, all jpg
- I had videos in either landscape or portrait mode, all mp4
- the videos are of varying lengths

Desired outcome:
- to produce a single video with everything stitched together
- for videos it should only use the first 5 seconds
- output a video in portrait mode with anything in landscape scaled to fit width-wise without cropping, showing black bars above and below, no distortion

I'm going to start by showing you an example of what the CLI command looks like and then I'll break down and explain each part.

In this command we are combining 2 videos and 2 images into 1 video.
```bash
ffmpeg \
-loop 1 -t 1 -i photo1.jpg \
-t 5 -i video1.mp4 \
-loop 1 -t 1 -i photo2.jpg \
-t 5 -i video2.mp4 \
-f lavfi -t 1 -i anullsrc \
-filter_complex "\
[0:v]scale=1080:-1,setsar=1,pad=1080:1920:0:(oh-ih)/2[v0];\
[1:v]scale=1080:-1,setsar=1,pad=1080:1920:0:(oh-ih)/2[v1];\
[2:v]scale=1080:-1,setsar=1,pad=1080:1920:0:(oh-ih)/2[v2];\
[3:v]scale=1080:-1,setsar=1,pad=1080:1920:0:(oh-ih)/2[v3];\
[v0][4:a][v1][1:a][v2][4:a][v3][3:a]concat=n=4:v=1:a=1[v][a]" \
-map "[v]" -map "[a]" "output.mp4"
```

Lets break this down.

### Part 1: The Inputs
```bash
-loop 1 -t 1 -i photo1.jpg \
-t 5 -i video1.mp4 \
-loop 1 -t 1 -i photo2.jpg \
-t 5 -i video2.mp4 \
-f lavfi -t 1 -i anullsrc \
```

- `-loop <duration>` - (images only) continually loop the image for the duration [{% icon "fa-solid fa-book", "documentation" %}](https://ffmpeg.org/ffmpeg-formats.html#image2-1)
- `-t <duration>` - "When used as an input option (before `-i`), limit the duration of data read from the input file" [{% icon "fa-solid fa-book", "documentation" %}](https://ffmpeg.org/ffmpeg.html#Main-options). In the case of a video input, only read the first 5 seconds of the video. For images, loop the images to 1 second. 
- `-i <file>` - the input (the file to use)

This is one is a little different but it's important.

```bash
-f lavfi -t 1 -i anullsrc
```
- `-f lavfi` - use the Libavfilter virtual input device [{% icon "fa-solid fa-book", "documentation" %}](https://ffmpeg.org/ffmpeg-devices.html#lavfi)
- `-t 1` - for 1 second
- `-i anullsrc` - creates a null audio source which generates silent audio frames [{% icon "fa-solid fa-book", "documentation" %}](https://ffmpeg.org/ffmpeg-filters.html#anullsrc). Since the final product is a video, we need an audio track to go along with the images.

### Part 2: The -filter_complex
You'll see this repeated a few times:
```bash
[0:v]scale=1080:-1,setsar=1,pad=1080:1920:0:(oh-ih)/2[v0];
```
- `[0:v]` - Select the video input from the file at index 0 (this could be an image or a video)
- `scale=1080:-1` - scales input to 1080px width. The `-1` means auto-calculate height. This keeps the aspect ratio of the input so it's not distorted.
- `setsar=1` - sets the Sample Aspect Ratio (SAR) of a video to 1:1. This means that each pixel in the video is treated as a perfect square [{% icon "fa-solid fa-book", "documentation" %}](https://ffmpeg.org/ffmpeg-filters.html#setdar_002c-setsar).
- `pad=1080:1920` - This helps set the output to exactly 1080x1920. By default it will fill with the color black and if an input doesn't cover the space, then this is what will give us the black bars. [{% icon "fa-solid fa-book", "documentation" %}](https://ffmpeg.org/ffmpeg-filters.html#pad-1)
- `0:(oh-ih)/2` - the `x:y` coordinates of where to place the input within the 1080x1920 space. 
    - `0` - Since we always scale our inputs to 1080, we know the `x` position will always be 0.
    - `(oh-ih)/2` = `(output height - input height) / 2` - which is the calculation for the `y` position to get the input vertically centerd
- `[v0]` - label the output of this filter for further use in the filter chain.


### Part 3: The concat filter

```bash
[v0][4:a][v1][1:a][v2][4:a][v3][3:a]
```

This pairs the labeled video inputs with an audio. You'll notice that `[4:a]` is used twice. This is a reference to the silent audio track paired with an image input. Remember that we have 5 inputs, 4 files and the 5th one being the generated silent audio. `[4:a]` refers to that 5th audio input in our 0-indexed inputs array.

```bash
concat=n=4:v=1:a=1[v][a]
```
This is what concatenates multiple input streams.

- `concat` - is the filter name. [{% icon "fa-solid fa-book", "documentation" %}](https://ffmpeg.org/ffmpeg-filters.html#concat)
- `n=4` - specifies that four input segments will be concatenated.
- `v=1` - indicates that one video stream will be in the output.
- `a=1` - specifies that one audio stream will be in the output.
- `[v][a]` are new labels for the output video and audio streams

### Part 4: Map to output

```bash
-map "[v]" -map "[a]" "output.mp4"
```

- `-map "[v]"` - selects the video stream labeled as `[v]` from the filter complex output.
- `-map "[a]"` - selects the audio stream labeled as `[a]` from the filter complex output.
- `"output.mp4"` - the name of our final output file

## Automate

As you can see, the command for just 4 files is not very small. I had 124 files to handle. I wrote a Bash script to help me with this:

```bash
#!/bin/bash
# Usage: ./concat.sh <folder> <output_file>
# Example: ./concat.sh /home/user/videos output.mp4

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <folder> <output_file>"
    exit 1
fi

folder=$1
output_file=$2

inputs=""
filter_complex=""
concat_filter=""
index=0

jpegCount=$(find "$folder" -type f -name "*.jpg" | wc -l)
mp4Count=$(find "$folder" -type f -name "*.mp4" | wc -l)

# count all the files because this will be used as the index for the silent audio
totalFiles=$((jpegCount + mp4Count))
echo "Total files: $totalFiles"

for file in "$folder"/*; do
    if [[ $file == *.jpg ]]; then
        inputs+="-loop 1 -t 1 -i $file "
        concat_filter+="[v$index][$totalFiles:a]" # [$totalFiles:a] is the silent audio
    elif [[ $file == *.mp4 ]]; then
        inputs+="-t 5 -i $file "
        concat_filter+="[v$index][$index:a]"
    fi
    filter_complex+="[$index:v]scale=1080:-1,setsar=1,pad=1080:1920:0:(oh-ih)/2[v$index];"
    index=$((index + 1))
done

# Add silent audio for the images
inputs+="-f lavfi -t 1 -i anullsrc=channel_layout=stereo:sample_rate=44100 "

# Concatenate all video streams
concat_filter+="concat=n=$index:v=1:a=1[v][a]"

ffmpeg $inputs -filter_complex "$filter_complex $concat_filter" -map "[v]" -map "[a]" "$output_file"
```

That's it! Hope you found this useful and hope I didn't get anything too glaringly wrong. This script worked perfectly for me, but I'm sure there's probably even better and more concise ways of doing it.