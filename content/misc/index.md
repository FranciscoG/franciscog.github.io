---
layout: layouts/base.webc
eleventyNavigation:
  key: Misc
  order: 4
---
# Miscellany

I maintain a [Spotify Playlist](https://open.spotify.com/playlist/3dBiKJSoAQ6msoYzl99wp2?si=9b28df94ffc440be) of downtempo chill electronic music that I like to listen to while working. I originally started this playlist as a collaborative one that I posted on some dev related subreddits (when someone asked about what music they listen to while working), hence the name "Reddit Coders: Downtempo". It was going well for a while but then someone wiped out the whole playlist one day. Thankfully I kept a back-up but it's no longer collaborative. 

<div id="spotify-embed"></div>
{% js %}
  // if user has JS disabled then this iframe should never load and they can use the link in the text above
  (function(){
    const iframe = document.createElement('iframe');
    iframe.style.borderRadius = "12px";
    iframe.src = "https://open.spotify.com/embed/playlist/3dBiKJSoAQ6msoYzl99wp2?utm_source=generator&theme=0";
    iframe.width = "100%";
    iframe.height = "380";
    iframe.frameBorder = "0";
    iframe.allowfullscreen = "";
    iframe.allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    document.getElementById('spotify-embed').appendChild(iframe)
  })()
{% endjs %}
