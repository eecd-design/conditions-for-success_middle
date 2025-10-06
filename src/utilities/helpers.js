//
// Helpers
//


//
// Dates
//

let dateFormatter = new Intl.DateTimeFormat('en-US', {
	dateStyle: 'medium',
	timeStyle: 'short'
});

/**
 * Convert Excel numeric date to JS timestamp
 * @param {number} excelDate
 * @returns {number} timestamp in ms since epoch
 */
let excelDateToTimestamp = (excelDate) => {
	if (typeof excelDate !== 'number') return null;

	// Excel day 0 = 1899-12-30 (accounts for 1900 leap year bug)
	let epoch = new Date(Date.UTC(1899, 11, 30));
	let days = Math.floor(excelDate);
	let msInDay = Math.round((excelDate - days) * 24 * 60 * 60 * 1000);

	return epoch.getTime() + days * 24 * 60 * 60 * 1000 + msInDay;
};

/**
 * Parse exported date string back to timestamp
 * @param {string} str - Exported date string like '2025-09-03 07:03:09.009'
 * @returns {number|null}
 */
let parseImportedDateString = (str) => {
	if (!str || typeof str !== 'string') return null;

	let match = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\.(\d{3})$/);
	if (!match) return null;

	let [, year, month, day, hours, minutes, seconds, ms] = match;
	let d = new Date(
		Number(year),
		Number(month) - 1,
		Number(day),
		Number(hours),
		Number(minutes),
		Number(seconds),
		Number(ms)
	);

	return d.getTime();
};

/**
 * Normalize any imported date to JS timestamp
 * Supports:
 *   - Excel numeric dates
 *   - JS timestamps
 *   - Exported date strings
 * @param {string|number|Date} value
 * @returns {number|null} timestamp in ms since epoch
 */
let normalizeImportedDate = (value) => {
	if (value == null) return null;

	// Already a JS timestamp
	if (typeof value === 'number' && value > 1000000000) return value;

	// Excel numeric date
	if (typeof value === 'number') return excelDateToTimestamp(value);

	// Date object
	if (value instanceof Date) return value.getTime();

	// String
	if (typeof value === 'string') return parseImportedDateString(value);

	return null;
};

let formatDateAsHTML = (timestamp) => {
	let parts = dateFormatter.format(new Date(timestamp)).split(", ");
	return parts
		.map((str, index) => {
			if (index === 0) return `<span class="day">${str}</span>`;
			if (index === 1) return `<span class="year">, ${str}</span>`;
			return `<span class="time">, ${str}</span>`;
		})
		.join("");
};


/**
 * Returns the human-readable time difference between two date strings or timestamps.
 * @param {string|number} d1 - First date (string, ms timestamp, or Unix seconds).
 * @param {string|number} d2 - Second date (string, ms timestamp, or Unix seconds).
 * @returns {string} Human-readable time difference.
 */
let getTimeDifference = (d1, d2) => {
	let normalize = (input) => {
		if (typeof input === 'number' && input.toString().length === 10) {
			return new Date(input * 1000); // Unix timestamp in seconds
		}
		return new Date(input);
	};

	let date1 = normalize(d1);
	let date2 = normalize(d2);
	let diffMs = Math.abs(date2 - date1);

	let diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	diffMs %= 1000 * 60 * 60 * 24;

	let diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	diffMs %= 1000 * 60 * 60;

	let diffMinutes = Math.floor(diffMs / (1000 * 60));
	diffMs %= 1000 * 60;

	let diffSeconds = Math.floor(diffMs / 1000);

	let parts = [];
	if (diffDays > 0) parts.push(`${diffDays} day${diffDays !== 1 ? 's' : ''}`);
	if (diffHours > 0) parts.push(`${diffHours} hour${diffHours !== 1 ? 's' : ''}`);
	if (diffMinutes > 0) parts.push(`${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`);
	if (diffSeconds > 0 || parts.length === 0) parts.push(`${diffSeconds} second${diffSeconds !== 1 ? 's' : ''}`);

	return parts.join(', ');
};

/**
 * Format a date for export (human-readable, reversible)
 * @param {Date|number|string} date
 * @returns {string} Formatted as 'YYYY-MM-DD HH:mm:ss.SSS' or empty string
 */
