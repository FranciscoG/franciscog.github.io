---
title: Experiments in HTML includes
date: 2025-08-22
syntax: true
---

I was curious to see what could be done today to create a site without any server side code, no build process, but still allow you to modularize parts of your layout. I'm certainly not the first one to write about this but I wanted to use this post as means to getting more familiar with the various options.

In the post I'm going to explore the following:

1. iframe element
1. object element
1. Using fetch
1. Using Custom Elements

## iframe

Lets start with the obvious. The iframe has been around forever and is supported by every major browser. It _can_ be leveraged as an HTML include, but not without some help. First, let's look at what using an iframe looks like out of the box. Take this example below. It's including [this html file](/html/header.html) which just contains a fragment of HTML and no included styles:

```html
<body>
	<iframe src="/path/to/header.html" width="100%"></iframe>
	<main>Your page specific content</main>
</body>
```

<demo-component header delay-start>
<iframe src="/html/header.html" width="100%"></iframe>
<p class="demo-content">My main content</p>
</demo-component>

In the demo you'll notice a few things:

- Page styles do not get applied to content inside the iframe.
- The iframe itself has some terrible default styling. By default it has a set dimension of 300px width by 150px height, and also comes with a 2px border. For the purposes of this demo I gave it a new 100% width.
- And depening on your internet connection, it could take a quick, but noticeable, moment to load the content. This is not great for something like a header that it is the first thing users will see on the page.

