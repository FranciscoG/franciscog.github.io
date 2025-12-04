(function () {

	function scrollToAnchor(event) {
		// if a link href starts with '#', it's an internal link
		const href = event.currentTarget.getAttribute('href');

		// check if user prefers reduced motion
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			// if user prefers reduced motion, do not animate scroll
			return;
		}

		if (href && href.startsWith('#')) {
			event.preventDefault();
			const targetId = href.substring(1);
			const targetElement = document.getElementById(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth' });
				history.pushState(null, null, href);
			}
		}
	};

	document.addEventListener('DOMContentLoaded', function () {
		const links = document.querySelectorAll('.post-content a');
		for (const link of links) {
			// if a link href starts with '#', it's an internal link
			// remove target="_blank" for internal links
			// Don't really need this anymore because I fixed it in the markdown renderer
			// but leaving it here just in case
			const href = link.getAttribute('href');
			if (href && href.startsWith('#')) {
				link.removeAttribute('target');
			}
			link.addEventListener('click', scrollToAnchor);
		}
	});
})();