let formatDateAsString = (date, includeTime = true) => {
	if (!date) return '';
	let d = date instanceof Date ? date : new Date(date);

	let year = d.getFullYear();
	let month = String(d.getMonth() + 1).padStart(2, '0');
	let day = String(d.getDate()).padStart(2, '0');
	let hours = String(d.getHours()).padStart(2, '0');
	let minutes = String(d.getMinutes()).padStart(2, '0');
	let seconds = String(d.getSeconds()).padStart(2, '0');
	let ms = String(d.getMilliseconds()).padStart(3, '0');

	if (includeTime) {
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
	} else {
		return `${year}-${month}-${day}`;
	}
};



//
// Object/Array Traversal
//

/**
 * Finds the highest numeric value for a given key in an array of objects.
 * @param {Array<Object>} arr - Array to search.
 * @param {string} key - Key to extract numeric values from.
 * @returns {number|null} Highest value found, or null if not found.
 */
let findHighestValueByKey = (arr, key) => {
	if (!arr || !key) return null;
	let highest = null;
	for (let obj of arr) {
		let val = obj[key];
		if (typeof val === 'number' && !isNaN(val)) {
			if (highest === null || val > highest) {
				highest = val;
			}
		}
	}
	return highest;
};

/**
 * Finds the index of the first object in an array where obj[key] === value.
 * @param {Array<Object>} arr - Array to search.
 * @param {string} key - Key to match.
 * @param {*} value - Value to match.
 * @returns {number} Index of the found object, or -1 if not found.
*/
let findIndexByKey = (arr, key, value) => {
	if (!arr || !key || value === undefined) return -1;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i][key] === value) {
			return i;
		}
	}
	return -1;
};

/**
 * Finds the first object in an array where obj[key] === value.
 * @param {Array<Object>} arr - Array to search.
 * @param {string} key - Key to match.
 * @param {*} value - Value to match.
 * @returns {Object|null} Found object or null if not found.
 */
let findObjectByKey = (arr, key, value) => {
	if (!arr || !key || value === undefined) return null;
	for (let obj of arr) {
		if (obj[key] === value) {
			return obj;
		}
	}
	return null;
};




//
// String Transformations
//

