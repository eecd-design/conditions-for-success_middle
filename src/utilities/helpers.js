//
// Helpers
//

let dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short' 
});

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

let formatDateHTML = (timestamp) => {
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

/**
 * Converts a kebab-case string to camelCase.
 * @param {string} str - The kebab-case string.
 * @returns {string} The camelCase version.
 */
let kebabToCamel = (str) => {
	return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
};

let sanitizeHTML = (input) => {
	return input.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * Converts a string to kebab-case.
 * 
 * @param {string} str - The input string.
 * @returns {string} The kebab-cased string.
 */
let toKebabCase = (str) => {
  return str
	.replace(/([a-z])([A-Z])/g, '$1-$2')   // handle camelCase/PascalCase
	.replace(/[\s_]+/g, '-')               // replace spaces/underscores
	.toLowerCase()                         // lowercase everything
	.replace(/[^a-z0-9-]/g, '')            // remove non-alphanumerics except -
	.replace(/--+/g, '-')                  // collapse multiple -
	.replace(/^-+|-+$/g, '');              // trim - from ends
};

/**
 * Converts a string to Title Case.
 * Words are split by whitespace and non-letter characters are preserved.
 * @param {string} str - The input string to convert.
 * @returns {string} The converted Title Case string.
 */
let toTitleCase = function (str) {
  return str.replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
};

export { findHighestValueByKey, findIndexByKey, findObjectByKey, formatDateHTML, getTimeDifference, htmlToElement, isEqual, joinWithAnd, kebabToCamel, sanitizeHTML, toKebabCase, toTitleCase };