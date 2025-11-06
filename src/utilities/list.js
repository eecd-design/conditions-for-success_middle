import { setPreferences } from "src/stores/userDataStore";
import { emitEvent, scrollIntoView, toTitleCase } from "./helpers";
import { eventControl } from "./event";

//
// Shared Methods
//

let findMatches = ({ searchIndex, values, defaultItemVisibility }) => {
    if (!searchIndex || !values) return;

    let results = [];
    let listMatchTypes = new Set();

    // Loop through search index to find matches
    for (let entry of searchIndex) {

        let {
            id,
            category,
            title,
            titleWords,
            tag,
            description,
            descWords,
            type,
            indicators,
            components,
            considerations,
        } = entry;

        let match = false;
        let matchedAll = true;
        let entryMatchTypes = new Set();
        let relevance = 0;

        let markMatch = (score = 1, matchType = null) => {
            match = true;
            relevance += score;
            if (matchType) {
                entryMatchTypes.add(matchType);
                listMatchTypes.add(matchType);
            }
        };

        if (values.search) {

            let searchValue = typeof values.search === 'string' && values.search.length > 0 ? values.search : false;

            // If value is empty, entry is a match
            if (!searchValue) {
                if (defaultItemVisibility === 'shown') markMatch(0);
            }

            // Otherwise, check for match
            else {

                // 1. Check for tag match
                if (tag && tag.startsWith(searchValue)) {
                    markMatch(100, 'tag');
                    listMatchTypes.add('tag');
                }

                // 2. Check for title match
                if (title) {

                    // Full phrase match
                    if (searchValue.includes(' ')) {
                        if (title.startsWith(searchValue)) markMatch(100, 'title');
                        else if (title.includes(searchValue)) markMatch(10, 'title');
                    }

                    // Single word match
                    else {
                        for (let i = 0; i < titleWords.length; i++) {
                            // Give higher relevance to first word matches
                            if (titleWords[i].startsWith(searchValue)) markMatch(i === 0 ? 100 : 10, 'title');
                        }
                    }

                }

                // 3. Check for description match
                if (description && searchValue.length > 2) {

                    // Full phrase match
                    if (searchValue.includes(' ')) {
                        if (description.includes(searchValue)) markMatch(10, 'description');
                    }

                    // Single word match
                    else {
                        for (let word of descWords) {
                            if (word.startsWith(searchValue)) {
                                markMatch(1, 'description');
                                break;
                            }
                        }
                    }
                }
            }

            if (!match) matchedAll = false;

        }

        if (matchedAll && values.filters && Object.keys(values.filters).length) {

            let { filters } = values;

            if (filters.types) {
                if (filters.types.includes(type)) markMatch(10, 'type');
                else matchedAll = false;
            }

            if (matchedAll && filters.indicators) {
                if (filters.indicators.some((v) =>
                    indicators.some(tag => tag.startsWith(v)) ||
                    components.some(tag => tag.startsWith(v)) ||
                    considerations.some(tag => tag.startsWith(v))
                )) markMatch(10, 'indicator');
                else matchedAll = false;
            }

            if (matchedAll && filters.components) {
                if (filters.components.some((v) =>
                    indicators.some(tag => tag.startsWith(v.charAt(0))) ||
                    components.some(tag => tag.startsWith(v)) ||
                    considerations.some(tag => tag.startsWith(v))
                )) markMatch(10, 'component');
                else matchedAll = false;
            }

            if (matchedAll && filters.considerations) {
                if (filters.considerations.some((v) => considerations.includes(v))) markMatch(10, 'consideration');
                else matchedAll = false;
            }

        }

        // Only global matches proceed
        match = matchedAll;
        if (!match) relevance = 0;

        results.push({ ...entry, match, matchTypes: entryMatchTypes, relevance });
    }

    results = results.filter((r) => r.match);

    return {
        listMatchTypes,
        results,
        numOfMatches: results.length,
    };

}

