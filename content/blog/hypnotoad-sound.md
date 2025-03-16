---
title: Recreating the Hypnotoad Sound with JS
date: 2025-03-16
syntax: true
tags:
  - js
	- p5
---

Not long ago I came across this [blog post](https://keliris.dev/articles/deep-note), via [Reddit](https://www.reddit.com/r/javascript/comments/1dywp7x/recreating_the_thx_deep_note_in_javascript/), about how someone recreated THX’s signature [“Deep Note”](https://en.wikipedia.org/wiki/Deep_Note) sound using Javascript. It reminded me of a similar project I worked on which involves recreating another well known signature sound from popular culture, Futurama’s Hypnotoad sound, which actually has a name: “Angry Machine"

The THX sound was made using [Tone.js](https://tonejs.github.io/). I wanted to use [p5.js](https://p5js.org/) because I also planned on putting it on an Arduino which uses Processing. But then I later found out that p5.js's sound module is just a wrapper around Tone.js so I ended up using it either way.

First, here’s a clip showing you the sound I'm trying to achieve:

[https://www.youtube.com/watch?v=zHU2RlSCdxU](https://www.youtube.com/watch?v=eFhmihe3eUM)

## Prior Art

As I was researching how to recreate this sound I found this excellent blogpost by Scott Smitelli who analyzed the original audio and figured out how to recreate it using Adobe Audition: [https://www.scottsmitelli.com/articles/everybody-imitates-hypnotoad](https://www.scottsmitelli.com/articles/everybody-imitates-hypnotoad)

I highly recommend reading that post, but basically the sound boils down to:

- make some Brown noise
- add delay, around 25ms
- pass it through a Fast Fourier Transform (FFT) filter with customized points (see blog post for details on that)

P5’s Sound module has all of the methods I need to recreate this:

- [p5.Noise](https://p5js.org/reference/p5.sound/p5.Noise/)
- [p5.Delay](https://p5js.org/reference/p5.sound/p5.Delay/)
- [p5.Filter](https://p5js.org/reference/p5.sound/p5.Filter/)
- [p5.FFT](https://p5js.org/reference/p5.sound/p5.FFT/), although this is only able to analyze and not actually filter

In the end I was able to recreate the sound with just the delay and and noise. It's not exact, but it's close enough. Scott's version is much closer but he's using an actual audio program and not JavaScript. 

Here's the code:

```js
let noise;
let delay;

function setup() {
  noise = new p5.Noise("brown");
  delay = new p5.Delay();
  delay.process(noise, 0.025, 0.8);
}

function mousePressed() {
  if (noise.started) {
    noise.stop();
  } else {
    noise.start();
  }
}
```

<button id="angry-machine" type="button">Click here to try it out</button>

All hail the Hypnotoad!

{% js %}
<script src="https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js"></script>
<script src="/js/p5.sound.min.js"></script>
<script>
let isOn = false;
let noise;
let delay;

function setup() {
	noise = new p5.Noise("brown");
	delay = new p5.Delay();
	delay.process(noise, 0.025, 0.8);
}

document.getElementById("angry-machine").addEventListener("click", () => {
	if (isOn) {
		isOn = false;
		noise.stop();
	} else {
		isOn = true;
		noise.start();
	}
});
</script>
{% endjs %}