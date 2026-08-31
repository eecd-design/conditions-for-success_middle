import { eventControl } from './event';
import { emitEvent, stopVideo } from './helpers';

let dialogControl = (() => {
	let scrollY = 0;

	let historyStack = [];

	let captureState = (dialog, target) => {
		if (!dialog) return null;

		let searchListItem = null;
		console.log(dialog);
		if (dialog.matches('#search-dialog')) {
			searchListItem = target;
			console.log(searchListItem);
		}

		return {
			dialogId: dialog.id,
			context: dialog.getAttribute('data-context'),
			targetId: dialog.getAttribute('data-target-id'),
			headingText: dialog.querySelector('h2')?.textContent ?? null,
			scrollTop: dialog.scrollTop,
			searchListItem,
		};
	};

	let resetDialogState = async (dialog) => {
		dialog.scrollTo(0, 0);
		dialog.removeAttribute('data-context');
		dialog.removeAttribute('data-target-id');
		dialog.removeAttribute('data-heading');

		let resetForms = dialog.getAttribute('data-reset-forms') === 'true';
		if (resetForms) {
			// Lazy load to prevent circular initialization with userDataStore.js
			let { resetForm } = await import('./form');
			let forms = dialog.querySelectorAll('form');
			for (let form of forms) {
				resetForm({ form });
			}
		}
	};

	let open = ({
		target = null,
		dialogId,
		headingText = null,
		context = null,
		targetId = null,
		isBack = false,
		noBack = false,
	}) => {
		let activeDialog = document.querySelector('dialog[open]');
		let targetDialog = document.querySelector(`#${dialogId}`);
		if (!targetDialog) return;

		// 1. Manage navigation history
		if (!isBack) {
			if (activeDialog) {
				if (noBack) {
					// Close active dialog and clear history
					historyStack = [];
					close(activeDialog, true, true);
				} else {
					// Save current dialog state onto history stack before opening the next
					let state = captureState(activeDialog, target);
					historyStack.push(state);
					// Close active dialog without clearing state (preserving state in history)
					close(activeDialog, true, false);
				}
			} else {
				historyStack = [];
			}
		}

		// 2. Set attributes and heading
		if (context) targetDialog.setAttribute('data-context', context);
		if (targetId) targetDialog.setAttribute('data-target-id', targetId);
		let heading = targetDialog.querySelector('h2');
		if (heading) {
			let defaultText =
				heading.getAttribute('data-default-text')?.trim() ?? heading.textContent;
			headingText = headingText ? headingText.trim() : defaultText;
			if (headingText !== heading.textContent) heading.textContent = headingText;
		}

		// 3. Body scroll lock (only lock when opening the initial dialog)
		if (!activeDialog) {
			scrollY = window.scrollY;
			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollY}px`;
		}

		targetDialog.showModal();

		// 4. Update back button
		let backBtn = targetDialog.querySelector('button.back-dialog');
		if (backBtn) {
			if (historyStack.length > 0) backBtn.removeAttribute('hidden', '');
			else backBtn.setAttribute('hidden', '');
		}

		let focusStart = targetDialog.querySelector('[data-focus-start]');
		if (focusStart) focusStart.focus();

		emitEvent({
			target: targetDialog,
			name: 'dialogOpen',
			detail: {
				context,
				isBack,
			},
		});
	};

	let back = () => {
		if (historyStack.length === 0) return;

		let previousState = historyStack.pop();
		let activeDialog = document.querySelector('dialog[open]');

		if (activeDialog) {
			// Close active dialog and reset its state
			close(activeDialog);
		}

		// Reopen previous dialog, restoring saved metadata
		open({
			dialogId: previousState.dialogId,
			headingText: previousState.headingText,
			context: previousState.context,
			targetId: previousState.targetId,
			isBack: true,
		});

		// Restore saved scroll position inside the dialog
		let restoredDialog = document.querySelector(`#${previousState.dialogId}`);
		if (restoredDialog) {
			restoredDialog.scrollTop = previousState.scrollTop;
			if (restoredDialog.matches('#search-dialog')) {
				console.log(previousState);
				let searchInput = restoredDialog.querySelector('form fieldset.search input');
				searchInput.focus();
				searchInput.setAttribute(
					'aria-activedescendant',
					previousState.searchListItem.closest('li').id,
				);
				previousState.searchListItem.setAttribute('aria-selected', 'true');
			}
		}
	};

	let close = (target, preserveState = false, isFullClose = true) => {
		let dialog = target.closest('dialog');
		if (!dialog) return;

		stopVideo(dialog);

		// Close dialog
		dialog.close();

		if (!preserveState) {
			resetDialogState(dialog);
		}

		if (isFullClose) {
			// Clear remaining history stack
			while (historyStack.length > 0) {
				let prev = historyStack.pop();
				let prevDialog = document.querySelector(`#${prev.dialogId}`);
				if (prevDialog) resetDialogState(prevDialog);
			}

			// Restore body scroll
			document.documentElement.style.scrollBehavior = 'auto';
			document.body.style.position = '';
			document.body.style.top = '';

			window.scrollTo(0, scrollY);

			requestAnimationFrame(() => {
				document.documentElement.style.scrollBehavior = '';
			});
		}
	};

	let onClick = (event) => {
		let target = event.target;

		let openDialogBtn = target.closest('button.open-dialog');
		if (openDialogBtn) {
			let dialogId = openDialogBtn.getAttribute('data-dialog');
			let headingText = openDialogBtn.getAttribute('data-dialog-heading');
			let context = openDialogBtn.getAttribute('data-dialog-context');
			let targetId = openDialogBtn.getAttribute('data-dialog-target-id');
			let noBack = openDialogBtn.hasAttribute('data-dialog-no-back');
			open({
				target,
				dialogId,
				headingText,
				context,
				targetId,
				noBack,
			});
		} else if (target.matches('dialog button.back-dialog')) {
			back();
		} else if (target.matches('dialog button.close-dialog')) {
			close(target);
		} else if (target.matches('html')) {
			let openDialog = document.querySelector('dialog[open]');
			let clickPath = event.composedPath();
			let clickedOutsideDialog =
				openDialog && !clickPath.some((el) => el.tagName === 'DIALOG');
			if (clickedOutsideDialog) {
				let openDialog = document.querySelector('dialog[open]');
				close(openDialog);
			}
		}
	};

	let init = () => {
		eventControl.add({
			elem: document,
			eventType: 'click',
			fn: onClick,
		});
	};

	return { init, open, back, close };
})();

export { dialogControl };
