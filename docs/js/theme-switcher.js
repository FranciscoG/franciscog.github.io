/*
Color Theme handler
-------------------
started from this src:
https://web.dev/articles/building/a-theme-switch-component#javascript
*/

class ColorTheme {
	constructor() {
		this.STORAGE_KEY = "theme-preference";
		this.LIGHT = "light";
		this.DARK = "dark";
		this.selector = "#color-scheme-select";

		/**
		 * @type {'auto'|'light'|'dark'}
		 */
		this.userSelectedTheme = localStorage.getItem(this.STORAGE_KEY) || "auto";
		// this.systemTheme = this.getSystemPreference();

		this.reflectPreference = this.reflectPreference.bind(this);
		this.setPreference = this.setPreference.bind(this);

		window.addEventListener("load", this.onLoad.bind(this));

		// window
		// 	.matchMedia("(prefers-color-scheme: dark)")
		// 	.addEventListener("change", this.onMatch.bind(this));

		this.reflectPreference();
	}

	onLoad() {
		document
			.querySelector(this.selector)
			.addEventListener("change", this.themeOnChange.bind(this));

		document.querySelector(this.selector).value = this.userSelectedTheme;
	}

	/**
	 * System theme changed
	 * @param {MediaQueryListEvent} e
	 */
	// onMatch(e) {
	// 	this.systemTheme = e.matches ? this.DARK : this.LIGHT;
	// 	this.reflectPreference();
	// }

	// getSystemPreference() {
	// 	return window.matchMedia("(prefers-color-scheme: dark)").matches
	// 		? this.DARK
	// 		: this.LIGHT;
	// }

	reflectPreference() {
		if (this.userSelectedTheme === "auto") {
			// remove the attribute and let css handle it
			document.firstElementChild.removeAttribute("data-theme");
		} else {
			document.firstElementChild.setAttribute(
				"data-theme",
				this.userSelectedTheme
			);
		}
	}

	setPreference() {
		if (this.userSelectedTheme !== "auto") {
			localStorage.setItem(this.STORAGE_KEY, this.userSelectedTheme);
		} else {
			// for auto we remove the key
			localStorage.removeItem(this.STORAGE_KEY);
		}
		this.reflectPreference();
	}

	/**
	 * User manually changed the theme
	 * @param {Event & { target: HTMLSelectElement }} e
	 */
	themeOnChange(e) {
		this.userSelectedTheme = e.target.value;
		this.setPreference();
	}
}

window.ColorTheme = new ColorTheme();
