import { setPreferences } from "src/stores/userDataStore";
import { emitEvent, htmlToElement, scrollIntoView, toTitleCase } from "./helpers";
import { eventControl } from "./event";

//
// Shared Methods
//

/**
 * Filters a list of <li> items based on a filter button value and hides non-matching items.
 * 
 * @param {Object} options
 * @param {Object} options.filters - An object of filter values by category used to filter the list.
 * @param {HTMLElement} options.list - The container element containing <li> items to filter. Items must include
 *   data attributes like `data-title`, `data-indicators`, `data-components`, `data-considerations`, and `data-type`.
 * @param {String} options.sortType - The user selected sort type
 */
let filterListByFilterBtns = ({ filters, list, sortType }) => {

	let results = [];
	let matches = 0;

	let items = list.querySelectorAll(':scope > li');

	for (const item of items) {

		// Get the item data
		let title = item.getAttribute('data-title');
		let type = item.getAttribute('data-type');
		let indicators = JSON.parse(item.getAttribute('data-indicators'));
		let components = JSON.parse(item.getAttribute('data-components'));
		let considerations = JSON.parse(item.getAttribute('data-considerations'));

		let result = {
			elem: item,
			title: title ?? null,
			match: false,
			relevance: 0,
		}

		if (!filters || Object.keys(filters).length === 0) {

			result.match = true;
			matches += 1;
			sortType = sortType ?? 'title';

		} else {

			let relevance = 0;
			let matchedAll = true;

			if (filters.types) {
				let match = filters.types.includes(type);
				if (!match) matchedAll = false;
				else relevance++;
			}

			if (filters.indicators) {
				let match = filters.indicators.some((v) =>
					indicators.some(tag => tag.startsWith(v)) ||
					components.some(tag => tag.startsWith(v)) ||
					considerations.some(tag => tag.startsWith(v))
				);
				if (!match) matchedAll = false;
				else relevance++;
			}

			if (filters.components) {
				let match = filters.components.some((v) =>
					indicators.some(tag => tag.startsWith(v.charAt(0))) ||
					components.some(tag => tag.startsWith(v)) ||
					considerations.some(tag => tag.startsWith(v))
				);
				if (!match) matchedAll = false;
				else relevance++;
			}

			if (filters.considerations) {
				let match = filters.considerations.some((v) => considerations.includes(v));
				if (!match) matchedAll = false;
				else relevance++;
			}

			if (matchedAll) {
				result.match = true;
				result.relevance = relevance;
				matches += 1;
			}

		}

		results.push(result);

		// If there's a match, show it, otherwise, hide it
		if (result.match) {
			item.removeAttribute('hidden');
		} else {
			item.setAttribute('hidden', '');
		}

	}

	if (matches > 0) {

		let filterMessage = list.closest('.list-container')?.querySelector('.filter-status');

		if (filterMessage) {
			filterMessage.textContent = `${matches} result${matches > 1 ? 's' : ''} found.`;
		}

		sortList({
			list: list,
			items: results,
			sortType: sortType ?? 'relevance',
			tieBreakerType: sortType ? null : 'title',
		});

	}

	let errorMessage = list.closest('.list-container')?.querySelector('.error-status');

	if (errorMessage) {

		// If there are no positive results, reveal the error message
		if (matches === 0) {
			errorMessage.removeAttribute('hidden');
			list.setAttribute('hidden', '');

			// Otherwise, hide the error message
		} else {
			errorMessage.setAttribute('hidden', '');
			list.removeAttribute('hidden');
		}
	}

}

/**
 * Filters a list of <li> items based on text input value, calculates relevance scores,
 * hides non-matching items, and optionally sorts matching items by relevance.
 * 
 * @param {Object} options
 * @param {HTMLInputElement} options.input - The input element whose value is used to filter the list.
 * @param {HTMLElement} options.list - The container element containing <li> items to filter. Items must include
 *   data attributes like `data-title`, `data-type`, and optionally `data-tag`, `data-date`.
 * @param {String} options.noValueBehaviour - Behaviour on how empty value searches are handled, either 'hidden' or 'shown'
 * @param {String} options.sortType - The user selected sort type
 */
