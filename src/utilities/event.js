let eventControl = (() => {

	/**
	 * Event manager for Astro view transitions
	 * Ensures events are reattached correctly after swaps
	 */
	let eventRegistry = [];

	/**
	 * Register an event listener on an element that persists across swaps
	 * @param {Object} options
	 * @param {HTMLElement} options.elem - The element to bind the event on
	 * @param {string} options.eventType - The event type (e.g. "click")
	 * @param {Function} options.fn - The event handler
	 */
	let initEvent = ({ elem, eventType, fn }) => {
		if (!elem) return;

		// Store event in registry
		eventRegistry.push({ elem, eventType, fn });

		// Attach immediately
		elem.addEventListener(eventType, fn);
	};

	/**
	 * Remove all registered listeners
	 */
	let detachAll = () => {
		for (let { elem, eventType, fn } of eventRegistry) {
			elem.removeEventListener(eventType, fn);
		}
	};

	/**
	 * Reattach all registered listeners
	 */
	let attachAll = () => {
		for (let { elem, eventType, fn } of eventRegistry) {
			// Re-query in case the element was replaced during swap
			let freshElem = document.getElementById(elem.id) || elem;
			freshElem.addEventListener(eventType, fn);
		}
	};

	// Attach lifecycle handlers only once
	document.addEventListener("astro:before-swap", detachAll);
	document.addEventListener("astro:after-swap", attachAll);

	return { initEvent };

})();

export { eventControl };