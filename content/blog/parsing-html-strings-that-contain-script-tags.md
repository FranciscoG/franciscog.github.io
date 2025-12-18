---
title: Parsing HTML strings that contain script tags
date: 2025-08-26
updated: 2025-09-04
syntax: true
tags:
  - js
  - html
  - Custom Elements
  - HTML Includes
---

In my [last post](/blog/html-includes/) I experimented with some ways to implement HTML includes with the technology available in browsers today. In that post I created a Custom Element that would fetch the HTML from a URL and inject that into the DOM. One of the things you might expect to happen during this process is if the HTML contained a `<script>` tag, it _should_ immediately (or eventually if it was deferred or async) evaluate that script upon insertion. Turns out that not all ways of parsing HTML strings containing script tags will execute scripts, in fact there's only 1 method that will excute them out of the box.

These are the main methods that parse an HTML string into a DOM tree:

1. [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
1. [`outerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML)
1. [`insertAdjacentHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)
1. [`DOMParser.parseFromString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString)
1. [`Range.createContextualFragment`](https://developer.mozilla.org/en-US/docs/Web/API/Range/createContextualFragment)
1. [`element.setHTMLUnsafe`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTMLUnsafe)
1. [`Document.parseHTMLUnsafe`](https://developer.mozilla.org/en-US/docs/Web/API/Document/parseHTMLUnsafe_static)

<aside>

<span class="aside-prefix">Note:</span>

There's also [`document.write`](https://developer.mozilla.org/en-US/docs/Web/API/Document/write) and [`document.writeln`](https://developer.mozilla.org/en-US/docs/Web/API/Document/writeln), but I've left them out because they are both deprecated and not recommended for use anymore. [`Element.append`](https://developer.mozilla.org/en-US/docs/Web/API/Element/append) also takes a string but it doesn't parse it into Nodes, it appends it as plain text like `textContent`.

</aside>

In the examples below, I'm going to include this piece of HTML, which can be found [here](/html/include-with-js.html), and you'll see in each demo whether it worked or not.

```html
<div>
	<p>
		This is a test include. You should have seen an <code>alert</code> by now
	</p>
	<script>
		window.alert("script ran");
	</script>
</div>
```

## innerHTML

This applies to `outerHTML`, `insertAdjacentHTML`, `setHTMLUnsafe`, and `parseHTMLUnsafe` as well.

Here's a Custom Element that will fetch the HTML fragment and insert it using the Custom Element's `innerHTML`:

```html
<x-include src="/path/to/header.html"></x-include>
<script>
	class CustomInclude extends HTMLElement {
		constructor() {
			super();
		}
		getSrc(src) {
			fetch(src)
				.then((response) => response.text())
				.then((domString) => {
					this.innerHTML = domString;
				});
		}
		connectedCallback() {
			const src = this.getAttribute("src");
			this.getSrc(src);
		}
	}
	window.customElements.define("x-include", CustomInclude);
</script>
```

Try it out:

<demo-component header delay-start>
<x-include-inner src="/html/include-with-js.html"></x-include-inner>
</demo-component>

This doesn't work because using `innerHTML` disables scripts for XSS security reasons. That doesn't make `innerHTML` safe, read more about security concerns [here](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations). But if you 100% trust the HTML source you're including, then you can get around this with some extra code:

```js
class CustomInclude extends HTMLElement {
	constructor() {
		super();
	}
	getSrc(src) {
		fetch(src)
			.then((response) => response.text())
			.then((domString) => {
				const frag = document.createDocumentFragment();
				// documentFragments don't have an innerHTML so we need to use
				// an intermediate element to convert the domString to nodes
				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = domString;
				for (const child of tempDiv.childNodes) {
					frag.appendChild(child);
				}

				let scriptOnlyProperties;

				// scripts created using `createElement` will be evaluated
				// upon insertion into the DOM so we just need to go through
				// all of the scripts in the documentFragment and replace them
				// with a new instance using document.createElement('script');
				Array.from(frag.querySelectorAll("script")).forEach((oldScript) => {
					const newScript = document.createElement("script");

					if (!scriptOnlyProperties) {
						// get only HTMLScriptElement properties, not the inherited ones 
						// from HTMLElement. We don't need the constructor either.
						scriptOnlyProperties = Object.getOwnPropertyNames(
							Object.getPrototypeOf(newScript)
						).filter((prop) => prop !== "constructor");
					}

					for (const prop in scriptOnlyProperties) {
						// one of the properties of a script element is .text which will
						// be the code in the script if it has any
						if (oldScript[prop]) newScript[prop] = oldScript[prop];
					}

					oldScript.parentElement.replaceChild(newScript, oldScript);
				});
				this.innerHTML = "";
				this.appendChild(frag);
			})
			.catch((e) => {
				console.warn(e);
			});
	}
	connectedCallback() {
		const src = this.getAttribute("src");
		this.getSrc(src);
	}
}
window.customElements.define("x-include", CustomInclude);
```

<demo-component header delay-start>
<x-include-inner-alt src="/html/include-with-js.html"></x-include-inner-alt>
</demo-component>

## Using DOMParser

Another way of parsing HTML strings is by using the [`DOMParser`](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser) API.

```html
<x-include src="/path/to/header.html"></x-include>
<script>
	class CustomInclude extends HTMLElement {
		constructor() {
			super();
		}
		parse(domString) {
			const root = new DOMParser().parseFromString(
				domString,
				"text/html"
			).documentElement;
			const html = document.importNode(root, true);
			const body = html.querySelector("body").childNodes;
			this.innerHTML = "";
			this.append(...body);
		}
		getSrc(src) {
			fetch(src)
				.then((response) => response.text())
				.then((domString) => {
					this.parse(domString);
				});
		}
		connectedCallback() {
			const src = this.getAttribute("src");
			this.getSrc(src);
		}
	}
	window.customElements.define("x-include", CustomInclude);
</script>
```

<demo-component header delay-start>
<x-include-dom-parser src="/html/include-with-js.html"></x-include-dom-parser>
</demo-component>

This doesn't work because the [HTML5 spec](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#the-domparser-interface) states that scripts inside documents created by using `DOMParser` should not be evaluated.

Again, you can probably get around this with the same method above where you replace the scripts with newly created `script` tags.

## Range.createContextualFragment

I actually didn't know about this one. I learned about it while reading through the [whatwg discussion I linked to](https://github.com/whatwg/html/issues/2791#issuecomment-317017668) in my previous post.

```html
<x-include src="/path/to/header.html"></x-include>
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
					this.innerHTML = "";
					this.appendChild(domFrag);
				})
				.catch((e) => {
					console.warn(e);
				});
		}

		connectedCallback() {
			const src = this.getAttribute("src");
			this.getSrc(src);
		}
	}
	window.customElements.define("x-include", CustomInclude);
