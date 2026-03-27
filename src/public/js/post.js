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
			const targetId = href.substring(1);
			const targetElement = document.getElementById(targetId);
			if (targetElement) {
				event.preventDefault();
				targetElement.scrollIntoView({ behavior: 'smooth' });
				history.pushState(null, null, href);
			}
		}
	};

	document.addEventListener('DOMContentLoaded', function () {
		const postContent = document.querySelector('.post-content');
		postContent.addEventListener('click', function (event) {
			const target = event.target;
			if (target.tagName === 'A') {
				scrollToAnchor(event);
			}
		});
	});
})();