let showListGroup = (list) => {

    console.log('Showing List Group');

    let groupSize = list._options.listGroupSize;
    let lastShownIndex = Number(list._state.matches.lastShownIndex ?? -1);
    console.log('Last Shown Index: ', lastShownIndex);

    let fragment = document.createDocumentFragment();

    let startIndex = lastShownIndex + 1;
    let endIndex = startIndex + groupSize;
    let fullList = list._state.matches.list || [];
    let group = fullList.slice(startIndex, endIndex);
    console.log('Group: ', group);

    for (let item of group) {

        // result.match = result.match || showAll;

        let elem = list.querySelector(`[data-item-id="${item.id}"]`);
        if (!elem) continue;

        console.log('Updating Item ', item.position);

        elem.dataset.pos = item.position;
        elem.hidden = false;

        // Show description highlights
        if (item.matchTypes && item.matchTypes.has('description')) {
            let descElem = elem.querySelector('.text-container .description');
            if (descElem) {
                queueMicrotask(() => {
                    clearTextHighlights(elem);
                    highlightText(descElem, list._state.search);
                })
            }
        }

        fragment.append(elem);
    }

    // set lastShownIndex to the index of the *last shown item*
    let lastIndexShown = startIndex + group.length - 1;
    // if nothing was shown, keep previous value
    if (group.length > 0) {
        list._state.matches.lastShownIndex = lastIndexShown;
    }

    list._state.matches.hiddenMatches = lastIndexShown < fullList.length;

    list.append(fragment);

}

/**
 * Filters a list of <li> items based on text input value, calculates relevance scores,
 * hides non-matching items, and optionally sorts matching items by relevance.
 * 
 * @param {Object} options
 * @param {HTMLInputElement} options.value - The input element whose value is used to filter the list.
 * @param {HTMLElement} options.list - The container element containing <li> items to filter. Items must include
 *   data attributes like `data-title`, `data-type`, and optionally `data-tag`, `data-date`.
 * @param {String} options.defaultItemVisibility - Behaviour on how empty value searches are handled, either 'hidden' or 'shown'
 * @param {String} options.sortType - The user selected sort type
 */
