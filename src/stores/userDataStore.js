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
		schemaVersion: '0.1'
	},
	uiState: {
		activeAssessmentId: null,
		activeAssessor: null,
		lastModifiedPage: null,
		lastVisitedPage: typeof window !== 'undefined' ? window.location.pathname : null,
		mode: 'reading',
		onboardingCompleted: false,
		schemaVersion: '0.1',
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
let getAssessmentDate = ({assessment = getActiveAssessmentData(), type}) => {
	if (!assessment) return;
	return formatDateHTML(assessment[type]);
};

/**
 * Get the active assessment name
 */
let getAssessmentName = (assessment = getActiveAssessmentData()) => {
	if (!assessment) return;
	return `${assessment.reportingYear} – ${assessment.school}`;
};

/**
 * Get the active assessor name
 */
let getActiveAssessor = () => {
	if (!data.uiState.activeAssessor) return null;
	return data.uiState.activeAssessor;
};

/**
 * Get the continuum consideration count
 */
let getConsiderationCount = () => {
	return countPromise;
}

/**
 * @returns {string} A human-readable export status
 */
let getExportStatus = (assessment = getActiveAssessmentData()) => {

	let { unexportedChanges, dateExported } = assessment;

	if (unexportedChanges) {
		if (dateExported) {
			let diff = Date.now() - dateExported;
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
let getStatusColour = (assessment = getActiveAssessmentData()) => {
	if (!assessment) return;
	let colour = assessment.status === 'In Progress' ? 'blue' : 'green';
	return colour;
};

/**
 * Notify all components of data update
 */
let notify = () => {
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
		changeLog: [{
			date: Date.now(),
			assessor: null,
			message: 'Assessment created.', 	
		}],
		continuumCompletion: {},
		considerationsEstablished: [],
		continuumVersion: '1.0',
		dateCreated: Date.now(),
		dateExported: null,
		dateModified: Date.now(),
		district: district,
		id: id,
		lastModifiedBy: null,
		reportingYear: reportingYear,
		school: school,
		status: 'In Progress',
		schemaVersion: '0.1',
		unexportedChanges: true,
	};

	setState({
		activeAssessmentId: id,
		activeAssessor: null,
		mode: 'assessment',
	})

	setAssessment(assessment);

};

let updateChangeLog = ({assessment = getActiveAssessmentData(), assessor = getActiveAssessor(), message}) => {

	if (!assessment || !message) return;

	let entry = {
		date: Date.now(),
		assessor: assessor,
		message: message, 
	}

	assessment.changeLog.push(entry);

	if (assessment.changeLog.length > 10) assessment.changeLog.splice(0, 1);

	return assessment.changeLog;

}

let updateContinuumCompletion = async ({assessment = getActiveAssessmentData(), considerationTag, operation}) => {

	if (!assessment || !considerationTag || !/^\d+\.\d+\.\d+$/.test(considerationTag)) return;

	let count = await getConsiderationCount();

	if (!count) return;

	// Get the connections
	let phase = count[considerationTag].phase;
	let indicator = count[considerationTag].indicator;
	let component = count[considerationTag].component;

	let completion = assessment.continuumCompletion;
	if (!completion) return;

	let updateEntry = (key, system) => {

		let entry = completion[key] ?? {
			totalCount: 0,
			initiatingCount: 0,
			implementingCount: 0,
			developingCount: 0,
			sustainingCount: 0,
			totalRatio: 0,
			initiatingRatio: 0,
			implementingRatio: 0,
			developingRatio: 0,
			sustainingRatio: 0,
			phase: 'Initiating'
		};

		let phaseCountKey = `${phase}Count`;
		let phaseRatioKey = `${phase}Ratio`;

		if (operation === 'add') {
			entry.totalCount += 1;
			entry[phaseCountKey] += 1;
		} else {
			entry.totalCount -= 1;
			entry[phaseCountKey] -= 1;
		}

		entry.totalRatio = entry.totalCount / count[system].total;
		entry[phaseRatioKey] = entry[phaseCountKey] / count[system][phase];

		if ((entry.initiatingRatio >= 0.75 && entry.implementingRatio >= 0.25) || entry.initiatingRatio === 1) {
			entry.phase = 'Implementing';
			if ((entry.implementingRatio >= 0.75 && entry.developingRatio >= 0.25) || entry.implementingRatio === 1) {
				entry.phase = 'Developing';
				if ((entry.developingRatio >= 0.75 && entry.sustainingRatio >= 0.25) || entry.developingRatio === 1) {
					entry.phase = 'Sustaining';
				}
			}
		} else {
			entry.phase = 'Initiating';
		}

		completion[key] = entry;

	};

	updateEntry('continuum', 'continuum');
	updateEntry(indicator, indicator);
	updateEntry(component, component);

	console.log('Updated Completion', completion);

	return completion;

}

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

let countPromise = fetch('/consideration-count.json').then(res => res.json());
save();
notify();


//
// Exports
//

export { updateChangeLog, getActiveAssessmentData, getAssessmentDate, getAssessmentName, getActiveAssessor, getExportStatus, getStatusColour, getUserData, subscribe, setPreferences, setState, createAssessment, setAssessment, updateContinuumCompletion };