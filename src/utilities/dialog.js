import { eventControl } from "./event";
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
		if (heading) {
			let defaultText = heading.getAttribute('data-default-text')?.trim() ?? heading.textContent;
			headingText = headingText ? headingText.trim() : defaultText;
			if (headingText !== defaultText) heading.textContent = headingText;
		}
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

	let init = () => {
		eventControl.add({
			selector: 'document',
			eventType: 'click',
			fn: onClick,
		})
	}

	return { init, open, close };

})();

export { dialogControl };