let updateList = async (list) => {

    let debug = true;

    let searchIndex = list._listIndex;
    let values = {
        search: list._state.search,
        filters: list._state.filters,
    }
    let defaultItemVisibility = list._options.defaultItemVisibility;
    let sortTypes = {
        primary: list._state.sort.primary,
        tieBreaker: list._state.sort.tieBreaker,
    }
    let groupSize = list._options.listGroupSize;

    let emptyValues = !values || (!values.search?.length && !Object.keys(values.filters || {}).length);

    let showAll = emptyValues && defaultItemVisibility === 'shown';

    list.hidden = true;

    if (debug) {
        console.log('~~~ Updating List ~~~');
        console.log('Empty values: ', emptyValues);
        console.log('Show all if empty: ', showAll);
        console.log('Search index: ', searchIndex);
    }

    let matches = !emptyValues ? findMatches({
        searchIndex,
        values,
        defaultItemVisibility,
    }) : {
        results: searchIndex,
        listMatchTypes: new Set,
        numOfMatches: showAll ? searchIndex.length : 0,
    };

    if (debug) {
        console.log('~ Finding Matches ~');
        console.log('Num of matches: ', matches.numOfMatches);
    }

    let { results, listMatchTypes, numOfMatches } = matches;

    if (listMatchTypes.has('tag')) {
        sortTypes.tieBreaker = 'tag';
    }

    // Sort results
    let sortedResults = sortList({
        sortTypes,
        items: results
    });

    if (debug) {
        console.log('~ Sorting List ~');
        console.log('Sort types: ', sortTypes);
        console.log('Sorted results array: ', sortedResults);
        console.log('~ Updating DOM ~');
    }

    let matchesFound = numOfMatches > 0;

    let shownItems = list.querySelectorAll(':scope > li:not([hidden])');
    for (let item of shownItems) {
        item.hidden = true;
        delete item.dataset.pos;
    }

    list._state.matches.list = sortedResults;
    list._state.matches.lastShownIndex = -1;

    showListGroup(list);

    list.hidden = !(matchesFound || showAll);

    if (debug) {
        console.log('List Updated');
    }

    // Display messages
    let errorMessage = list.closest('.list-container')?.querySelector('.error-status');
    let filterMessage = list.closest('.list-container')?.querySelector('.filter-status');

    if (errorMessage) {
        if (!emptyValues && !matchesFound) {
            errorMessage.removeAttribute('hidden');
        } else {
            errorMessage.setAttribute('hidden', '');
        }
    }

    if (filterMessage) {
        if (!emptyValues && matchesFound) {
            filterMessage.removeAttribute('hidden');
            filterMessage.textContent = `${numOfMatches} result${numOfMatches > 1 ? 's' : ''} found.`;
        } else {
            filterMessage.setAttribute('hidden', '');
        }
    }

    if (debug) {
        console.log('Messages Updated');
    }

    // Show More Button
    let showMoreBtn = list.closest('.list-container')?.querySelector('button.show-more');

    if (showMoreBtn) {
        if ((showAll && numOfMatches > groupSize) || (matchesFound && numOfMatches > groupSize)) {
            showMoreBtn.removeAttribute('hidden');
        } else {
            showMoreBtn.setAttribute('hidden', '');
        }
    }

    if (debug) {
        console.log('Show More Button Updated');
    }

    // Custom event for other UI updates
    emitEvent({
        target: document,
        name: 'searchMatchFound',
        detail: {
            listId: 'resources-list',
            listMatchTypes,
            numOfMatches,
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
let sortList = ({ sortTypes = { primary: 'title', tieBreakerType: null }, items }) => {

    if (!items || !Array.isArray(items)) return;

    // Ensure all items have a numeric relevance score
    if (sortTypes.primary === 'relevance') {
        for (let item of items) {
            if (item.relevance === undefined || isNaN(item.relevance)) {
                item.relevance = 0;
            }
        }
    }

    items.sort((a, b) => {
        let primary = 0;

        if (sortTypes.primary === 'title') primary = (a.title || '').localeCompare(b.title || '');
        else if (sortTypes.primary === 'date') primary = (b.date || 0) - (a.date || 0);
        else if (sortTypes.primary === 'relevance') primary = (b.relevance || 0) - (a.relevance || 0);

        if (primary !== 0) return primary;

        // Tie-breaker
        if (sortTypes.tieBreaker === 'tag') {
            return (a.tag || '').localeCompare(b.tag || '', undefined, { numeric: true, sensitivity: 'base' });
        } else if (sortTypes.tieBreaker === 'title') {
            return (a.title || '').localeCompare(b.title || '');
        } else if (sortTypes.tieBreaker === 'date') {
            return (b.date || 0) - (a.date || 0);
        }

        return 0;
    });

    let index = 1;
    for (let item of items) {
        item.position = index;
        index += 1;
    }

    return items;

}

/**
 * Get selected filters from a form.
 * @param {HTMLFormElement} form
 * @returns {Object} Filter values keyed by name
 */
let getFilters = (form) => {
    if (!form) return {};

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

let ensureListOptions = (list) => {
    if (!list._options) {
        list._options = {
            defaultItemVisibility: list.dataset.defaultItemVisibility ?? 'hidden',
            listItemCategories: JSON.parse(list.dataset.listItemCategories || '["indicator", "component", "consideration", "resource"]'),
            listGroupSize: Number(list.dataset.listGroupSize || 10),
        };
    }
    return list._options;
};

let ensureListControls = (list) => {
    if (!list._controls) {
        list._controls = {
            // TODO: Will need to add an attribute so we can target the proper input
            search: document.querySelector(`#${list.dataset.searchControl} fieldset.search input`) ?? null,
            filter: document.querySelector(`#${list.dataset.filterControl}`) ?? null,
            filterTagList: document.querySelector(`#${list.dataset.filterTagList}`) ?? null,
            sort: document.querySelector(`#${list.dataset.sortControl} fieldset.sort`) ?? null,
            layout: document.querySelector(`#${list.dataset.layoutControl} fieldset.layout`) ?? null,
            showMore: list.closest('.list-container').querySelector('button.show-more') ?? null,
        };
    }
    return list._controls;
};

let ensureListState = (list) => {
    if (!list._state) {
        list._state = {
            search: null,
            filter: null,
            sort: {
                primary: 'relevance',
                tieBreaker: list._controls.sort?.dataset.value ?? null,
            },
            layout: list._controls.layout?.dataset.value ?? null,
            matches: {
                list: [],
                lastShownIndex: list._options.defaultItemVisibility === 'shown' ? list._options.listGroupSize - 1 : -1,
                hiddenMatches: list._options.defaultItemVisibility === 'shown' ? true : false,
            }
        };
    }
    return list._controls;
};

let debounce = (fn, delay = 300) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        let savedArgs = args;
        timeout = setTimeout(() => {
            requestAnimationFrame(() => fn.apply(null, savedArgs));
        }, delay);
    };
};

let debouncedUpdateList = debounce((list) => {
    updateList(list);
});

let updateToggles = (target) => {
    let fieldset = target.closest('fieldset');
    let active = fieldset.querySelector('[aria-pressed="true"]');
    if (active) active.setAttribute('aria-pressed', 'false');
    target.setAttribute('aria-pressed', 'true');
    fieldset.dataset.value = target.value;
}

//
// Search Index
//

let searchIndexModule = (() => {

    let searchIndexPromise = null;

    let init = () => {
        if (!searchIndexPromise) {
            searchIndexPromise = fetch("/search-index.json")
                .then((res) => res.json())
                .catch((err) => {
                    console.error("Failed to fetch search index:", err);
                    return null;
                });
        }
    }

    let getSearchIndex = () => searchIndexPromise;

    return { init, getSearchIndex }

})();

searchIndexModule.init();
eventControl.add({
    elem: document,
    eventType: "astro:after-swap",
    fn: searchIndexModule.init,
});


//
// Filter Control
//

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

        li.dataset.group = group;
        li.dataset.value = value;
        li.dataset.statusField = field ?? null;

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
    let onInput = async (event) => {
        let target = event.target;
        if (!target.matches('fieldset.filters input')) return;
        let form = getForm(target);
        let list = getList(form);
        if (!form || !list) return;

        list._state.filters = getFilters(form);

        updateList(list);

        let statusOperation;
        if (target.checked) {
            statusOperation = 'add';
            let tagList = list._controls.filterTagList;
            if (tagList) {
                let tag = createTag(target, tagList);
                if (tag) tagList.append(tag);
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
                activeFilters: list._state.filters,
            }
        })
    }

    /**
     * Handles filter form reset
     * @param {Event} event
     */
    let onReset = async (event) => {
        let target = event.target;
        if (!target.matches('form:has(fieldset.filters)')) return;
        let form = getForm(target);
        let list = getList(form);
        if (!form || !list) return;

        if (list._state?.filters) list._state.filters = null;

        updateList(list);

        let statusFields = form.querySelectorAll('.filter-group-status [data-field]');
        for (let field of statusFields) {
            updateStatus({
                field,
                operation: 'reset',
            })
        }
        let tagList = list._controls.filterTagList;
        if (tagList) {
            let items = tagList.querySelectorAll(':scope > li');
            for (let item of items) item.remove();
        }
        emitEvent({
            target: document,
            name: 'filterChange',
            detail: {
                activeFilters: {},
            }
        })
    }

    /**
     * Handles filter tag button clicks
     * @param {Event} event
     */
    let onClick = async (event) => {
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

        list._state.filters = getFilters(form);

        updateList(list);

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
                activeFilters: list._state.filters,
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
     * Handles input inside search forms
     * @param {Event} event
     */
    let onInput = async (event) => {
        let target = event.target;
        if (!target.matches('fieldset.search input')) return;

        let form = target.closest('form');
        let list = getList(form);
        if (!form && !list) return;

        list._state.search = target.value.toLowerCase().trim();

        target.removeAttribute('aria-activedescendant');
        let selectedItem = list.querySelector('[aria-selected]');
        if (selectedItem) selectedItem.removeAttribute('aria-selected');

        let searchIndex = await searchIndexModule.getSearchIndex();

        if (target.value.trim().length > 0) {
            target.setAttribute('aria-expanded', 'true');

            // Disable sort controls
            list._controls.sort?.setAttribute('disabled', '');

            debouncedUpdateList(list);

        } else {

            // Enable sort controls
            list._controls.sort?.removeAttribute('disabled');

            debouncedUpdateList(list);

            if (list._options.defaultItemVisibility === 'hidden') {
                target.setAttribute('aria-expanded', 'false');
            }


        }
    };

    let onKeydown = async (event) => {
        let target = event.target;
        let form = target.closest('form');
        let list = getList(form);
        if (!form || !list) return;

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
                let numOfMatches = list._state.matches.length;
                if (numOfMatches === 0) return;

                let currentItemId = target.getAttribute("aria-activedescendant");
                let currentItem = currentItemId ? document.getElementById(currentItemId) : null;
                let currentPos = Number(currentItem?.getAttribute('data-pos'));
                let nextPos = null;

                if (!currentItem) {
                    nextPos = event.key === "ArrowDown"
                        ? 1
                        : 0;
                } else {
                    nextPos = event.key === "ArrowDown"
                        ? currentPos + 1
                        : currentPos - 1;
                }

                if (nextPos > numOfMatches || nextPos < 1) return;

                let nextItem = list.querySelector(`[data-pos="${nextPos}"]`);
                if (!nextItem && list._state.matches.hiddenMatches) {
                    if (list._controls.showMore) list._controls.showMore.click();
                    nextItem = list.querySelector(`[data-pos="${nextPos}"]`);
                    if (!nextItem) return;
                }

                // Update input with active descendant
                target.setAttribute('aria-activedescendant', nextItem.id);
                // Add visual highlight to item
                if (currentItem) currentItem.firstElementChild.removeAttribute('aria-selected');
                nextItem.firstElementChild.setAttribute('aria-selected', 'true');
                // Delayed scroll to account for switch from hidden to shown
                setTimeout(() => {
                    scrollIntoView(nextItem, {
                        block: "nearest",
                    });
                }, 50)
            }

            if (event.key === 'Escape') {
                let currentItemId = target.getAttribute("aria-activedescendant");
                let currentItem = currentItemId ? document.getElementById(currentItemId) : null;
                if (currentItem) currentItem.firstElementChild.removeAttribute('aria-selected');

                target.value = '';
                list._state.search = null;

                target.setAttribute('aria-activedescendant', '');
                scrollIntoView(target, {
                    block: "center",
                });

                if (list._options.defaultItemVisibility === 'hidden') {
                    // Hide the list
                    list.setAttribute('hidden', '');
                    target.setAttribute('aria-expanded', 'false');
                }

                // Filter and sort list
                debouncedUpdateList(list);

                // Enable sort controls
                list._controls.sort?.removeAttribute('disabled');
            }
        }
    }

    let onReset = async (event) => {
        let target = event.target;
        if (!target.matches('form:has(fieldset.search)')) return;
        let form = target.closest('form');
        let list = getList(form);
        if (!form || !list) return;
        let input = document.querySelector(`fieldset.search input[aria-controls="${list.id}"]`);
        if (input) input.setAttribute('aria-activedescendant', '');
        let selectedItem = list.querySelector('[aria-selected]');
        if (selectedItem) selectedItem.removeAttribute('aria-selected');

        list._state.search = null;

        if (list._options.defaultItemVisibility === 'hidden') {
            list.setAttribute('hidden', '');
            target.setAttribute('aria-expanded', 'false');
        }

        debouncedUpdateList(list);

        // Enable sort controls
        list._controls.sort?.removeAttribute('disabled');
    }

    /**
     * Initializes search forms
     */
    let init = () => {
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

    return { init };

})();

