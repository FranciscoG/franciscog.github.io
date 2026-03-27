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
		this.VALUES = ["light", "auto", "dark"];

		/** @type {'auto'|'light'|'dark'} */
		this.userSelectedTheme = localStorage.getItem(this.STORAGE_KEY) || "auto";

		this.reflectPreference = this.reflectPreference.bind(this);
		this.setPreference = this.setPreference.bind(this);

		window.addEventListener("load", this.onLoad.bind(this));

		this.reflectPreference();
	}

	onLoad() {
		// New icon switcher
		const switcher = document.querySelector(".theme-switcher");
		if (switcher) {
			this.buttons = switcher.querySelectorAll(".theme-switcher-btn");
			this.indicator = switcher.querySelector(".theme-switcher-indicator");

			this.buttons.forEach((btn) => {
				btn.addEventListener("click", () => {
					this.userSelectedTheme = btn.dataset.themeValue;
					this.setPreference();
					this.updateSwitcher();
				});
			});

			this.updateSwitcher();
		}

		// No-JS fallback select (inside <noscript>, won't exist with JS enabled)
		const select = document.querySelector("#color-scheme-select");
		if (select) {
			select.addEventListener("change", (e) => {
				this.userSelectedTheme = e.target.value;
				this.setPreference();
			});
			select.value = this.userSelectedTheme;
		}
	}

	updateSwitcher() {
		if (!this.buttons) return;

		this.buttons.forEach((btn) => {
			const isActive = btn.dataset.themeValue === this.userSelectedTheme;
			btn.setAttribute("aria-checked", isActive ? "true" : "false");
		});

		const position = this.VALUES.indexOf(this.userSelectedTheme);
		if (this.indicator && position !== -1) {
			this.indicator.setAttribute("data-position", position);
		}
	}

	reflectPreference() {
		if (this.userSelectedTheme === "auto") {
			const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			if (isDark) {
				document.firstElementChild.setAttribute("data-theme", this.DARK);
			} else {
				document.firstElementChild.setAttribute("data-theme", this.LIGHT);
			}
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
			localStorage.removeItem(this.STORAGE_KEY);
		}
		this.reflectPreference();
	}
}

window.ColorTheme = new ColorTheme();
