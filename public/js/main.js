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

	window.addEventListener("pagereveal", async (pageRevealEvent) => {
		try {
			// I only want to run transitions when navigating from the home page to an internal page
			const fromUrl = window.navigation?.activation?.from?.url;
			const toUrl = window.navigation?.currentEntry?.url;

			if (fromUrl && toUrl && (toUrl.includes('blog') || toUrl.includes('drafts'))) {
				const fromPathname = new URL(fromUrl).pathname.replace("/index.html", "/");

				if (fromPathname === "/" && pageRevealEvent.viewTransition) {
					document.documentElement.classList.add('view-transitioning');
					await pageRevealEvent.viewTransition.finished;
					document.documentElement.classList.remove('view-transitioning');
					return;
				}
			}

			// skip the transition for all other cases
			pageRevealEvent.viewTransition?.skipTransition();
		} catch (error) {
			console.error('Error in pagereveal handler:', error);
		}
	});

	document.addEventListener('DOMContentLoaded', () => {

		// only add the expand buttons on wider screens
		const mediaQuery = window.matchMedia('(min-width: 58rem)');
		if (mediaQuery.matches) {
			document.querySelectorAll('.post-content pre[class*=language-]').forEach((block) => {
				const preBlock = /** @type {HTMLElement} */ (block);
				if (preBlock) {
					const button = document.createElement('button');
					button.className = 'expand-code-button';
					button.type = 'button';
					button.textContent = 'expand';

					button.addEventListener('click', () => {
						preBlock.classList.toggle('expanded');
						button.textContent = preBlock.classList.contains('expanded') ?
							'collapse' :
							'expand';
					});

					preBlock.style.position = 'relative';
					preBlock.appendChild(button);
				}
			});
		}

	});

})();