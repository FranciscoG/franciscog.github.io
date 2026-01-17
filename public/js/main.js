(function () {
	'use strict';

	/**
	 * 
	 * @param {boolean} isEnabled 
	 */
	function toggleEnableTransitionsUI(isEnabled) {
		document.documentElement.classList.toggle('transitions-enabled', isEnabled);
	}

	// I need to force the type of this to HTMLInputElement
	const enableTransitionsCheckbox = /** @type {HTMLInputElement | null} */
		(document.getElementById('enable-transitions-checkbox'));

	if (enableTransitionsCheckbox) {
		const transitionsEnabled = localStorage.getItem('transitionsEnabled') === 'true';
		enableTransitionsCheckbox.checked = transitionsEnabled;
		toggleEnableTransitionsUI(enableTransitionsCheckbox.checked);

		enableTransitionsCheckbox.addEventListener('change', () => {
			localStorage.setItem('transitionsEnabled', enableTransitionsCheckbox.checked.toString());
			toggleEnableTransitionsUI(enableTransitionsCheckbox.checked);
		});

	}

	if (!window.navigation) {
		return;
	}

	window.addEventListener("pagereveal", async (pageRevealEvent) => {
		try {
			// I only want to run transitions when navigating from the home page to an internal page
			if (window.navigation?.activation?.from?.url && window.navigation?.currentEntry?.url) {
				const currentURL = new URL(window.navigation.activation.from.url);
				const destinationURL = new URL(window.navigation.currentEntry.url);
				const currentPathname = currentURL.pathname.replace("/index.html", "/");
				const destinationPathname = destinationURL.pathname.replace("/index.html", "/");
				if (currentPathname === "/" && destinationPathname !== "/" && pageRevealEvent.viewTransition) {
					document.documentElement.dataset.transition = 'internal';
					await pageRevealEvent.viewTransition.finished;
					delete document.documentElement.dataset.transition;
					return;
				}
			}
			pageRevealEvent.viewTransition?.skipTransition();
		} catch (error) {
			console.error('Error in pagereveal handler:', error);
		}
	});
})();