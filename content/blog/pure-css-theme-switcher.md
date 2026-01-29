---
title: Pure CSS theme switcher
date: 2025-04-08
syntax: true
tags:
  - CSS
---

I have a simple theme switcher on my site and currently it relies on JavaScript to function properly. However, if anyone came to my site with JavaScript disabled, it wouldn't do anything, which isn't a great user experience. In this post I'm going to show you how easy it is to make it work with JavasScript disabled using pure CSS only, meaning that I don't have to touch the HTML at all.

First, 2 things to note:

1. I have a `<select>` nested within my `<header>`
2. CSS looks for a `data-theme` attributes on the root `html` tag

Do you see the issue there? My styles are based on the root element but my select is nested a few elements deep, so how does something deeply nested affect the styles at the root? This is where new CSS `:has()` pseudo-selector come into play:

```css
html:has(option[value="dark"]:checked) {
	/* your dark mode properties here */
}
```

So now if the user chooses the dark theme, the site will reflect that change. If the user goes to another page they'll have to do it again because there's no persistence between URLs without JS. But at least we have a working `select` now!

Next we need to make this change only apply when JavaScript is disabled. In the past you'd probably reach for the `<noscript>` tag or add some kind of CSS class on the `html` or `body` that was removed by JavaScript (e.g. `.no-js`). Today we can use the `scripting` media query:

```css
@media (scripting: none) {
	html:has(option[value="dark"]:checked) {
		/* your dark mode styles here */
	}
}
```

Finally, I want to hide the theme switcher in older browsers that don't support these new CSS features. I can't use `@supports` on the `scripting` media query but the good thing about using an unsupported media query is that it will just skip that entire block.

```css
/* hide it by default */
.color-theme-picker {
	display: none;
}
@media (scripting: enabled) {
	/* if 'scripting' query is supported and JS is turned on, we show the select */
	.color-theme-picker {
		display: block;
	}
}
@media (scripting: none) {
	html:has(option[value="dark"]:checked) {
		/* your dark mode styles here */
	}
	/* if 'scripting' query is supported and JS is turned off, we show the select */
	.color-theme-picker {
		display: block;
	}
}
```

`:has` and `scripting` both became widely available in browsers in 2023. If neither are supported, there's still the back-up of the system preference as long as their browser supports the `prefers-color-scheme: dark` query, and lastly it will just default to the light theme.

### Reference

- `:has()`  [caniuse](https://caniuse.com/css-has) | [mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- `@media (scripting)`  [caniuse](https://caniuse.com/?search=scripting) | [mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/scripting)