let filterListByTextInput = ({ input, list, noValueBehaviour = 'hidden', sortType }) => {

	let value = input.value.toLowerCase().trim();

	let results = [];
	let matches = 0;
	let tieBreakerType = null;
	let matchTypes = new Set;

	if (!sortType) {
		sortType = value.length === 0 ? 'title' : 'relevance';
		tieBreakerType = value.length === 0 ? null : 'title';
	}

	let items = list.querySelectorAll(':scope > li');

	for (const item of items) {

		clearTextHighlights(item);

		// Get the item data
		let title = item.getAttribute('data-title');
		let tag = item.getAttribute('data-tag');
		let description = item.getAttribute('data-description');

		let result = {
			elem: item,
			title: title ? title.toLowerCase().trim() : null,
			tag: tag ?? null,
			description: description ? description.toLowerCase().trim() : null,
			match: false,
			relevance: 0,
		}

		let markMatch = (score = 1) => {
			result.match = true;
			result.relevance += score;
			matches += 1;
		};

		if (value.length === 0) {

			if (noValueBehaviour === 'shown') {
				markMatch(0);
			}
			results.push(result);
			item.toggleAttribute('hidden', !result.match);

		}

		// 1. Check for tag match
		if (tag && tag.startsWith(value)) {
			markMatch(100);
			tieBreakerType = 'tag';
			matchTypes.add('tag');

		}

		// 2. Check for title match
		else if (title) {

			// Full phrase match
			if (value.includes(' ')) {

				if (title.startsWith(value)) {
					markMatch(100);
					matchTypes.add('title');
				} else if (title.includes(value)) {
					markMatch(10);
					matchTypes.add('title');
				}

			}

			// Single word match
			else {

				let words = title.split(' ');
				for (let i = 0; i < words.length; i++) {
					if (words[i].startsWith(value)) {
						// Give higher relevance to first word matches
						markMatch(i === 0 ? 100 : 10)
						matchTypes.add('title');
					}
				}

			}

		}

		// 3. Check for description match
		if (description && value.length > 2) {

			// Full phrase match
			if (value.includes(' ')) {

				if (description.includes(value)) {
					markMatch(10);
					matchTypes.add('description');
				}

				// Single word match
			} else {

				let words = description.split(' ');
				for (let i = 0; i < words.length; i++) {
					if (words[i].startsWith(value)) {
						markMatch(1);
						matchTypes.add('description');
					}
				}

			}


			if (matches > 0) {

				let descriptionElem = item.querySelector('.text-container .description');
				highlightText(descriptionElem, value);

			}

		}

		results.push(result);
		// item.toggleAttribute('hidden', !result.match);

	}

	requestAnimationFrame(() => {

		for (let result of results) {
			result.elem.toggleAttribute('hidden', !result.match);
		}

		sortList({
			sortType: sortType,
			tieBreakerType: tieBreakerType,
			list: list,
			items: results,
		});

		let errorMessage = list.closest('.list-container')?.querySelector('.error-status');

		if (errorMessage) {

			// If there are no positive results, reveal the error message
			if (matches === 0 && value.length > 0) {
				errorMessage.removeAttribute('hidden');
				list.setAttribute('hidden', '');

				// Otherwise, hide the error message
			} else {
				errorMessage.setAttribute('hidden', '');
				list.removeAttribute('hidden');
			}

		}

		if (matches > 0) {

			let filterMessage = list.closest('.list-container')?.querySelector('.filter-status');

			if (filterMessage) {
				filterMessage.textContent = `${matches} result${matches > 1 ? 's' : ''} found.`;
			}

			emitEvent({
				target: document,
				name: 'searchMatchFound',
				detail: {
					matchTypes,
				}
			})
		}
	});

}

/**
 * Highlights all occurrences of a substring in an element's text.
 * @param {HTMLElement} elem - The element to modify.
 * @param {string} searchValue - The substring to highlight.
 */
let highlightText = function (elem, searchValue) {
	if (!elem || !searchValue) return;

	// Escape special regex characters
	let escapedValue = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	let regex = new RegExp(`(${escapedValue})`, 'gi');

	// Work with plain text, then insert highlight spans
	let content = elem.textContent;
	let highlighted = content.replace(regex, '<span class="highlight">$1</span>');

	// Apply result as HTML to preserve highlight spans
	elem.innerHTML = highlighted;
};

/**
 * Clear highlighted substrings in an element's text.
 * @param {HTMLElement} elem - The element to modify.
 */
