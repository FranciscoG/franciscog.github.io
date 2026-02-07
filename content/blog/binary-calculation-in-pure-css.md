---
title: Binary calculation in pure CSS and HTML
date:
draft: true
syntax: true
tags:
  - post
---

<aside class="supports">
  
  <span class="aside-prefix">Warning:</span>

  Your browser doesn't support some of the CSS used on this page. Please update your browser or try it in the latest version of Chrome.

</aside>

More experiments in visualizing with checkboxes. 

This time I wanted to see if I could use the checkboxes to represent an 8-bit binary number and calculate the decimal number from which inputs were checked. Using pure HTML and CSS, no JavaScript. 

<fieldset class="binary-container">
<label>
  <span>128</span>
  <input type="checkbox" id="bit-8" value="128">
</label>
<label>
  <span>64</span>
  <input type="checkbox" id="bit-7" value="64">
</label>
<label>
  <span>32</span>
  <input type="checkbox" id="bit-6" value="32">
</label>
<label>
  <span>16</span>
  <input type="checkbox" id="bit-5" value="16">
</label>
<label>
  <span>8</span>
  <input type="checkbox" id="bit-4" value="8">
</label>
<label>
  <span>4</span>
  <input type="checkbox" id="bit-3" value="4">
</label>
<label>
  <span>2</span>
  <input type="checkbox" id="bit-2" value="2">
</label>
<label>
  <span>1</span>
  <input type="checkbox" id="bit-1" value="1">
</label>

<output role="status" aria-live="polite" for="bit-1 bit-2 bit-3 bit-4 bit-5 bit-6 bit-7 bit-8">
</output>
</fieldset>

Thanks to modern CSS, especially the  [`:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has) pseudo-selector, this ended up being not too difficult to implement.

The one drawback is that I'm using CSS `content`, which is [not good for accessibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content#accessibility). The only other way I could think of doing this without `content` is to have 255 `<span>` elements in the output and a massive amount of CSS to hide/show the spans based on what was checked. It would be ridiculous.

Here's the HTML and relevant CSS for the above. 

```html
<style>
  fieldset {
    --b1: 0; --b2: 0; --b3: 0; --b4: 0;
    --b5: 0; --b6: 0; --b7: 0; --b8: 0;

    &:has(#bit-1:checked) {--b1: 1; }
    &:has(#bit-2:checked) {--b2: 2; }
    &:has(#bit-3:checked) {--b3: 4; }
    &:has(#bit-4:checked) {--b4: 8; }
    &:has(#bit-5:checked) {--b5: 16; }
    &:has(#bit-6:checked) {--b6: 32; }
    &:has(#bit-7:checked) {--b7: 64; }
    &:has(#bit-8:checked) {--b8: 128; }

    output::after {
      --result: calc(var(--b1) + var(--b2) + var(--b3) + var(--b4) + var(--b5) + var(--b6) + var(--b7) + var(--b8));
      counter-reset: result-counter var(--result);
      content: "Value: " counter(result-counter);
      display: inline-block;
    }
  }
</style>

<fieldset class="binary-container">
  <label>
    <span>128</span>
    <input type="checkbox" id="bit-8" value="128">
  </label>
  <label>
    <span>64</span>
    <input type="checkbox" id="bit-7" value="64">
  </label>
  <label>
    <span>32</span>
    <input type="checkbox" id="bit-6" value="32">
  </label>
  <label>
    <span>16</span>
    <input type="checkbox" id="bit-5" value="16">
  </label>
  <label>
    <span>8</span>
    <input type="checkbox" id="bit-4" value="8">
  </label>
  <label>
    <span>4</span>
    <input type="checkbox" id="bit-3" value="4">
  </label>
  <label>
    <span>2</span>
    <input type="checkbox" id="bit-2" value="2">
  </label>
  <label>
    <span>1</span>
    <input type="checkbox" id="bit-1" value="1">
  </label>

  <output role="status" aria-live="polite" for="bit-1 bit-2 bit-3 bit-4 bit-5 bit-6 bit-7 bit-8">
  </output>
</fieldset>
```

<style>
{% css %}

.binary-container {
  --b1: 0;
  --b2: 0;
  --b3: 0;
  --b4: 0;
  --b5: 0;
  --b6: 0;
  --b7: 0;
  --b8: 0;

  margin: 2rem 0;

  & label {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-right: 2rem;
  }

  & input {
    transform: scale(2);
  }

  & output {
    position: relative;
    display: block;
    margin-top: 3rem;
  }

  &:has(#bit-1:checked) {--b1: 1; }
  &:has(#bit-2:checked) {--b2: 2; }
  &:has(#bit-3:checked) {--b3: 4; }
  &:has(#bit-4:checked) {--b4: 8; }
  &:has(#bit-5:checked) {--b5: 16; }
  &:has(#bit-6:checked) {--b6: 32; }
  &:has(#bit-7:checked) {--b7: 64; }
  &:has(#bit-8:checked) {--b8: 128; }

  & output::after {
    --result: calc(var(--b1) + var(--b2) + var(--b3) + var(--b4) + var(--b5) + var(--b6) + var(--b7) + var(--b8));
    counter-reset: result-counter var(--result);
    content: "Value: " counter(result-counter);
    display: inline-block;
  }
}

.post-content .supports {
  display: none;
}

@supports not (selector(:has(*)) and selector(&) and selector(:scope)) {
   .post-content .supports {
    display: block;
  }
}

{% endcss %}
</style>