The first and last issues are due to the fact that the iframe loads content into a completely separate [Browing Context](https://developer.mozilla.org/en-US/docs/Glossary/Browsing_context). Basically a web page within a web page. Setting up that context and loading the resource contributes to that delay, and it being isolated from the parent page cause the lack of styling.

We can fix the styling issues without JavaScript by including styles within the html file being loaded. But that comes with it's own pros and cons:

**Pros:**
- We get scoped styles for our component without any build steps or JavaScript. That's pretty cool.

**Cons:**
- We need to repeat some of the base styles from the page. This could be negligible depending on the size and complexity of your site, but even if so, it still feels wrong to have to repeat CSS.
- Speaking of repeating styles... If you plan on using the HTML more than once on a page, you'll be repeating all of the CSS it comes with as well.
- iframes can't auto-size themsevles based on their content so without JS we need to give it dimensions. Widths are less of an issue as setting it to `100%` covers most cases, it's the height that requires some more planning, especially when it comes to different screen sizes.

Here's that same example from above but with styles included within the [source](/html/header-with-css.html) and some dimensions given to the iframe:

```html
<body>
	<style>
		iframe { border: none; width: 100%; height: 60px; }
		/* should also use @media to change height for different screen sizes */
	</style>
	<iframe src="/path/to/header-with-css.html"></iframe>
	<main>Your page specific content</main>
</body>
```
<demo-component header delay-start>
<iframe src="/html/header-with-css.html" id="demo-with-css"></iframe>
<p class="demo-content">My main content</p>
</demo-component>

Much nicer now. But we had to repeat styles and we had to know the exact dimensions of the header to get it to look good. Let's take it to the next level using JavaScript. I saw an interesting solution on [css-tricks](https://css-tricks.com/the-simplest-ways-to-handle-html-includes/), which actually credits [this post](https://www.filamentgroup.com/lab/html-includes/). Basically, when html within the iframe is loaded, we use JS to grab the markup and replace the iframe that loaded it with that markup. This allows the styles of the page to get applied to it.

```html
<body>
	<iframe src="/path/to/header.html" onload="swap(this);" width="100%" style="border: none"></iframe>
	<main>Your page specific content</main>
	<script>
		function swap(iframe) {
			// if the src is an SVG it will not have .body so we need to check for both
			const root = iframe.contentDocument.body || iframe.contentDocument;
			Array.from(root.children).forEach((child) => {
				iframe.parentElement.insertBefore(child, iframe);
			});
			iframe.remove();
		}
	</script>
</body>
```

<demo-component header delay-start>
<iframe src="/html/header.html" onload="swap(this);" width="100%" style="border: none"></iframe>
<p class="demo-content">My main content</p>
</demo-component>

Much better in terms of developer experience because we don't have to repeat styles any more. But still not great becuase we get a flash of unstyled content and layout shift while it's being loaded. 

## object

Another option is the `<object>` element, which is very similar to an iframe. The one added perk is that you can put fallback/loading content in between the object tag that will render immediately until the data is finished loading. 

```html
<body>
	<object
		type="text/html"
		data="/path/to/header.html"
		width="100%"
		onload="swap(this);"
	>
		<span>loading...</span>
	</object>
	<main>Your page specific content</main>
</body>
```

<demo-component header delay-start>
  <object type="text/html" data="/html/header.html" width="100%" height="60" onload="swap(this);">
	  <span>loading...</span>
	</object>
	<p class="demo-content">My main content</p>
</demo-component>

Pretty much the same result as the iframe with the same limitations.

<aside>

There's also the `<embed>` element but it has limitations when using using it with `text/html` content that doesn't allow you to access the content with JavaScript so we can't swap out the content. So I would use an iframe or object instead.

</aside>

A quick note about using iframe and object before we continue on to the next section. I would use them sparingly because they are not lightweight. You need to think of them as if the were whole browser tabs within your page. Although that being said, any site that has google ads and social media buttons is most likely loading those in iframes. For example, theverge.com had 24 iframes on their home page last I checked (with ad-blocker turned off), so maybe it's not that bad if your site has a few iframes here and there.

Also, I didn't even get into the accessibility of iframes and objects, but you can read more about that in this article: [https://www.tempertemper.net/blog/using-iframes-to-embed-arbitrary-content-is-probably-a-bad-idea](https://www.tempertemper.net/blog/using-iframes-to-embed-arbitrary-content-is-probably-a-bad-idea)

## Fetch

This is a simple JavaScript solution, similar to how we were swapping out the iframe content in the example above, except that we are using `fetch` to retrieve our HTML fragment. In this example below I'm using an `htmx` like approach with the data attribute indicating the resource to fetch and swapping out the element with the fetched content:

```html
<body>
	<div data-get="/path/to/header.html">
		<!-- include fallback or loading content here -->
	</div>
	<main>Your page specific content</main>
	<script>
		document.querySelectorAll("[data-get]").forEach((target) => {
			fetch(target.dataset.get)
				.then((response) => response.text())
				.then((text) => {
					const range = document.createRange();
					range.selectNode(target.parentElement);
					const documentFragment = range.createContextualFragment(domString);
					target.parentElement.replaceChild(documentFragment, target);
				})
				.catch(e => {
					// handle error
					console.warn(e);
				})
		});
	</script>
</body>
```

<demo-component header delay-start id="dataGet">
<div data-get="/html/header.html">
		<span>loading header.html...</span>
</div>
<p class="demo-content">My main content</p>
</demo-component>

2 things to note;

- this is faster than the iframe because we don't have to intialize the browser context on top of fetching the resource
- notice the use of `Range.createContextualFragment`. This methods parses and executes any JavaScript within the fragment. `innerHTML` and `outerHTML` do not do that.


## Custom Elements

Almost exactly like the fetch example above, but wrapping it in a custom element instead:

```html
<body>
	<x-include src="/path/to/header.html"></x-include>
	<main>Your page specific content</main>
	<script>
		class CustomInclude extends HTMLElement {
			constructor() {
				super();
			}

			parse(domString) {
				const range = document.createRange();
				range.selectNode(this);
				const documentFragment = range.createContextualFragment(domString);
				return documentFragment;
			}

			getSrc(src) {
				fetch(src)
				.then((response) => response.text())
				.then((domString) => {
					const domFrag = this.parse(domString, this);
					this.innerHTML = '';
					this.appendChild(domFrag);
				})
				.catch(e => { console.warn(e)})
			}

			connectedCallback() {
				const src = this.getAttribute("src");
				this.getSrc(src);
			}
		}
		window.customElements.define("x-include", CustomInclude);
	</script>
</body>
```

<demo-component header delay-start>
<x-include src="/html/header.html"></x-include>
<p class="demo-content">My main content</p>
</demo-component>

## Conclusion

iframes and objects are decent fallback solutions, especially if you need to support older browsers, or if you prefer to have non-JavaScript solutions.

Custom Elements are an improvement but they still need JavaScript to work.

Ideally we need something like the iframe but without the overhead of all of that browsing context setup and isolation. There is an [active discussion](https://github.com/whatwg/html/issues/2791) about adding something to the spec, but it's still in very early stages.


{% js %}
<script src="/js/demo-component.js"></script>
<script>
	// parses HTML string in a way that will run any JS scripts when inserted 
	// into the DOM.
	function parseDomString(domString, target) {
			const range = document.createRange();
			range.selectNode(target);
			const documentFragment = range.createContextualFragment(domString);
			return documentFragment;
	}
	// used by the iframes to swap out content
	function swap(context) {
		Array.from(context.contentDocument.body.children).forEach(child => {
			context.parentElement.insertBefore(child, context);
		});
		context.remove();
	}
	// fetch external HTML fragment and insert it into the DOM
	function getAndReplace(url, target){
		fetch(url)
			.then((response) => response.text())
			.then((domString) => {
				const fragment = parseDomString(domString, target);
				target.parentElement.replaceChild(fragment, target);
			});
	}
	//
	document.getElementById('dataGet').addEventListener('demoContentLoaded', function() {
		document.querySelectorAll('[data-get]').forEach((target) => {
			getAndReplace(target.dataset.get, target);
		})
	});
	//
	class CustomInclude extends HTMLElement {
		constructor() {
			super();
		}
		load(src) {
			fetch(src)
			.then((response) => response.text())
			.then((domString) => {
				const domFrag = parseDomString(domString, this);
				this.appendChild(domFrag);
			})
			.catch(e => { console.warn(e)})
		}
		connectedCallback() {
			const src = this.getAttribute("src");
			this.innerHTML = "";
			this.load(src);
		}
	}
	customElements.define("x-include", CustomInclude);
</script>
{% endjs %}

<style>
{% css %}
iframe {
  display: block;
}
iframe#demo-with-css { border: none; width: 100%; height: 60px; }
@media screen and (max-width: 512px) {
	iframe#demo-with-css { height: 120px; }
}

.demo {
	padding: 10px;
	border: 1px solid SlateGrey;
	color: black;
}
[data-theme="dark"] .demo {
	color: #fff;
}
@media (prefers-color-scheme: dark) {
	.demo {
		color: #fff;
	}
}
.demo-header, .demo-footer { padding: 1rem; margin: 0; }
.demo-content { padding: 1rem; margin: 0;}
.demo-header {
	padding: 10px;
	display: flex;
	gap: 50px;
	align-items: center;
}
.demo-header .h1 {
	font-size: 1.4rem;
}
.demo-header nav ul {
	list-style-type: none;
	display: flex;
	gap: 20px;
	align-items: center;
	padding: 0;
	margin: 0;
}
{% endcss %}
</style>
