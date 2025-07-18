//
// Imports
//

import { findHighestValueByKey, findIndexByKey, findObjectByKey, formatDateHTML } from "src/utilities/helpers.js";


//
// Variables
//

let key = 'user';

let data = {
	uiPreferences: {
		theme: 'light',
	},
	uiState: {
		activeAssessmentId: null,
		activeAssessor: null,
		changeHistory: [], 
		lastModifiedPage: null,
		lastSavedAt: null,
		lastVisitedPage: typeof window !== 'undefined' ? window.location.pathname : null,
		mode: 'reading',
		onboardingCompleted: false,
		unsavedChanges: false,
	},
	assessments: [],
};

let subscribers = [];


//
// Init (Local Storage)
//

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



//
// Methods (Getters)
//

/**
 * Get the stored user data
 */
let getUserData = () => {
	return data;
};

/**
 * Get the active assessment data
 */
let getActiveAssessmentData = () => {
	return findObjectByKey(data.assessments, 'id', data.uiState.activeAssessmentId);
};

/**
 * Get a human-readable date
 */
let getAssessmentDate = (type) => {
	let assessment = getActiveAssessmentData();
	if (!assessment) return;
	return formatDateHTML(assessment[type]);
};

/**
 * Get the active assessment name
 */
let getAssessmentName = () => {
	let assessment = getActiveAssessmentData();
	if (!assessment) return;
	return `${assessment.reportingYear} – ${assessment.school}`;
};

/**
 * @returns {string} A human-readable save status
 */
let getSaveStatus = () => {
	let { unsavedChanges, lastSavedAt } = data.uiState;

	if (unsavedChanges) {
		if (lastSavedAt) {
			let diff = Date.now() - lastSavedAt;
			let seconds = Math.floor(diff / 1000);
			let minutes = Math.floor(seconds / 60);

			if (minutes < 1) return `Saved to browser. Exported just now.`;
			if (minutes === 1) return `Saved to browser. 1 min. since last export.`;
			return `Saved in browser. ${minutes} min. since last export.`;
		}
		return 'Saved in browser. Export for backup.';
	}

	return 'No changes since last export.';
};

/**
 * Get the active assessment status colour
 */
let getStatusColour = () => {
	let assessment = getActiveAssessmentData();
	if (!assessment) return;
	let colour = assessment.status === 'In Progress' ? 'blue' : 'green';
	return colour;
};

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
let setAssessment = (update) => {
	let assessmentId = data.uiState.activeAssessmentId;
	if (!assessmentId) return;
	let index = findIndexByKey(data.assessments, 'id', assessmentId);
	if (index === -1) {
		data.assessments.push(update);
	} else {
		update.lastModifiedBy = data.uiState.activeAssessor ?? null;
		console.log(data.assessments[index]);
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
		assessors: assessors,
		componentPhase: {},
		considerationsEstablished: [],
		continuumVersion: '1.0',
		dateCreated: Date.now(),
		dateModified: Date.now(),
		district: district,
		id: id,
		lastModifiedBy: null,
		reportingYear: reportingYear,
		school: school,
		status: 'In Progress',
	};

	setState({
		activeAssessmentId: id,
		activeAssessor: null,
		mode: 'assessment',
		unsavedChanges: true,
	})

	setAssessment(assessment);

};

/**
 * Subscribe to data updates
 * @param {(data: typeof data) => void} fn
 */
let subscribe = (fn) => {
	subscribers.push(fn);
	fn(structuredClone(data));
};


//
// Inits
//

save();
notify();


//
// Exports
//

export { getActiveAssessmentData, getAssessmentDate, getAssessmentName, getSaveStatus, getStatusColour, getUserData, subscribe, setPreferences, setState, createAssessment, setAssessment };