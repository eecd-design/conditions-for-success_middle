let toastControl = (() => {

	const toastTimers = new WeakMap();
	const activeToasts = new Set;

	let show = ({ target, type }) => {
		let toast = document.querySelector(`#${target.getAttribute(`data-toast-${type}`)}`);
		if (!toast) return;

		// Dismiss all other active toasts
		for (let toast of activeToasts) {
			toast.removeAttribute('open');
			if (toastTimers.has(toast)) clearTimeout(toastTimers.get(toast));
		}
		activeToasts.clear();

		// Show the new toast
		toast.setAttribute('open', '');
		activeToasts.add(toast);

		let duration = type === 'success' ? 2000 : 4000;
		let timer = setTimeout(() => {
			toast.removeAttribute('open');
			activeToasts.delete(toast);
		}, duration);

		toastTimers.set(toast, timer);
	};

	let hide = (toast) => {
		toast.removeAttribute('open');
		activeToasts.delete(toast);
		if (toastTimers.has(toast)) {
			clearTimeout(toastTimers.get(toast));
			toastTimers.delete(toast);
		}
	}

	return { show, hide };

})();

export { toastControl };