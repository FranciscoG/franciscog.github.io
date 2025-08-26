/**
 * @element demo-component
 * @description A custom element that wraps its content in a styled container
 * with an optional simplified browser chrome like header.
 *
 * @example
 * <demo-component header delay-start>
 *   <p>Your content here</p>
 * </demo-component>
 */
class DemoComponent extends HTMLElement {
	constructor() {
		super();
		this.originalContent = "";
		this.header = "";
	}

	connectedCallback() {
		// Store the original content before modifying innerHTML
		this.originalContent = this.innerHTML;

		if (this.hasAttribute("header")) {
			this.header = `<div class="browser-header"></div>`;
		}

		if (!this.hasAttribute("delay-start")) {
			this.loadContent();
			return;
		}

		this.renderDelayStart();
	}

	renderDelayStart() {
		// Create initial state with button
		this.innerHTML = `
			<div class="demo-inner">
				${this.header}
				<div class="demo-content demo-delay-start">
					<button class="demo-load-btn" type="button">Run Demo</button>
				</div>
			</div>`;

		// Add click event listener to the button
		const loadButton = this.querySelector(".demo-load-btn");
		loadButton.addEventListener(
			"click",
			() => {
				const simpleEvent = new Event("demoContentLoaded");
				this.loadContent();
				this.dispatchEvent(simpleEvent);
			},
			{
				once: true,
			}
		);
	}

	loadContent() {
		this.innerHTML = `
		  <div class="demo-inner">
			  ${this.header}
			  <div class="demo-content">
				  ${this.originalContent}
			  </div>
			</div>`;
	}
}

window.customElements.define("demo-component", DemoComponent);
