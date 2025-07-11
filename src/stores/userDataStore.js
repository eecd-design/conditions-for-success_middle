//
// Imports
//

import { findHighestValueByKey, findIndexByKey } from "src/utilities/helpers.js";


//
// Variables
//


let key = 'user';

let data = {
	uiPreferences: {
		theme: 'light',
	},
	uiState: {
		mode: 'reading',
		onboardingCompleted: false,
		lastVisitedPage: typeof window !== 'undefined' ? window.location.pathname : null,
		lastModifiedPage: null,
		activeAssessment: null,
		unsavedChanges: false,
		lastSavedAt: null,
		changeHistory: [], 
	},
	assessments: [],
};

let subscribers = [];

/**
 * Load from localStorage
 */
try {
	let raw = localStorage.getItem(key);
	if (raw) data = JSON.parse(raw);
} catch (err) {
	console.warn('Failed to load user data:', err);
	localStorage.removeItem(key);
}

/**
 * Notify all components of data update
 */
let notify = () => {
	console.log('Notifying...', subscribers);
	for (let fn of subscribers) fn(structuredClone(data));
};

/**
 * Save to localStorage
 */
let save = () => {
	localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Update user preference values
 * @param {Partial<typeof data.uiPreferences>} update
 */
let setPreferences = (update) => {
	Object.assign(data.uiPreferences, update);
	save();
	notify();
};

/**
 * Update ui state values
 * @param {Partial<typeof data.uiState>} update
 */
let setState = (update) => {
	Object.assign(data.uiState, update);
	save();
	notify();
};

/**
 * Update assessment values
 * @param {Partial<typeof data.assessments[0]>} update
 */
let setAssessment = (id, update) => {
	let index = findIndexByKey(data.assessments, 'id', id);
	if (index === -1) {
		data.assessments.push(update);
	} else {
		Object.assign(data.assessments[index], update);
	}
	save();
	notify();
};

/**
 * Create an assessment data object
 * @param {Partial<typeof data.meta>} input
 */
let createAssessment = (inputs) => {

	let { reportingYear, district, school, assessors } = inputs;

	let highestId = findHighestValueByKey(data.assessments, 'id');
	let id = (typeof highestId === 'number' && !isNaN(highestId)) ? highestId + 1 : 1;

	let assessment = {
		id: id,
		status: 'In Progress',
		continuumVersion: '1.0',
		dateCreated: Date.now(),
		dateModified: Date.now(),
		lastModifiedBy: null,
		reportingYear: reportingYear,
		district: district,
		school: school,
		assessors: assessors,
		considerationsEstablished: [],
		componentPhase: {},
	};

	setAssessment(id, assessment);

	setState({
		activeAssessment: id,
		mode: 'assessment',
		unsavedChanges: true,
	})

};

/**
 * Subscribe to data updates
 * @param {(data: typeof data) => void} fn
 */
let subscribe = (fn) => {
	subscribers.push(fn);
	fn(structuredClone(data));
};

save();
notify();

export { subscribe, setPreferences, setState, createAssessment, setAssessment };