</script>
```

<demo-component header delay-start>
<x-include src="/html/include-with-js.html"></x-include>
</demo-component>

Finally our JS got executed without any workarounds or hacks!

But why do some of these work and some don't?

When parsing HTML from a string and a `script` tag is encountered, the HTML Parser will internally maintain a boolean state called ["already started"](https://html.spec.whatwg.org/multipage/scripting.html#already-started) that will indicate whether this script will be evaluated or not. Depending on which parsing alogrithm is used determines whether this is initially set to true or false. Only a value of false means that the script _should_ be executed upon insertion.

[`innerHTML`](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#the-innerhtml-property), [`outerHTML`](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#the-outerhtml-property), [`insertAdjacentHTML`](<https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#the-insertadjacenthtml()-method>), [`element.setHTMLUnsafe`, and `Document.parseHTMLUnsafe`](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#unsafe-html-parsing-methods) all use the [HTML fragment parsing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#html-fragment-parsing-algorithm) which sets the "already started" flag to true, which means it should not be executed:

<figure>

> 4\. If the parser was created as part of the [HTML fragment parsing algorithm](https://html.spec.whatwg.org/multipage/parsing.html#html-fragment-parsing-algorithm), then set the script element's already started to true. ([fragment case](https://html.spec.whatwg.org/multipage/parsing.html#fragment-case))

<figcaption>

Source: [https://html.spec.whatwg.org/multipage/parsing.html#scriptTag](https://html.spec.whatwg.org/multipage/parsing.html#scriptTag)

</figcaption>
</figure>

As I mentioned above, the spec for `DOMParser` states that scripts should not be evaluated:

<figure>

> Note that script elements are **not evaluated during parsing**, and the resulting document's encoding will always be UTF-8. The document's URL will be inherited from parser's relevant global object.

<figcaption>

Source: [8.5.1 The DOMParser interface](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#:~:text=The%20DOMParser%20interface%20allows&text=Note%20that%20script%20elements%20are%20not%20evaluated%20during%20parsing)

</figcaption>
</figure>

The only method that does work is `Range.createContextualFragment` because the spec explicitly states that scripts "already started" state should be set to `false`, meaning that it should be executed upon insertion:

<figure>

> 8\. For each script of fragment node's script element descendants:
>
> 1\. Set script's [already started](https://html.spec.whatwg.org/multipage/scripting.html#already-started) to false.

<figcaption>

Source: [8.5.7 The createContextualFragment() method](<https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#the-createcontextualfragment()-method:~:text=For%20each%20script%20of%20fragment%20node's%20script%20element%20descendants:>)

</figcaption>
</figure>

What I'm not sure about is why the working group decided that `createContextualFragment` is the method that will execute scripts. Apparently it was originally an undocumented API that some libraries used (mainly PrototypeJS). I found some discussion about it here: [https://bugzilla.mozilla.org/show_bug.cgi?id=599588](https://bugzilla.mozilla.org/show_bug.cgi?id=599588). There was some disagreement and then they had an offline voice discussion and all agreed that scripts should be runnable. 🤷‍♂️

### Update

Fixed error and improved code in one of the code samples

{% js %}

<script src="/js/demo-component.js"></script>
<script>
	function getScriptOnlyProperties() {
		const tempScript = document.createElement('script');
		return Object.getOwnPropertyNames(Object.getPrototypeOf(tempScript))
		  .filter(prop => prop !== 'constructor')
	}
	const scriptProps = getScriptOnlyProperties();
	class CustomIncludeInner extends HTMLElement {
		constructor() {
			super();
		}
		getSrc(src) {
			fetch(src)
			.then((response) => response.text())
			.then((domString) => {
				this.innerHTML = domString;
			})
			.catch(e => { console.warn(e)})
		}
		connectedCallback() {
			const src = this.getAttribute("src");
			this.getSrc(src);
		}
	}
	window.customElements.define("x-include-inner", CustomIncludeInner);
	//
	class CustomIncludeInner2 extends HTMLElement {
		constructor() {
			super();
		}
		getSrc(src) {
			fetch(src)
			.then((response) => response.text())
			.then((domString) => {
				const frag = document.createDocumentFragment();
				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = domString;
				for (const child of tempDiv.childNodes) {
					frag.appendChild(child);
				}
				Array.from(frag.querySelectorAll('script')).forEach(oldScript => {
					const newScript = document.createElement('script');
					for (const prop of scriptProps) {
						if (oldScript[prop]) newScript[prop] = oldScript[prop]
					}
					oldScript.parentElement.replaceChild(newScript, oldScript);
				});
				this.appendChild(frag)
			})
			.catch(e => { console.warn(e)})
		}
		connectedCallback() {
			const src = this.getAttribute("src");
			this.getSrc(src);
		}
	}
	window.customElements.define("x-include-inner-alt", CustomIncludeInner2);
	//
	class CustomIncludeDomParser extends HTMLElement {
		constructor() {
			super();
		}
	  parse(domString) {
			const root = new DOMParser().parseFromString(domString, 'text/html').documentElement;
			const html = document.importNode(root, true);
			const body = html.querySelector(`body`).childNodes
			this.innerHTML = ''
      this.append(...body)
		}
		getSrc(src) {
			fetch(src)
				.then((response) => response.text())
				.then((domString) => {
					this.parse(domString)
				});
		}
		connectedCallback() {
			const src = this.getAttribute("src");
			this.getSrc(src);
		}
	}
	window.customElements.define("x-include-dom-parser", CustomIncludeDomParser);
	//
	class CustomIncludeFinal extends HTMLElement {
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
	window.customElements.define("x-include", CustomIncludeFinal);
</script>

{% endjs %}
