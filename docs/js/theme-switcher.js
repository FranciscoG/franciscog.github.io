// src: https://web.dev/articles/building/a-theme-switch-component#javascript

class ThemeToggle {
	constructor() {
		this.STORAGE_KEY = "theme-preference";
		this.LIGHT = "light";
		this.DARK = "dark";
		this.selector = "#theme-toggle";
		this.theme = this.getColorPreference();

		this.reflectPreference = this.reflectPreference.bind(this);
		this.setPreference = this.setPreference.bind(this);

		window.addEventListener("load", this.onLoad.bind(this));

		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", this.onMatch.bind(this));

		this.reflectPreference();
	}

	onLoad() {
		document
			.querySelector(this.selector)
			.addEventListener("change", this.themeOnChange.bind(this));
	}

	onMatch(e) {
		const isDark = e.matches;
		this.theme = isDark ? this.DARK : this.LIGHT;
		this.setPreference();
	}

	getColorPreference() {
		return (
			localStorage.getItem(this.STORAGE_KEY) ||
			(window.matchMedia("(prefers-color-scheme: dark)").matches
				? this.DARK
				: this.LIGHT)
		);
	}

	reflectPreference() {
		document.firstElementChild.setAttribute("data-theme", this.theme);
		const toggle = document.querySelector(this.selector);
		if (toggle) {
			toggle.checked = this.theme === this.DARK;
		}
	}

	setPreference() {
		localStorage.setItem(this.STORAGE_KEY, this.theme);
		this.reflectPreference();
	}

	themeOnChange(e) {
		this.theme = e.target.checked ? this.DARK : this.LIGHT;
		this.setPreference();
	}
}

window.themeToggle = new ThemeToggle();
