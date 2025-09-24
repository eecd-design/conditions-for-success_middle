import { stopVideo } from "./helpers";

let dialogControl = (() => {

	let open = ({ dialogId, headingText = null, context = null }) => {
		let activeDialog = document.querySelector(
			"dialog[open]");
		let targetDialog = document.querySelector(
			`#${dialogId}`);
		if (!targetDialog) return;
		if (activeDialog) activeDialog.close();
		if (context) targetDialog.setAttribute('data-context', context);
		let heading = targetDialog.querySelector('h2');
		headingText = headingText ? headingText.trim() : heading.getAttribute('data-default-text').trim();
		if (heading && headingText !== heading.textContent) heading.textContent = headingText;
		targetDialog.showModal();
	}

	let close = (target) => {
		let dialog = target.closest('dialog');
		if (!dialog) return;
		stopVideo(dialog);
		dialog.close();
	}

	let onClick = (event) => {
		let target = event.target;
		if (target.matches('button.open-dialog')) {
			let dialogId = target.getAttribute('data-dialog');
			let headingText = target.getAttribute('data-dialog-heading');
			let context = target.getAttribute('data-dialog-context');
			open({
				dialogId,
				headingText,
				context
			});
		} else if (target.matches('dialog button.close-dialog')) {
			close(target);
		}
	}

	// TODO: event prevent default on enter key inside input fields

	// TODO: Unable to enter press button in assessor's dialog

	let init = () => {
		document.addEventListener('click', onClick);
	}

	let destroy = () => {
		document.removeEventListener('click', onClick);
	}

	return { init, destroy, open, close };

})();

export { dialogControl };