let clearTextHighlights = function (elem) {
	if (!elem) return;
	// Replace all <span class="highlight">...</span> with just the inner text
	elem.innerHTML = elem.innerHTML.replace(/<span class="highlight">(.*?)<\/span>/gi, '$1');
};

/**
 * Sorts and reorders list items based on a given type and optional tie breaker.
 *
 * @param {Object} options
 * @param {string} [options.sortType='title'] - Primary sort: 'title', 'date', or 'relevance'.
 * @param {string|null} [options.tieBreakerType=null] - Optional tie breaker: 'tag' or 'title'.
 * @param {HTMLElement} options.list - Container holding the list items.
 * @param {Array<Object>} options.items - Items to sort, each with `{ elem, title?, tag?, relevance? }`.
 */
let sortList = ({ sortType = 'title', tieBreakerType = null, list, items }) => {

	if (!list || !items || !Array.isArray(items)) return;

	// Precompute for date sorting
	if (sortType === 'date') {
		for (let item of items) {
			item._timestamp = item.date ? new Date(item.date).getTime() : 0;
		}
	}

	// Ensure all items have a numeric relevance score
	if (sortType === 'relevance') {
		for (let item of items) {
			if (item.relevance === undefined || isNaN(item.relevance)) {
				item.relevance = 0;
			}
		}
	}

	items.sort((a, b) => {
		let primary = 0;

		if (sortType === 'title') primary = (a.title || '').localeCompare(b.title || '');
		else if (sortType === 'date') primary = (b._timestamp || 0) - (a._timestamp || 0);
		else if (sortType === 'relevance') primary = (b.relevance || 0) - (a.relevance || 0);

		if (primary !== 0) return primary;

		// Tie-breaker
		if (tieBreakerType === 'tag') {
			return (a.tag || '').localeCompare(b.tag || '');
		} else if (tieBreakerType === 'title') {
			return (a.title || '').localeCompare(b.title || '');
		}

		return 0;
	});

	// Batch DOM reordering using DocumentFragment
	let fragment = document.createDocumentFragment();
	let index = 1;
	for (let item of items) {
		if (item.elem instanceof HTMLElement && !item.elem.hasAttribute('hidden')) {
			fragment.append(item.elem);
			item.elem.setAttribute('data-pos', `${index}`);
			index += 1;
		} else {
			item.elem.removeAttribute('data-pos');
		}
	}

	list.append(fragment);

}

/**
 * Get selected filters from a form.
 * @param {HTMLFormElement} form
 * @returns {Object} Filter values keyed by name
 */
let getFilters = (form) => {
	let data = new FormData(form);
	let result = {};

	for (let [key, value] of data.entries()) {
		if (!result[key]) {
			result[key] = [];
		}
		result[key].push(value);
	}

	return result;
}

let getList = (form) => {
	let listId = form.getAttribute('data-list');
	let list = document.querySelector(`#${listId}`);
	return list ?? null;
}

let getSortType = (form) => {
	let sortControl = form.querySelector('fieldset.sort');
	if (sortControl) {
		let activeSort = sortControl.querySelector('button[aria-pressed="true"]');
		return activeSort.value;
	}
	if (form.hasAttribute('data-sort-control')) {
		sortControl = document.querySelector(`#${form.getAttribute('data-sort-control')} fieldset.sort`);
		if (!sortControl) return;
		let activeSort = sortControl.querySelector('button[aria-pressed="true"]');
		return activeSort.value;
	}
}

let debounce = (fn, delay = 250) => {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		let savedArgs = args;
		timeout = setTimeout(() => {
			requestAnimationFrame(() => fn.apply(null, savedArgs));
		}, delay);
	};
};

let debouncedFilter = debounce(({ input, list, noValueBehaviour, sortType }) => {
	filterListByTextInput({ input, list, noValueBehaviour, sortType });
}, 250);

let updateToggles = (target) => {
	let active = target.parentElement.querySelector('[aria-pressed="true"]');
	active.removeAttribute('aria-pressed');
	target.setAttribute('aria-pressed', 'true');
}


