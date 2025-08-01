let dialogControl = (() => {

	let open = (dialogId) => {
		let activeDialog = document.querySelector(
		"dialog[open]");
		let targetDialog = document.querySelector(
		`#${dialogId}`);
		if (!targetDialog) return;
		if (activeDialog) activeDialog.close();
		targetDialog.showModal();
	}

	let close = (target) => {
		let dialog = target.closest('dialog');
		if (!dialog) return;
		dialog.close();
	}

	let onClick = (event) => {
		let target = event.target;
		if (target.matches('button.open-dialog')) {
			let dialogId = target.getAttribute('data-dialog');
			open(dialogId);
		} else if (target.matches('dialog button.close-dialog')) {
			close(target);
		}
	}

	let init = () => {
		document.addEventListener('click', onClick);
	}

	let destroy = () => {
		document.removeEventListener('click', onClick);
	}

	return { init, destroy, open };

})();

export { dialogControl };