let sanitizeHTML = (input) => {
	return input.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * Converts a string to a boolean.
 * @param {string} str - The string to convert.
 * @returns {boolean} True if the string is "true" (case-insensitive), otherwise false.
 */
let stringToBoolean = function (str) {
	if (typeof str !== 'string') return false;
	return str.trim().toLowerCase() === 'true';
};

/**
 * Convert string to camelCase
 * Handles snake_case, kebab-case, PascalCase, Title Case, etc.
 * @param {string} str
 * @returns {string}
 */
let toCamelCase = function (str) {
	if (!str) return '';
	// Normalize separators and spaces
	str = str.replace(/[_-\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
	// Lowercase first character
	return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * Convert string to kebab-case
 * Handles camelCase, PascalCase, snake_case, Title Case, etc.
 * @param {string} str
 * @returns {string}
 */
let toKebabCase = function (str) {
	if (!str) return '';
	// Replace underscores and spaces with dashes
	str = str.replace(/[_\s]+/g, '-');
	// Insert dash before uppercase letters (camelCase/PascalCase)
	str = str.replace(/([a-z])([A-Z])/g, '$1-$2');
	str = str.replace(/([A-Z])([A-Z][a-z])/g, '$1-$2');
	return str.toLowerCase();
};

/**
 * Convert string to Title Case
 * Handles snake_case, kebab-case, camelCase, PascalCase, and normal sentences
 * @param {string} str
 * @returns {string}
 */
let toTitleCase = function (str) {
	if (!str) return '';
	// Replace underscores and dashes with spaces
	str = str.replace(/[_-]/g, ' ');
	// Insert spaces before capital letters (camelCase/PascalCase)
	str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
	str = str.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
	// Capitalize first letter of each word
	return str
		.toLowerCase()
		.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Join keys with commas and "and" before the last
 * @param {string[]} arr
 * @returns {string}
 */
let joinWithAnd = function (arr) {
	if (arr.length === 0) return '';
	if (arr.length === 1) return arr[0];
	if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
	return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`;
};




//
// Misc
//

/**
 * Emit a custom event
 * @param {Element} target - Element to dispatch the event from
 * @param {string} name - Name of the event
 * @param {Object} [detail={}] - Extra data passed with the event
 */
let emitEvent = ({ target, name, detail = {} }) => {
	let event = new CustomEvent(name, {
		detail,
		bubbles: true,   // let the event bubble up through the DOM
		composed: true   // allow crossing shadow DOM boundaries if needed
	});
	target.dispatchEvent(event);
};

let getResourcePath = (resource) => {

	let { slug, type, external } = resource;

	if (!slug || !type || !external) return null;

	if (external.discriminant === true) {

		return external.value.url;

	} else if (external.discriminant === false) {

		let path;

		let subfolder;
		switch (type) {
			case 'video':
				subfolder = 'media';
				break;
			case 'audio':
				subfolder = 'media';
				break;
			case 'document':
				subfolder = 'files';
				break;
			case 'image':
				subfolder = 'files';
				break;
			case 'presentation':
				subfolder = 'files';
				break;
			default:
				subfolder = 'files';
		}

		let fileType = external.value?.fileType ?? null;

		if (fileType) {

			fileType = fileType.replaceAll('.', '').trim();

		} else {

			switch (type) {
				case 'video':
					fileType = 'mp4';
					break;
				case 'audio':
					fileType = 'mp3';
					break;
				case 'document':
					fileType = 'pdf';
					break;
				case 'image':
					fileType = 'png';
					break;
				case 'presentation':
					fileType = 'pdf';
					break;
				default:
			}

		}

		// path = `/assets/${subfolder}/${slug}.${fileType}`; 
		path = `https://middle.nbed.ca/conditions-for-success/assets/${subfolder}/${slug}.${fileType}`; // Temporary Testing Path
		return path;

	} else {
		return null;
	}
}



/**
 * Create an DOM element from HTML string
 * @param  {String} html
 * @return  {Element}
 */
let htmlToElement = (html) => {
	let template = document.createElement("template");
	html = html.trim(); // Never return a node of whitespace as a result
	template.innerHTML = html;
	return template.content.firstChild;
};

/**
 * Check if two values are equal, including shallow array comparison
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
let isEqual = function (a, b) {
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	}
	return a === b;
};

/**
 * Checks if an element is in the viewport.
 * @param {HTMLElement} elem - The element to check.
 * @param {Object} [options] - Options for visibility.
 * @param {boolean} [options.fully=false] - Whether the element must be fully in view.
 * @returns {boolean} True if element is in view (fully or partially).
 */
let isInViewport = (elem, options = {}) => {

	let { fully = false } = options
	let rect = elem.getBoundingClientRect()

	let viewHeight = window.innerHeight || document.documentElement.clientHeight
	let viewWidth = window.innerWidth || document.documentElement.clientWidth

	if (fully) {
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= viewHeight &&
			rect.right <= viewWidth
		)
	}

	return (
		rect.bottom > 0 &&
		rect.right > 0 &&
		rect.top < viewHeight &&
		rect.left < viewWidth
	)

}

/**
 * Scroll an element into view
 * @param  {Node} elem The elem to show
 */
let scrollIntoView = (elem, options = {}) => {

	let { block = 'start' } = options;

	let fullyInView = isInViewport(elem, {
		fully: true,
	});

	if (!fullyInView) {
		elem.scrollIntoView({
			behavior: 'auto',
			block: block,
		});
	}

}

/**
 * Stop all actively playing videos within a container element
 * @param  {Event} elem The container element
 */
let stopVideo = (elem) => {
	let iframe = elem.matches('iframe') ? elem : elem.querySelector('iframe');
	let video = elem.matches('video') ? elem : elem.querySelector('video');
	if (iframe) {
		let iframeSrc = iframe.src;
		iframe.src = iframeSrc;
	}
	if (video) {
		video.pause();
	}
};



//
// Exports
//

export {
	emitEvent,
	findHighestValueByKey,
	findIndexByKey,
	findObjectByKey,
	formatDateAsHTML,
	formatDateAsString,
	getResourcePath,
	getTimeDifference,
	htmlToElement,
	isEqual,
	isInViewport,
	joinWithAnd,
	normalizeImportedDate,
	sanitizeHTML,
	scrollIntoView,
	stopVideo,
	stringToBoolean,
	toCamelCase,
	toKebabCase,
	toTitleCase,
};