let filter = (() => {

	//
	// Tags
	//

	let createTag = (target, tagList) => {

		let template = tagList.querySelector('template');
		if (!template) return;

		// Clone the template
		let tag = template.content.cloneNode(true);

		let li = tag.querySelector('li');
		if (!li) return;

		let group = target.getAttribute('name');
		let title = target.getAttribute('data-title');
		let value = target.getAttribute('value');
		let field = target.getAttribute('data-status-field');
		if (!group || !title || !value) return;

		li.setAttribute('data-group', group);
		li.setAttribute('data-value', value);
		li.setAttribute('data-status-field', field ?? null);

		let tagText = title;

		if (group === 'indicators' || group === 'components') {
			tagText = `${value} – ${title}`;
		}

		let groupField = tag.querySelector('.group');
		let titleField = tag.querySelector('.title');
		let clearBtn = tag.querySelector('button.clear');
		if (!groupField || !titleField || !clearBtn) return;

		groupField.textContent = toTitleCase(group);
		titleField.textContent = tagText;
		titleField.setAttribute('title', tagText);
		clearBtn.setAttribute('aria-label', `Clear ${title} Filter`);

		return tag;

	}

	let getTag = (target) => {
		let tag;
		if (target.matches('input')) {
			if (!target.value) return null;
			tag = document.querySelector(`.filter-tag[data-value="${target.value}"]`);
			return tag ?? null;
		} else if (target.matches('button')) {
			tag = target.closest('.filter-tag');
			return tag ?? null
		} else {
			return null;
		}
	}

	let removeTag = (tag) => {
		if (tag) tag.remove();
	}

	//
	// Status Fields
	//

	let getStatusField = (target) => {
		let fieldId = target.getAttribute('data-status-field');
		if (!fieldId) return null;
		let field = document.querySelector(`[data-field="${fieldId}"]`);
		return field ?? null;
	}

	let updateStatus = ({ field, operation }) => {
		let currentStatus = Number(field.textContent);
		if (operation === 'add') currentStatus++;
		if (operation === 'subtract') currentStatus--;
		if (operation === 'reset') currentStatus = 0;
		field.textContent = currentStatus;
		let fieldContainer = field.closest('.field-container');
		if (!fieldContainer) return;
		if (currentStatus > 0) {
			fieldContainer.removeAttribute('hidden');
		} else {
			fieldContainer.setAttribute('hidden', '');
		}
	}

	//
	// Form
	//

	let getForm = (input) => {
		let form = input.closest('form');
		return form ?? null;
	}


	//
	// Inputs
	//

	let getInput = (tag) => {
		let group = tag.getAttribute('data-group');
		let value = tag.getAttribute('data-value');
		if (!group || !value) return null;
		let input = document.querySelector(`input[name="${group}"][value="${value}"]`);
		return input ?? null;
	}

	let updateInput = (input) => {
		input.checked = !input.checked;
	}

	//
	// Event Handlers
	//

	/**
	 * Handles input inside filter form
	 * @param {Event} event
	 */
	let onInput = (event) => {
		let target = event.target;
		if (!target.matches('fieldset.filters input')) return;
		let form = getForm(target);
		let list = getList(form);
		if (!form || !list) return;
		let filters = getFilters(form);
		let sortType = getSortType(form);
		filterListByFilterBtns({ filters, list, sortType });
		let statusOperation;
		if (target.checked) {
			statusOperation = 'add';
			let tagListId = form.getAttribute('data-tags-list');
			let tagList = document.querySelector(`#${tagListId}`);
			if (tagList) {
				let tag = createTag(target, tagList);
				tagList.append(tag);
			}
		} else {
			statusOperation = 'subtract';
			let tag = getTag(target);
			removeTag(tag);
		}
		let statusField = getStatusField(target);
		if (statusField) {
			updateStatus({
				field: statusField,
				operation: statusOperation,
			});
		}
		emitEvent({
			target: document,
			name: 'filterChange',
			detail: {
				activeFilters: filters,
			}
		})
	}

	/**
	 * Handles filter form reset
	 * @param {Event} event
	 */
	let onReset = (event) => {
		let target = event.target;
		if (!target.matches('form:has(fieldset.filters)')) return;
		let form = getForm(target);
		let list = getList(form);
		if (!form || !list) return;
		let filters = {};
		let sortType = getSortType(form);
		filterListByFilterBtns({ filters, list, sortType });
		let statusFields = form.querySelectorAll('.filter-group-status [data-field]');
		for (let field of statusFields) {
			updateStatus({
				field,
				operation: 'reset',
			})
		}
		let tagListId = form.getAttribute('data-tags-list');
		let tagList = document.querySelector(`#${tagListId}`);
		if (tagList) {
			let items = tagList.querySelectorAll(':scope > li');
			for (let item of items) item.remove();
		}
		emitEvent({
			target: document,
			name: 'filterChange',
			detail: {
				activeFilters: filters,
			}
		})
	}

	/**
	 * Handles filter tag button clicks
	 * @param {Event} event
	 */
	let onClick = (event) => {
		let target = event.target;
		if (!target.matches('.filter-tag button.clear')) return;
		let tag = getTag(target);
		if (!tag) return;
		let input = getInput(tag);
		if (input) {
			updateInput(input);
		}
		let form = getForm(input);
		let list = getList(form);
		if (!form || !list) return;
		let filters = getFilters(form);
		let sortType = getSortType(form);
		filterListByFilterBtns({ filters, list, sortType });
		let statusField = getStatusField(tag);
		if (statusField) {
			updateStatus({
				field: statusField,
				operation: 'subtract',
			});
		}
		removeTag(tag);
		emitEvent({
			target: document,
			name: 'filterChange',
			detail: {
				activeFilters: filters,
			}
		})
	}

	/**
	 * Initializes filter forms
	 */
	let init = () => {
		eventControl.add({
			selector: '#active-filters-list',
			eventType: 'click',
			fn: onClick,
		})
		eventControl.add({
			selector: 'form:has(fieldset.filters)',
			eventType: 'input',
			fn: onInput,
		})
		eventControl.add({
			selector: 'form:has(fieldset.filters)',
			eventType: 'reset',
			fn: onReset,
		})
	}

	return { init };

})();


