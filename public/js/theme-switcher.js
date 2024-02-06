// src: https://web.dev/articles/building/a-theme-switch-component#javascript
(function () {
	const STORAGE_KEY = "theme-preference";
	const LIGHT = "light";
	const DARK = "dark";

	const getColorPreference = () => {
		return (
			localStorage.getItem(STORAGE_KEY) ||
			(window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK : LIGHT)
		);
	};

	let theme = getColorPreference();

	const reflectPreference = () => {
		document.firstElementChild.setAttribute("data-theme", theme);

		document.querySelector("#theme-toggle")?.setAttribute("aria-label", theme);
	};

	const setPreference = () => {
		localStorage.setItem(STORAGE_KEY, theme);
		reflectPreference();
	};

	const onClick = () => {
		theme = theme === LIGHT ? DARK : LIGHT;
		setPreference();
	};

	window.addEventListener("load", () => {
		document.querySelector("#theme-toggle").addEventListener("click", onClick);
	});

	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", ({ matches: isDark }) => {
			theme = isDark ? DARK : LIGHT;
			setPreference();
		});

	reflectPreference();
})();
