import { eventControl } from "./event";
import { stopVideo } from "./helpers";

let dialogControl = (() => {

	let scrollY = 0;

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
			if (headingText !== heading.textContent) heading.textContent = headingText;
		}
		// Save scroll position
		scrollY = window.scrollY;
		// Lock background scroll
		document.body.style.position = 'fixed'
		document.body.style.top = `-${scrollY}px`

		targetDialog.showModal();
	}

	let close = (target) => {
		let dialog = target.closest('dialog');
		if (!dialog) return;
		stopVideo(dialog);
		// Disable smooth scroll
		document.documentElement.style.scrollBehavior = 'auto';
		// Unlock background scroll
		document.body.style.position = ''
		document.body.style.top = ''
		// Close dialog
		dialog.close();
		// Restore scroll
		window.scrollTo(0, scrollY);
		// Reset scroll behaviour
		requestAnimationFrame(() => {
			document.documentElement.style.scrollBehavior = ''
		})
	}

	let onClick = (event) => {
		let target = event.target
		let openDialogBtn = target.closest('button.open-dialog');
		if (openDialogBtn) {
			let dialogId = openDialogBtn.getAttribute('data-dialog');
			let headingText = openDialogBtn.getAttribute('data-dialog-heading');
			let context = openDialogBtn.getAttribute('data-dialog-context');
			open({
				dialogId,
				headingText,
				context
			});
		} else if (target.matches('dialog button.close-dialog')) {
			close(target);
		} else if (!target.closest('dialog')) {
			let openDialog = document.querySelector('dialog[open]');
			close(openDialog);
		}
	}

	let init = () => {
		eventControl.add({
			elem: document,
			eventType: 'click',
			fn: onClick,
		})
	}

	return { init, open, close };

})();

export { dialogControl };