let search = (() => {

	/** 
	 * Stores options per form
	 * @type {Map<HTMLFormElement, {noValueBehaviour: string|null}>}
	 */
	let formOptions = new Map();

	/**
	 * Handles input inside search forms
	 * @param {Event} event
	 */
	let onInput = (event) => {
		let target = event.target;
		if (!target.matches('fieldset.search input')) return;
		let form = target.closest('form');
		let list = getList(form);
		if (!form || !list) return;
		let sortType = getSortType(form);
		let options = formOptions.get(form) ?? {};
		target.setAttribute('aria-activedescendant', '');
		let selectedItem = list.querySelector('[aria-selected]');
		if (selectedItem) selectedItem.removeAttribute('aria-selected');
		if (target.value.trim().length > 0) {
			list.removeAttribute('hidden');
			target.setAttribute('aria-expanded', 'true');
			debouncedFilter({ input: target, list, sortType });
		} else {
			if (options.noValueBehaviour === 'hidden') {
				list.setAttribute('hidden', '');
				target.setAttribute('aria-expanded', 'false');
			} else {
				debouncedFilter({ input: target, list, noValueBehaviour: options.noValueBehaviour, sortType });
			}
		}
	};

	let onKeydown = (event) => {
		let target = event.target;
		let form = target.closest('form');
		let list = getList(form);
		if (!form || !list) return;
		let sortType = getSortType(form);
		let options = formOptions.get(form) ?? {};

		if (target.matches('button.submit')) {
			if (event.key === 'Enter') {
				// Prevent default submit
				event.preventDefault();
			}
		}

		if (target.matches('fieldset.search input')) {

			if (event.key === 'Enter') {
				event.preventDefault();
				let currentItemId = target.getAttribute("aria-activedescendant");
				let currentItem = currentItemId ? document.getElementById(currentItemId) : null;
				if (currentItem) {
					currentItem.firstElementChild.click();
				}
			}

			if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
				event.preventDefault();
				let results = list.querySelectorAll('[data-pos]');
				if (results.length === 0) return;
				let currentItemId = target.getAttribute("aria-activedescendant");
				let currentItem = currentItemId ? document.getElementById(currentItemId) : null;
				let currentPos = Number(currentItem?.getAttribute('data-pos'));
				let nextPos = null;
				if (!currentItem) {
					nextPos = event.key === "ArrowDown"
						? 1
						: results.length;
				} else {
					nextPos = event.key === "ArrowUp"
						? currentPos - 1
						: currentPos + 1;
				}
				if (nextPos > results.length || nextPos < 1) return;
				let nextItem = list.querySelector(`[data-pos="${nextPos}"]`);
				if (!nextItem) return;
				// Update input with active descendant
				target.setAttribute('aria-activedescendant', nextItem.id);
				// Add visual highlight to item
				if (currentItem) currentItem.firstElementChild.removeAttribute('aria-selected');
				nextItem.firstElementChild.setAttribute('aria-selected', 'true');
				scrollIntoView(nextItem, {
					block: "nearest",
				});
			}

			if (event.key === 'Escape') {
				let currentItemId = target.getAttribute("aria-activedescendant");
				let currentItem = currentItemId ? document.getElementById(currentItemId) : null;
				if (currentItem) currentItem.firstElementChild.removeAttribute('aria-selected');
				target.value = '';
				target.setAttribute('aria-activedescendant', '');
				scrollIntoView(target, {
					block: "center",
				});
				if (options.noValueBehaviour === 'hidden') {
					// Hide the list
					list.setAttribute('hidden', '');
					target.setAttribute('aria-expanded', 'false');
				} else {
					// Filter and sort list
					debouncedFilter({ input: target, list, noValueBehaviour: options.noValueBehaviour, sortType });
				}
			}
		}
	}

	let onReset = (event) => {
		let target = event.target;
		if (!target.matches('form:has(fieldset.search)')) return;
		let form = target.closest('form');
		let list = getList(form);
		if (!form || !list) return;
		let options = formOptions.get(form) ?? {};
		let input = document.querySelector(`fieldset.search input[aria-controls="${list.id}"]`);
		if (input) input.setAttribute('aria-activedescendant', '');
		let selectedItem = list.querySelector('[aria-selected]');
		if (selectedItem) selectedItem.removeAttribute('aria-selected');
		if (options.noValueBehaviour === 'hidden') {
			list.setAttribute('hidden', '');
			target.setAttribute('aria-expanded', 'false');
		} else {
			debouncedFilter({ input: target, list, noValueBehaviour: options.noValueBehaviour, sortType });
		}
	}

	/**
	 * Initializes search forms
	 */
	let init = () => {
		let forms = document.querySelectorAll('form:has(fieldset.search)');
		for (let form of forms) {
			let noValueBehaviour = form.getAttribute('data-no-value-behaviour') ?? null;
			formOptions.set(form, { noValueBehaviour });
		}
		eventControl.add({
			selector: 'form:has(fieldset.search)',
			eventType: 'input',
			fn: onInput,
		})
		eventControl.add({
			selector: 'form:has(fieldset.search)',
			eventType: 'keydown',
			fn: onKeydown,
		})
		eventControl.add({
			selector: 'form:has(fieldset.search)',
			eventType: 'reset',
			fn: onReset,
		})
	};

	let destroy = () => {
		let forms = document.querySelectorAll('form:has(fieldset.search)');
		for (let form of forms) {
			formOptions.delete(form);
		}
	};

	return { init, destroy };

})();

