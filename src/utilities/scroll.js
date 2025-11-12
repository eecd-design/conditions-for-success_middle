import { getUserData } from "src/stores/userDataStore";
import { eventControl } from "./event";
import { dialogControl } from "./dialog";

let scrollControl = (() => {

	/** 
	 * Adjust scroll after browser jump, accounting for header offset.
	 * @param {boolean} smooth - Whether to animate the adjustment.
	 */
	let adjustScroll = (target, smooth = true) => {

		if (!target) return;

		let defaultOffset = target.dataset.defaultOffset ? Number(target.dataset.defaultOffset) : 48;

		let stickyToolbar = document.querySelector(`#assessment-controls`);
		let stickyOffset = 0;
		if (stickyToolbar) {
			let styles = getComputedStyle(stickyToolbar);
			let isSticky = styles.position === 'sticky' || styles.position === 'fixed';
			let isVisible = stickyToolbar.offsetParent !== null;
			if (isSticky && isVisible) stickyOffset = stickyToolbar.offsetHeight;
		}

		let targetRect = target.getBoundingClientRect();

		console.log(targetRect.top, defaultOffset, stickyOffset);

		let absoluteY = window.scrollY + targetRect.top - defaultOffset - stickyOffset;

		console.log('Scrolling To: ', absoluteY);

		window.scrollTo({
			top: absoluteY,
			behavior: smooth ? 'smooth' : 'instant',
		})

		console.log('Scroll Position: ', window.scrollY);

	}

	/** 
	 * Handle new hash navigation or initial load. 
	 */
	let handleHash = (smooth = true) => {

		let hash = window.location.hash;
		if (!hash) return;

		let target = null;

		if (hash.includes("consideration")) {

			let tag = hash
				.replace(/^#consideration-/, "")
				.replace(/-/g, ".");

			let consideration = document.querySelector(`[value="${tag}"]`);
			if (!consideration) return;

			let accordion = consideration.closest(".accordion");
			let accordionBtn = accordion?.querySelector(".heading button");
			if (!accordion || !accordionBtn) return;

			if (accordionBtn.hasAttribute('aria-expanded')) {
				if (accordionBtn.getAttribute("aria-expanded") !== "true") accordionBtn.click();
			} else {
				document.addEventListener('accordionSetupComplete', () => {
					if (accordionBtn.getAttribute("aria-expanded") !== "true") accordionBtn.click();
				}, { once: true });
			}

			target = accordion;

		} else {

			target = document.querySelector(hash);

		}

		if (!target) return;

		// Wait for browser's native jump and reflow to finish
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (target?.isConnected) adjustScroll(target, smooth);
			});
		});


	};

	let onPageLoad = (event) => {
		handleHash(false);
	}

	let onPopstate = (event) => {

		// If link was within a dialog, close it
		let activeDialog = document.querySelector(
			"dialog[open]",
		);
		if (activeDialog) dialogControl.close(activeDialog);

		handleHash(true);
	}

	let init = () => {

		// Prevent browser from auto-scrolling on load
		if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

		handleHash(false);

		eventControl.add({
			elem: document,
			eventType: 'astro:page-load',
			fn: onPageLoad,
		})
		eventControl.add({
			elem: window,
			eventType: 'popstate',
			fn: onPopstate,
		})

	}

	return { init }

})();

export { scrollControl };