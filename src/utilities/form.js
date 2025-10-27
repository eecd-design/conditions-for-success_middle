import { getUserData } from "src/stores/userDataStore";
import { toCamelCase } from "./helpers";

let getFormValues = (form) => {
	let result = {};

	// Get select and input elements
	let fields = form.querySelectorAll('select[name], input[name]');

	for (let field of fields) {
		let { name, type } = field;

		// Skip fields with no name
		if (!name) continue;

		// Normalize name to camel case
		name = toCamelCase(name);

		// 1. Handle radio button groups
		if (type === 'radio') {
			// Only capture checked radio once
			if ((field).checked) {
				result[name] = field.value;
			}
			// 2. Handle checkboxes
		} else if (type === 'checkbox') {
			// Create an array to hold checkbox group values
			if (!result[name]) result[name] = [];
			// If checked, add value to array
			if ((field).checked) {
				result[name].push(field.value);
			}
			// 3. Handle text inputs and selects
		} else {
			result[name] = field.value;
		}
	}

	// 4. Handle custom <ul data-field> lists
	let lists = form.querySelectorAll('ul[data-field]');
	for (let list of lists) {
		let items = [];
		for (let item of list.querySelectorAll('[data-field-value]')) {
			items.push(item.textContent.trim());
		}
		let field = list.getAttribute('data-field');
		if (field) result[field] = items;
	}

	return result;
};

let resetForm = ({ form, resetType = 'soft' }) => {

	// Soft reset: Restore fields to original value state
	if (resetType === 'soft') {
		form.reset();
	}
	// Hard reset: Set all fields to blank
	else if (resetType === 'hard') {
		for (let field of form.querySelectorAll('input, select')) {
			if (field.type === 'checkbox' || field.type === 'radio') {
				field.checked = false;
			} else {
				field.value = '';
			}
		}
	}

	// Reset custom <ul data-field> lists
	let resetCustomLists = form.hasAttribute('data-reset-custom-lists');
	if (resetCustomLists) {
		let formLists = form.querySelectorAll('ul[data-field]');
		for (let list of formLists) {
			list.innerHTML = '';
		}
	}

	// Hide all error statuses
	let errorsStatuses = form.querySelectorAll('.error-status');
	for (let status of errorsStatuses) {
		status.setAttribute('hidden', '');
	}

	// Reset aria-invalid on all fields
	let fields = form.querySelectorAll('input, select');
	for (let field of fields) {
		field.removeAttribute('aria-invalid');
	}
};

let validateField = ({ field, form, touchedFormFields }) => {
	// Clear previous custom validity
	field.setCustomValidity('');

	let error = document.getElementById(`${field.id}_error`);
	if (!error) return;

	// Set a custom error message
	let message = '';

	if (field.validity.valueMissing) {
		message = 'This field is required.';
	} else if (field.name === 'reportingYear' && field.validity.patternMismatch) {
		message = 'Year must be 4 digits.';
	}

	// Cross-field check for reporting year
	if (field.name === 'reportingYear') {

		let schoolField = form.querySelector('select[name="school"]');

		// If school is empty, skip conflict check
		if (!schoolField.value) {
			// Reset error if no school is selected
			field.setCustomValidity('');
			error.querySelector('span').textContent = '';
			error.setAttribute('hidden', '');
			field.removeAttribute('aria-invalid');
			return;
		}

		let userData = getUserData();
		let schoolYearConflict = userData.assessments.some(a =>
			a.school === schoolField.value && a.reportingYear === field.value
		);
		if (schoolYearConflict) {
			message = `An assessment for this school and year is already saved in your browser. To view it, open the 'Open Assessment' dialog from the toolbar.`;
		}
	}

	// If the field was interacted with, show the error status and flag the field
	if (touchedFormFields.has(field)) {
		if (message) {
			field.setCustomValidity(message);
			error.querySelector('span').textContent = message;
			error.removeAttribute('hidden');
			field.setAttribute('aria-invalid', 'true');
		} else {
			field.setCustomValidity('');
			error.querySelector('span').textContent = '';
			error.setAttribute('hidden', '');
			field.removeAttribute('aria-invalid');
		}
	}

	// If school field changes, reset reportingYear error
	if (field.name === 'school') {

		let reportingYearField = form.querySelector('input[name="reportingYear"]');

		if (reportingYearField.value) {
			let reportingYearError = document.getElementById(`${reportingYearField.id}_error`);
			reportingYearField.setCustomValidity('');
			reportingYearError.querySelector('span').textContent = '';
			reportingYearError.setAttribute('hidden', '');
			reportingYearField.removeAttribute('aria-invalid');
		}
	}

};

let validateForm = ({ form, touchedFormFields }) => {
	let firstInvalid = null;

	// Validate every field in the form
	let fields = form.querySelectorAll('input[required], select[required]');
	for (let field of fields) {

		validateField({ field, form, touchedFormFields });

		// Store the first invalid field
		if (!field.validity.valid && !firstInvalid) {
			firstInvalid = field;
		}
	}

	// Assign focus to the first invalid field
	if (firstInvalid) {
		firstInvalid.focus();
		return false;
	}

	return true;
};

export { getFormValues, resetForm, validateField, validateForm }