let sort = (() => {

    let onClick = async (event) => {
        let target = event.target;
        if (!target.matches('fieldset.sort button')) return;
        let form = target.closest('form') ?? null;
        let list = getList(form);
        if (!form || !list) return;

        list._state.sort.tieBreaker = target.value;

        updateList(list)

        updateToggles(target);

        setPreferences({
            resourcePageSort: target.value,
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

        list._state.layout = target.value;
        list.dataset.layout = target.value;

        updateToggles(target);

        setPreferences({
            resourcePageLayout: target.value,
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

let results = (() => {

    let onClick = (event) => {
        let target = event.target;
        if (!target.matches('button.show-more')) return;
        let list = document.querySelector(`#${target.getAttribute('data-list')}`);
        if (!list) return;

        showListGroup(list);

        let last = Number(list._state.matches.lastShownIndex ?? -1);
        let total = (list._state.matches.list || []).length;
        if ((last + 1) >= total) {
            target.setAttribute('hidden', '');
        }
    }

    let init = () => {
        eventControl.add({
            selector: '.list-container',
            eventType: 'click',
            fn: onClick,
        })
    };

    return { init };

})();

let listModule = (() => {

    let init = async () => {

        let lists = document.querySelectorAll('ul:is([data-search-control], [data-filter-control], [data-sort-control])');
        for (let list of lists) {
            ensureListOptions(list);
            ensureListControls(list);
            ensureListState(list);
            let listIndex = await searchIndexModule.getSearchIndex();
            let filteredListIndex = listIndex.filter((entry) => {
                return list._options.listItemCategories.includes(entry.category);
            }).map(entry => structuredClone(entry));
            let sortedListIndex = sortList({
                sortTypes: {
                    primary: list._state.sort.primary,
                    tieBreaker: list._state.sort.tieBreaker,
                },
                items: filteredListIndex,
            })
            list._listIndex = sortedListIndex;

            // Update matches list if default item visibility is shown
            list._state.matches.list = list._options.defaultItemVisibility === 'shown' ? list._listIndex : [];

            // Ensure shown list items are sent to the bottom of the list
            if (list._options.defaultItemVisibility === 'shown') {
                let shownItems = list.querySelectorAll(':scope>li:not([hidden])');
                let fragment = document.createDocumentFragment();
                for (let item of shownItems) {
                    fragment.append(item);
                }
                list.append(fragment);
            }
        }

    }

    return { init }

})();

listModule.init();
eventControl.add({
    elem: document,
    eventType: "astro:after-swap",
    fn: listModule.init,
});


export { filter, search, sort, layout, results };
