import { htmlToElement, toTitleCase } from "./helpers";

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
 */
let filterListByFilterBtns = ({ filters, list }) => {

	let results = [];
	let matches = 0;
	let sortType = 'relevance';
	let presortType = 'title';

	let items = list.querySelectorAll('li');

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
			sortType = 'title';
			presortType = null;

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

		sortList({
			list: list,
			items: results,
			sortType: sortType,
			presortType: presortType,
		});

	}

	let errorMessage = list.closest('.list-container')?.querySelector('.error-status');

	if (errorMessage){

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
 */
let filterListTextInput = ({ input, list, noValueBehaviour = 'hidden' }) => {

	let value = input.value.trim();

	let results = [];
	let matches = 0;
	let presortType = value.length === 0 ? null : 'title';
	let sortType = 	value.length === 0 ? 'title' : 'relevance';

	let items = list.querySelectorAll('li');

	for (const item of items) {

		clearTextHighlights(item);
		
		// Get the item data
		let title = item.getAttribute('data-title');
		let tag = item.getAttribute('data-tag');
		let description = item.getAttribute('data-description');
		
		let result = {
			elem: item,
			title: title ?? null,
			tag: tag ?? null,
			description: description ?? null,
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
			presortType = 'tag';
			
		// 2. Check for title match
		} else if (title) {

			// Full phrase match
			if (value.includes(' ')) {

				if (title.startsWith(value)) markMatch(100);
				else if (title.includes(value)) markMatch(10);

			// Single word match
			} else {

				let words = title.split(' ');
				for (let i = 0; i < words.length; i++) {
					if (words[i].startsWith(value)) {
						// Give higher relevance to first word matches
						markMatch(i === 0 ? 100 : 10)
					}
				}

			}	

		} 
		
		// 3. Check for description match
		if (description && value.length > 2) {

			// Full phrase match
			if (value.includes(' ')) {

				if (description.includes(value)) markMatch(10);

			// Single word match
			} else {

				let words = description.split(' ');
				for (let i = 0; i < words.length; i++) {
					if (words[i].startsWith(value)) markMatch(1);
				}

			}
			

			if (matches > 0) {
				
				let descriptionElem = item.querySelector('.text-container .description');
				highlightText(descriptionElem, value);

			}

		}

		results.push(result);
		item.toggleAttribute('hidden', !result.match);

	}

	sortList({
		sortType: sortType,
		presortType: presortType,
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

}

/**
 * Highlights all occurrences of a substring in an element's text.
 * @param {HTMLElement} elem - The element to modify.
 * @param {string} searchValue - The substring to highlight.
 */
let highlightText = function(elem, searchValue) {
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
let clearTextHighlights = function(elem) {
    if (!elem) return;
	// Replace all <span class="highlight">...</span> with just the inner text
    elem.innerHTML = elem.innerHTML.replace(/<span class="highlight">(.*?)<\/span>/gi, '$1');
};

/**
 * Sorts and reorders list items based on a given type and optional presort.
 *
 * @param {Object} options
 * @param {string} [options.sortType='title'] - Primary sort: 'title', 'date', or 'relevance'.
 * @param {string|null} [options.presortType=null] - Optional presort: 'tag' or 'title'.
 * @param {HTMLElement} options.list - Container holding the list items.
 * @param {Array<Object>} options.items - Items to sort, each with `{ elem, title?, tag?, relevance? }`.
 */
let sortList = ({ sortType = 'title', presortType = null, list, items }) => {

	if (!list || !items || !Array.isArray(items)) return;

	// Ensure all items have a numeric relevance score
	if (sortType === 'relevance') {
		for (let item of items) {
			if (item.relevance === undefined || isNaN(item.relevance)) {
				item.relevance = 0;
			}
		}
	}

	// Optional presort (by tag or title)
	if (presortType === 'tag') {
		items.sort((a, b) => {
			return (a.tag || '').localeCompare(b.tag || '');
		});
	} else if (presortType === 'title') {
		items.sort((a, b) => {
			return (a.title || '').localeCompare(b.title || '');
		});
	}

	// Primary sort
	items.sort((a, b) => {
		if (sortType === 'title') {
			return (a.title || '').localeCompare(b.title || '');
		}

		if (sortType === 'date') {
			return new Date(b.date) - new Date(a.date);
		}

		if (sortType === 'relevance') {
			return b.relevance - a.relevance;
		}

		return 0;
	});

	// Reorder elements in the DOM
	for (let item of items) {
		if (item.elem instanceof HTMLElement) {
			list.appendChild(item.elem);
		}
	}

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

let debounce = (fn, delay = 200) => {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay);
	};
};

let debouncedFilter = debounce(({ input, list, noValueBehaviour }) => {
	filterListTextInput({ input, list, noValueBehaviour });
}, 200);

let updateToggles = (target) => {
	let active = target.parentElement.querySelector('[aria-pressed="true"]');
	active.removeAttribute('aria-pressed');
	target.setAttribute('aria-pressed', 'true');
}


let filter = (() => {

	//
	// Tags
	//

	let createTag = (target) => {
		let group = target.getAttribute('name');
		let title = target.getAttribute('data-title');
		let value = target.getAttribute('value');
		let field = target.getAttribute('data-status-field');
		if (!group || !title || !value) return;
		let template = `
			<li class="filter-tag" data-group="${group}" data-value="${value}" data-status-field="${field ?? null}">
				<span class="group">${toTitleCase(group)}</span>
				<span class="title" title="${title}">${title}</span>
				<button class="clear" type="button" aria-label="Clear ${title} Filter">
					<svg class="icon xmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
						<path d="m7.41 6 4.3-4.29A.996.996 0 1 0 10.3.3L6.01 4.59 1.71.29C1.32-.1.68-.1.29.29s-.39 1.03 0 1.42L4.58 6 .29 10.29a.996.996 0 0 0 .71 1.7c.26 0 .51-.1.71-.29L6 7.41l4.29 4.29c.2.2.45.29.71.29s.51-.1.71-.29a.996.996 0 0 0 0-1.41L7.42 6Z"/>
					</svg>
				</button>
			</li>
		`;
		let tag = htmlToElement(template);
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

	let updateStatus = ({field, operation}) => {
		let currentStatus = Number(field.textContent);
		if (operation === 'add') currentStatus ++;
		if (operation === 'subtract') currentStatus --;
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
		filterListByFilterBtns({ filters, list });
		let statusOperation;
		if (target.checked) {
			statusOperation = 'add';
			let tagListId = form.getAttribute('data-tag-list');
			let tagList = document.querySelector(`#${tagListId}`);
			if (tagList) {
				let tag = createTag(target);
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
		filterListByFilterBtns({ filters, list });
		let statusFields = form.querySelectorAll('.filter-group-status [data-field]');
		for (let field of statusFields) {
			updateStatus({
				field,
				operation: 'reset',
			})
		}
		let tagListId = form.getAttribute('data-tag-list');
		let tagList = document.querySelector(`#${tagListId}`);
		if (tagList) {
			tagList.innerHTML = '';
		}
	}

	/**
	 * Handles filter tag button clicks
	 * @param {Event} event
	 */
	let onClick = (event) => {
		let target = event.target;
		if (!target.matches('.filter-tag button')) return;
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
		filterListByFilterBtns({ filters, list });
		let statusField = getStatusField(tag);
		if (statusField) {
			updateStatus({
				field: statusField,
				operation: 'subtract',
			});
		}
		removeTag(tag);
	}

	/**
	 * Initializes filter forms
	 */
	let init = () => {
		let forms = document.querySelectorAll('form:has(fieldset.filters)');
		for (let form of forms) {
			form.addEventListener('input', onInput);
			form.addEventListener('reset', onReset);
			document.addEventListener('click', onClick);
		}
	}

	/**
	 * Cleans up event listeners
	 */
	let destroy = () => {
		let forms = document.querySelectorAll('form:has(fieldset.filters)');
		for (let form of forms) {
			form.removeEventListener('input', onInput);
			form.removeEventListener('reset', onReset);
			document.removeEventListener('click', onClick);
		}
	}

	return { init, destroy };

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
		let options = formOptions.get(form) ?? {};
		if (target.value.trim().length > 0) {
			list.removeAttribute('hidden');
			debouncedFilter({ input: target, list });
		} else {
			if (options.noValueBehaviour === 'hidden') {
				list.setAttribute('hidden', '');
			} else {
				debouncedFilter({ input: target, list, noValueBehaviour: options.noValueBehaviour });
			}
		}
	};

	/**
	 * Initializes search forms
	 */
	let init = () => {
		let forms = document.querySelectorAll('form:has(fieldset.search)');
		for (let form of forms) {
			let noValueBehaviour = form.getAttribute('data-no-value-behaviour') ?? null;
			formOptions.set(form, { noValueBehaviour });
			form.addEventListener('input', onInput);
		}
	};

	/**
	 * Cleans up event listeners
	 */
	let destroy = () => {
		let forms = document.querySelectorAll('form:has(fieldset.search)');
		for (let form of forms) {
			formOptions.delete(form);
			form.removeEventListener('input', onInput);
		}
	};

	return { init, destroy };

})();

let sort = (() => {

	/**
	 * Handles filter tag button clicks
	 * @param {Event} event
	 */
	let onClick = (event) => {
		let target = event.target;
		if (!target.matches('fieldset.sort button')) return;
		let form = target.closest('form') ?? null;
		let list = getList(form);
		if (!form || !list) return;
		let sortType = target.value;
		if (sortType !== 'date' && sortType !== 'title') return;
		console.log('Sorting');
		let items = [];
		for (const item of list.querySelectorAll('li')) {
			let title = item.getAttribute('data-title');
			let date = item.getAttribute('data-date-added');
			items.push({
				elem: item,
				title: title ?? null,
				date: date ?? null,
			})
		}
		sortList({ sortType, list, items });
		// TODO: Only working on the first click, investigate
		updateToggles(target);
	}

	/**
	 * Initializes search forms
	 */
	let init = () => {
		let forms = document.querySelectorAll('form:has(fieldset.sort)');
		for (let form of forms) {
			form.addEventListener('click', onClick);
		}
	};

	/**
	 * Cleans up event listeners
	 */
	let destroy = () => {
		let forms = document.querySelectorAll('form:has(fieldset.sort)');
		for (let form of forms) {
			form.addEventListener('click', onClick);
		}
	};

	return { init, destroy };

})();

let layout = (() => {

	/**
	 * Handles filter tag button clicks
	 * @param {Event} event
	 */
	let onClick = (event) => {
		let target = event.target;
		if (!target.matches('fieldset.layout button')) return;
		let form = target.closest('form') ?? null;
		let list = getList(form);
		if (!form || !list) return;
		let layoutType = target.value;
		if (layoutType !== 'compact' && layoutType !== 'detailed') return;
		console.log('Layouting');
		list.setAttribute('data-layout', layoutType);
		updateToggles(target);
	}

	/**
	 * Initializes search forms
	 */
	let init = () => {
		let forms = document.querySelectorAll('form:has(fieldset.layout)');
		for (let form of forms) {
			form.addEventListener('click', onClick);
		}
	};

	/**
	 * Cleans up event listeners
	 */
	let destroy = () => {
		let forms = document.querySelectorAll('form:has(fieldset.layout)');
		for (let form of forms) {
			form.addEventListener('click', onClick);
		}
	};

	return { init, destroy };

})();

export { filter, search, sort, layout };

// TODO: Include resource descriptions as part of search (resource page only)