let sort = (() => {

	let onClick = (event) => {
		let target = event.target;
		if (!target.matches('fieldset.sort button')) return;
		let form = target.closest('form') ?? null;
		let list = getList(form);
		if (!form || !list) return;
		let sortType = target.value;
		if (sortType !== 'date' && sortType !== 'title') return;
		let items = [];
		for (const item of list.querySelectorAll(':scope > li')) {
			let title = item.getAttribute('data-title');
			let date = item.getAttribute('data-date-added');
			items.push({
				elem: item,
				title: title ?? null,
				date: date ?? null,
			})
		}
		sortList({ sortType, list, items });
		updateToggles(target);
		setPreferences({
			resourcePageSort: sortType,
		})
	}

	let init = () => {
		eventControl.add({
			selector: 'form:has(fieldset.sort)',
			eventType: 'click',
			fn: onClick,
		})
	};

	return { init };

})();

let layout = (() => {

	let onClick = (event) => {
		let target = event.target;
		if (!target.matches('fieldset.layout button')) return;
		let form = target.closest('form') ?? null;
		let list = getList(form);
		if (!form || !list) return;
		let layoutType = target.value;
		if (layoutType !== 'compact' && layoutType !== 'detailed') return;
		list.setAttribute('data-layout', layoutType);
		updateToggles(target);
		setPreferences({
			resourcePageLayout: layoutType,
		})
	}

	let init = () => {
		eventControl.add({
			selector: 'form:has(fieldset.layout)',
			eventType: 'click',
			fn: onClick,
		})
	};

	return { init };

})();

export { filter, search, sort, layout };
