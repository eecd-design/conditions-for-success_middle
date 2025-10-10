let toastControl = (() => {

	const toastTimers = new WeakMap();
	const activeToasts = new Set;

	let show = ({ target, type, selector = null }) => {

		let toast;
		if (!selector) {
			toast = document.querySelector(`#${target.getAttribute(`data-toast-${type}`)}`);
		} else {
			toast = document.querySelector(`#${selector}`);
		}
		if (!toast) return;

		// Dismiss all other active toasts
		for (let activeToast of activeToasts) {
			activeToast.removeAttribute('open');
			if (toastTimers.has(activeToast)) clearTimeout(toastTimers.get(activeToast));
		}
		activeToasts.clear();

		// Show the new toast
		toast.setAttribute('open', '');
		// console.log('Opening Toast');
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