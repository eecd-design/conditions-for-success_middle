//
// Imports
//

import {
	findHighestValueByKey,
	findIndexByKey,
	findObjectByKey,
	formatDateAsHTML,
	formatDateAsString,
	isEqual,
	normalizeImportedDate,
	toKebabCase,
} from 'src/utilities/helpers.js';
import { eventControl } from 'src/utilities/event';
import { dialogControl } from 'src/utilities/dialog';
import { continuumChanges } from 'src/pages/data/continuum-changes';

import Papa from 'papaparse';
import LZString from 'lz-string'; // LZString is used to compress data into the exportcode

//
// Variables
//

let key = 'user';

let currentContinuumVersion = '2.0';
let currentPreferencesSchemaVersion = '1.0';
let currentStateSchemaVersion = '2.0';
let currentAssessmentSchemaVersion = '1.0';

let userSchema = {
	uiPreferences: {
		resourcePageSort: 'date',
		resourcePageLayout: 'list-compact',
		reportIncludedIndicators: ['1', '2', '3', '4', '5', '6', '7'],
		theme: document.documentElement.getAttribute('data-theme'),
		schemaVersion: currentPreferencesSchemaVersion,
	},
	uiState: {
		activeAssessmentId: null,
		currentContinuumVersion,
		lastModifiedPage: null,
		lastVisitedPage:
			typeof window !== 'undefined'
				? {
						title: document.title,
						path: window.location.pathname,
					}
				: null,
		latestResourceTimestamp:
			Number(
				document.querySelector('header .site-announcement-container')?.dataset
					.mostRecentTimestamp,
			) ?? null,
		announcementSession: {
			views: 0,
			lastSeen: null,
		},
		mode: 'reading',
		onboardingCompleted: false,
		schemaVersion: currentStateSchemaVersion,
	},
	assessments: [],
};

let data = structuredClone(userSchema);

let subscribers = [];

let importConflictData = null;

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
 * Get a target assessment's data
 */
let getAssessmentData = (id) => {
	return findObjectByKey(data.assessments, 'id', id);
};

/**
 * Get a human-readable date
 */
let getAssessmentDate = ({ assessment = getActiveAssessmentData(), type }) => {
	if (!assessment) return;
	return formatDateAsHTML(assessment[type]);
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
let getActiveAssessor = (assessment = getActiveAssessmentData()) => {
	if (!assessment) return null;
	return assessment.activeAssessor;
};

let getExportStatus = ({ assessment = getActiveAssessmentData(), verbose = true }) => {
	let { unexportedChanges, dateExported } = assessment;

	if (unexportedChanges) {
		if (dateExported) {
			let diff = Date.now() - dateExported;
			let seconds = Math.floor(diff / 1000);
			let minutes = Math.floor(seconds / 60);
			let hours = Math.floor(minutes / 60);
			let days = Math.floor(hours / 24);

			if (minutes < 1)
				return verbose
					? `Saved in browser only. <button class="open-dialog" type="button" data-style-as="link" data-dialog="download-assessment-dialog">Download backup</button>.`
					: 0;

			if (minutes < 60) {
				return verbose
					? `Saved in browser only. <span data-restrict-breakpoint-big-seven-min="3">${minutes} min. since last backup.</span> <button class="open-dialog" type="button" data-style-as="link" data-dialog="download-assessment-dialog">Download backup</button>.`
					: `${minutes} minute${minutes === 1 ? '' : 's'}`;
			}

			if (hours < 24) {
				return verbose
					? `Saved in browser only. <span data-restrict-breakpoint-big-seven-min="3">${hours} hour${hours === 1 ? '' : 's'} since last backup.</span> <button class="open-dialog" type="button" data-style-as="link" data-dialog="download-assessment-dialog">Download backup</button>.`
					: `${hours} hour${hours === 1 ? '' : 's'}`;
			}

			return verbose
				? `Saved in browser only. <span data-restrict-breakpoint-big-seven-min="3">${days} day${days === 1 ? '' : 's'} since last backup.</span> <button class="open-dialog" type="button" data-style-as="link" data-dialog="download-assessment-dialog">Download backup</button>.`
				: `${days} day${days === 1 ? '' : 's'}`;
		}
		return verbose
			? `Saved in browser only. <button class="open-dialog" type="button" data-style-as="link" data-dialog="download-assessment-dialog">Download backup</button>.`
			: 0;
	}

	return verbose ? 'No changes since last backup.' : 0;
};

/**
 * Get the active assessment status colour
 */
let getStatusColour = (assessment = getActiveAssessmentData()) => {
	if (!assessment) return;
	let colour = assessment.status === 'In Progress' ? 'blue' : 'green';
	return colour;
};

let getImportConflictData = () => importConflictData;

//
// Methods (Setters)
//

/**
 * Update user data values
 * @param {data>} update
 */
let setUserData = (update) => {
	// console.log('Setting User Data', update);
	Object.assign(data, update);
	let changes = {};
	for (let key of Object.keys(update)) {
		changes[key] = Object.keys(update[key]);
	}
	save();
	notify(changes);
};

/**
 * Update user preference values
 * @param {Partial<typeof data.uiPreferences>} update
 */
let setPreferences = (update) => {
	// console.log('Setting Preferences', update);
	Object.assign(data.uiPreferences, update);
	let changes = {
		uiPreferences: Object.keys(update),
	};
	save();
	notify(changes);
};

/**
 * Update ui state values
 * @param {Partial<typeof data.uiState>} update
 */
let setState = (update) => {
	// console.log('Setting State', update);
	Object.assign(data.uiState, update);
	let changes = {
		uiState: Object.keys(update),
	};
	save();
	notify(changes);
};

/**
 * Update assessment values
 * @param {Partial<typeof data.assessments[0]>} update
 */
let setAssessment = (update) => {
	// console.log('Setting Assessment', update);

	let targetId = update.id ?? data.uiState.activeAssessmentId;

	// Find the active assessment in user data
	let index = findIndexByKey(data.assessments, 'id', targetId);

	// If absent, add the new/imported assessment to user data
	if (index === -1) {
		data.assessments.push(update);
	}
	// Otherwise, update the assessment
	else {
		let path = window.location.pathname;
		if (path.includes('/big-seven/')) {
			// Update last modified page
			data.uiState.lastModifiedPage =
				typeof window !== 'undefined'
					? {
							title: document.title,
							path,
						}
					: null;

			update.lastModifiedBy = update.activeAssessor ?? data.assessments[index].activeAssessor;
		}
		Object.assign(data.assessments[index], update);
	}
	let changes = {
		assessments: Object.keys(update),
	};
	save();
	notify(changes);
};

//
// Methods (Creators)
//

/**
 * Create an assessment data object
 * @param {Partial<typeof data.meta>} input
 */
let createAssessment = (values) => {
	// console.log('Creating Assessment', values);
	let { reportingYear, district, school } = values;

	let highestId = findHighestValueByKey(data.assessments, 'id');
	let id = typeof highestId === 'number' && !isNaN(highestId) ? highestId + 1 : 1;

	let assessment = {
		activeAssessor: null,
		assessors: [],
		changeLog: [
			{
				date: Date.now(),
				assessor: null,
				message: 'Assessment created.',
			},
		],
		continuumCompletion: {},
		considerationsEstablished: [],
		continuumVersion: currentContinuumVersion,
		dateCompleted: null,
		dateCreated: Date.now(),
		dateExported: null,
		dateModified: Date.now(),
		district,
		id,
		lastModifiedBy: null,
		reportingYear,
		school,
		status: 'In Progress',
		schemaVersion: currentAssessmentSchemaVersion,
		unexportedChanges: true,
	};

	setState({
		activeAssessmentId: id,
		mode: 'assessment',
	});

	setAssessment(assessment);
};

let duplicateAssessment = async (oldAssessment, newReportingYear) => {
	let highestId = findHighestValueByKey(data.assessments, 'id');
	let id = typeof highestId === 'number' && !isNaN(highestId) ? highestId + 1 : 1;

	let newAssessment = {
		activeAssessor: null,
		assessors: oldAssessment.assessors,
		changeLog: [
			{
				date: Date.now(),
				assessor: null,
				message: `New assessment created based on ${oldAssessment.school}'s ${oldAssessment.reportingYear} assessment.`,
			},
		],
		considerationsEstablished: oldAssessment.considerationsEstablished,
		continuumVersion: currentContinuumVersion,
		dateCompleted: null,
		dateCreated: Date.now(),
		dateExported: null,
		dateModified: Date.now(),
		district: oldAssessment.district,
		id,
		lastModifiedBy: null,
		reportingYear: newReportingYear,
		school: oldAssessment.school,
		status: 'In Progress',
		schemaVersion: '1.0',
		unexportedChanges: true,
	};

	newAssessment.continuumCompletion = await generateContinuumCompletion(newAssessment);

	setState({
		activeAssessmentId: id,
		mode: 'assessment',
	});

	setAssessment(newAssessment);
};

let setImportConflictData = ({ importedAssessment, localAssessment }) => {
	importConflictData = {
		importedAssessment,
		localAssessment,
	};
};

let generateContinuumCompletion = async (assessment) => {
	if (!assessment) return;

	let { considerationsEstablished, continuumCompletion, continuumVersion } = assessment;

	if (considerationsEstablished.length === 0) return {};

	if (continuumCompletion && continuumVersion === currentContinuumVersion) {
		return continuumCompletion;
	} else {
		continuumCompletion = {};
	}

	let count = await userDataStore.getConsiderationCount();
	if (!count) return;

	for (let consideration of considerationsEstablished) {
		if (!count[consideration]) continue;

		// Get the connections
		let phase = count[consideration].phase;
		let indicator = count[consideration].indicator;
		let component = count[consideration].component;

		updateContinuumCompletionEntry({
			count,
			continuumCompletion,
			key: 'continuum',
			scope: 'continuum',
			phase,
			operation: 'add',
		});
		updateContinuumCompletionEntry({
			count,
			continuumCompletion,
			key: indicator,
			scope: indicator,
			phase,
			operation: 'add',
		});
		updateContinuumCompletionEntry({
			count,
			continuumCompletion,
			key: component,
			scope: component,
			phase,
			operation: 'add',
		});
	}

	return continuumCompletion;
};

//
// Methods (Updaters)
//

let updateChangeLog = ({ changeLog, assessor = getActiveAssessor(), message }) => {
	if (!changeLog || !message) {
		console.warn('Change log or change message missing. Unable to update change log.');
		return;
	}

	let entry = {
		date: Date.now(),
		assessor: assessor,
		message: message,
	};

	changeLog.push(entry);

	// Limit change history to 20 items
	if (changeLog.length > 20) changeLog.splice(0, 1);

	return changeLog;
};

let updateContinuumVersion = (assessment) => {
	assessment.continuumVersion = currentContinuumVersion;
};

let updateContinuumCompletionEntry = async ({
	count,
	continuumCompletion,
	key,
	scope,
	phase,
	operation,
}) => {
	if (!count[scope]) return;

	let entry = continuumCompletion[key] ?? {
		count: 0,
		initiatingCount: 0,
		implementingCount: 0,
		developingCount: 0,
		sustainingCount: 0,

		total: count[scope].total ?? 0,
		initiatingTotal: count[scope].initiating ?? 0,
		implementingTotal: count[scope].implementing ?? 0,
		developingTotal: count[scope].developing ?? 0,
		sustainingTotal: count[scope].sustaining ?? 0,

		ratio: 0,
		initiatingRatio: 0,
		implementingRatio: 0,
		developingRatio: 0,
		sustainingRatio: 0,

		phase: 'Initiating',
	};

	let phaseCountKey = `${phase}Count`;
	let phaseRatioKey = `${phase}Ratio`;

	if (operation === 'add') {
		entry.count += 1;
		entry[phaseCountKey] += 1;
	} else {
		entry.count = Math.max(0, entry.count - 1);
		entry[phaseCountKey] = Math.max(0, entry[phaseCountKey] - 1);
	}

	entry.ratio = count[scope].total ? entry.count / count[scope].total : 0;
	entry[phaseRatioKey] = count[scope][phase] ? entry[phaseCountKey] / count[scope][phase] : 0;

	if (
		(entry.initiatingRatio >= 0.75 && entry.implementingRatio >= 0.25) ||
		entry.initiatingRatio === 1
	) {
		entry.phase = 'Implementing';
		if (
			(entry.implementingRatio >= 0.75 && entry.developingRatio >= 0.25) ||
			entry.implementingRatio === 1
		) {
			entry.phase = 'Developing';
			if (
				(entry.developingRatio >= 0.75 && entry.sustainingRatio >= 0.25) ||
				entry.developingRatio === 1
			) {
				entry.phase = 'Sustaining';
			}
		}
	} else {
		entry.phase = 'Initiating';
	}

	continuumCompletion[key] = entry;
};

let updateContinuumCompletion = async ({
	assessment = getActiveAssessmentData(),
	consideration,
	operation,
}) => {
	if (!assessment || !consideration || !/^\d+\.\d+\.\d+$/.test(consideration)) return;

	let { continuumCompletion } = assessment;

	let count = await userDataStore.getConsiderationCount();

	if (!count || !count[consideration]) return;

	// Get the connections
	let phase = count[consideration].phase;
	let indicator = count[consideration].indicator;
	let component = count[consideration].component;

	if (!continuumCompletion) return;

	updateContinuumCompletionEntry({
		count,
		continuumCompletion,
		key: 'continuum',
		scope: 'continuum',
		phase,
		operation,
	});
	updateContinuumCompletionEntry({
		count,
		continuumCompletion,
		key: indicator,
		scope: indicator,
		phase,
		operation,
	});
	updateContinuumCompletionEntry({
		count,
		continuumCompletion,
		key: component,
		scope: component,
		phase,
		operation,
	});

	let notify = false;

	let hasUnassessed = false;
	let initiatingIsUnassessed = continuumCompletion[component].initiatingCount === 0;
	let implementingIsUnassessed = continuumCompletion[component].implementingCount === 0;
	let developingIsUnassessed = continuumCompletion[component].developingCount === 0;

	switch (phase) {
		case 'implementing':
			if (initiatingIsUnassessed) hasUnassessed = true;
			break;
		case 'developing':
			if (initiatingIsUnassessed || implementingIsUnassessed) hasUnassessed = true;
			break;
		case 'sustaining':
			if (initiatingIsUnassessed || implementingIsUnassessed || developingIsUnassessed)
				hasUnassessed = true;
			break;
	}

	// Only remind once per component (resets on import)
	if (hasUnassessed && !continuumCompletion[component].reminded) {
		notify = true;
		continuumCompletion[component].reminded = true;
	}

	return {
		entries: continuumCompletion,
		notify,
	};
};

//
// Methods (Upgraders)
//

let upgradeSchema = (oldData, schema) => {
	// Create a new object based on the schema
	let upgraded = { ...schema };

	for (let key in schema) {
		if (oldData && Object.hasOwn(oldData, key)) {
			if (
				typeof schema[key] === 'object' &&
				!Array.isArray(schema[key]) &&
				schema[key] !== null
			) {
				// Recursively update nested objects
				upgraded[key] = upgradeSchema(oldData[key], schema[key]);
			} else {
				// Use existing value when it matches type
				let sameType = typeof oldData[key] === typeof schema[key];
				upgraded[key] = sameType ? oldData[key] : schema[key];
			}
		}
	}

	return upgraded;
};

let convertConsiderations = (assessment) => {
	let debug = true;

	let { continuumVersion, considerationsEstablished } = assessment;

	if (continuumVersion === '1.0') {
		if (debug) console.log('Converting Consideration from 1.0 to 2.0');

		let changesByOldTag = new Map();
		for (let change of continuumChanges.v2) {
			if (change.transformation && change.oldTag !== null) {
				changesByOldTag.set(change.oldTag, change.transformation);
			}
		}

		let converted = [];
		let log = [];
		for (let tag of considerationsEstablished) {
			let transformation = changesByOldTag.get(tag);
			if (!transformation) {
				converted.push(tag);
				continue;
			}
			converted.push(...transformation.to);
			log.push({
				oldTag: tag,
				changeType: transformation.type,
			});
		}

		if (debug) console.log('Converted Considerations Array', converted);

		// Ensure unique values (due to combine change type duplicates)
		assessment.considerationsEstablished = [...new Set(converted)];

		return log;
	}
};

let upgradeAssessments = async (assessments, context) => {
	let debug = true;

	let outOfDate = false;
	for (let assessment of assessments) {
		if (debug) console.log('Pre-upgrade', structuredClone(assessment));

		if (assessment.continuumVersion !== currentContinuumVersion) {
			convertConsiderations(assessment);
			assessment.continuumCompletion = await generateContinuumCompletion(assessment);
			updateContinuumVersion(assessment);

			outOfDate = true;

			if (debug) console.log('Post-upgrade', assessment);
		}
	}

	if (outOfDate) {
		dialogControl.open({
			dialogId: 'continuum-update-dialog',
			context,
		});
		return { upgraded: true };
	} else {
		return { upgraded: false };
	}
};

let upgradeUserData = async (data) => {
	// data = {
	// 	uiPreferences: {
	// 		resourcePageSort: 'date',
	// 		resourcePageLayout: 'compact',
	// 		reportIncludedIndicators: ['1', '2', '3', '4', '5', '6', '7'],
	// 		theme: 'light',
	// 		schemaVersion: '1.0',
	// 	},
	// 	uiState: {
	// 		activeAssessmentId: 2,
	// 		activeReportId: 2,
	// 		currentContinuumVersion: '1.0',
	// 		lastModifiedPage: {
	// 			title: 'Relationships',
	// 			path: '/conditions-for-success/big-seven/relationships/',
	// 		},
	// 		lastVisitedPage: {
	// 			title: 'Access and Equity',
	// 			path: '/conditions-for-success/big-seven/access-and-equity/',
	// 		},
	// 		announcementSession: { views: 5, lastSeen: 1787140204866 },
	// 		mode: 'assessment',
	// 		onboardingCompleted: false,
	// 		schemaVersion: '1.0',
	// 	},
	// 	assessments: [
	// 		{
	// 			activeAssessor: null,
	// 			assessors: [],
	// 			changeLog: [
	// 				{
	// 					date: 1782397142193,
	// 					assessor: null,
	// 					message: 'marked 2.2.1 as established.',
	// 				},
	// 				{
	// 					date: 1782397142651,
	// 					assessor: null,
	// 					message: 'marked 2.2.2 as established.',
	// 				},
	// 				{
	// 					date: 1782397143345,
	// 					assessor: null,
	// 					message: 'marked 2.2.3 as established.',
	// 				},
	// 				{
	// 					date: 1782397146825,
	// 					assessor: null,
	// 					message: 'marked 2.2.5 as established.',
	// 				},
	// 				{
	// 					date: 1782397147681,
	// 					assessor: null,
	// 					message: 'marked 2.2.6 as established.',
	// 				},
	// 				{
	// 					date: 1782397150193,
	// 					assessor: null,
	// 					message: 'marked 2.3.9 as established.',
	// 				},
	// 				{
	// 					date: 1782397151643,
	// 					assessor: null,
	// 					message: 'marked 2.3.10 as established.',
	// 				},
	// 				{
	// 					date: 1782397152443,
	// 					assessor: null,
	// 					message: 'marked 2.3.11 as established.',
	// 				},
	// 				{
	// 					date: 1782397153260,
	// 					assessor: null,
	// 					message: 'marked 2.3.12 as established.',
	// 				},
	// 				{
	// 					date: 1782397156825,
	// 					assessor: null,
	// 					message: 'marked 2.4.1 as established.',
	// 				},
	// 				{
	// 					date: 1782397157410,
	// 					assessor: null,
	// 					message: 'marked 2.4.2 as established.',
	// 				},
	// 				{
	// 					date: 1782397158138,
	// 					assessor: null,
	// 					message: 'marked 2.4.3 as established.',
	// 				},
	// 				{
	// 					date: 1782397491507,
	// 					assessor: null,
	// 					message: 'updated assessment status to completed.',
	// 				},
	// 				{
	// 					date: 1784743246748,
	// 					assessor: null,
	// 					message: 'marked 3.1.1 as established.',
	// 				},
	// 				{
	// 					date: 1784743676508,
	// 					assessor: null,
	// 					message: 'updated assessment status to complete.',
	// 				},
	// 				{
	// 					date: 1784743679588,
	// 					assessor: null,
	// 					message: 'marked 3.1.2 as established.',
	// 				},
	// 				{
	// 					date: 1784743753779,
	// 					assessor: null,
	// 					message: 'marked 3.1.9 as established.',
	// 				},
	// 				{
	// 					date: 1784743770645,
	// 					assessor: null,
	// 					message: 'marked 3.1.10 as established.',
	// 				},
	// 				{
	// 					date: 1784743774121,
	// 					assessor: null,
	// 					message: 'marked 3.1.10 as not established.',
	// 				},
	// 				{
	// 					date: 1784743825655,
	// 					assessor: null,
	// 					message: 'marked 3.1.10 as established.',
	// 				},
	// 			],
	// 			continuumCompletion: {
	// 				2: {
	// 					count: 18,
	// 					initiatingCount: 9,
	// 					implementingCount: 5,
	// 					developingCount: 4,
	// 					sustainingCount: 0,
	// 					total: 110,
	// 					initiatingTotal: 25,
	// 					implementingTotal: 28,
	// 					developingTotal: 27,
	// 					sustainingTotal: 30,
	// 					ratio: 0.16363636363636364,
	// 					initiatingRatio: 0.36,
	// 					implementingRatio: 0.17857142857142858,
	// 					developingRatio: 0.14814814814814814,
	// 					sustainingRatio: 0,
	// 					phase: 'Initiating',
	// 				},
	// 				3: {
	// 					count: 4,
	// 					initiatingCount: 2,
	// 					implementingCount: 0,
	// 					developingCount: 2,
	// 					sustainingCount: 0,
	// 					total: 59,
	// 					initiatingTotal: 15,
	// 					implementingTotal: 15,
	// 					developingTotal: 15,
	// 					sustainingTotal: 14,
	// 					ratio: 0.06779661016949153,
	// 					initiatingRatio: 0.13333333333333333,
	// 					implementingRatio: 0,
	// 					developingRatio: 0.13333333333333333,
	// 					sustainingRatio: 0,
	// 					phase: 'Initiating',
	// 				},
	// 				continuum: {
	// 					count: 22,
	// 					initiatingCount: 11,
	// 					implementingCount: 5,
	// 					developingCount: 6,
	// 					sustainingCount: 0,
	// 					total: 405,
	// 					initiatingTotal: 97,
	// 					implementingTotal: 103,
	// 					developingTotal: 103,
	// 					sustainingTotal: 102,
	// 					ratio: 0.05432098765432099,
	// 					initiatingRatio: 0.1134020618556701,
	// 					implementingRatio: 0.04854368932038835,
	// 					developingRatio: 0.05825242718446602,
	// 					sustainingRatio: 0,
	// 					phase: 'Initiating',
	// 				},
	// 				2.1: {
	// 					count: 6,
	// 					initiatingCount: 3,
	// 					implementingCount: 3,
	// 					developingCount: 0,
	// 					sustainingCount: 0,
	// 					total: 12,
	// 					initiatingTotal: 3,
	// 					implementingTotal: 3,
	// 					developingTotal: 3,
	// 					sustainingTotal: 3,
	// 					ratio: 0.5,
	// 					initiatingRatio: 1,
	// 					implementingRatio: 1,
	// 					developingRatio: 0,
	// 					sustainingRatio: 0,
	// 					phase: 'Developing',
	// 				},
	// 				2.2: {
	// 					count: 5,
	// 					initiatingCount: 3,
	// 					implementingCount: 2,
	// 					developingCount: 0,
	// 					sustainingCount: 0,
	// 					total: 12,
	// 					initiatingTotal: 3,
	// 					implementingTotal: 3,
	// 					developingTotal: 3,
	// 					sustainingTotal: 3,
	// 					ratio: 0.4166666666666667,
	// 					initiatingRatio: 1,
	// 					implementingRatio: 0.6666666666666666,
	// 					developingRatio: 0,
	// 					sustainingRatio: 0,
	// 					phase: 'Implementing',
	// 				},
	// 				2.3: {
	// 					count: 4,
	// 					initiatingCount: 0,
	// 					implementingCount: 0,
	// 					developingCount: 4,
	// 					sustainingCount: 0,
	// 					total: 16,
	// 					initiatingTotal: 4,
	// 					implementingTotal: 4,
	// 					developingTotal: 4,
	// 					sustainingTotal: 4,
	// 					ratio: 0.25,
	// 					initiatingRatio: 0,
	// 					implementingRatio: 0,
	// 					developingRatio: 1,
	// 					sustainingRatio: 0,
	// 					phase: 'Initiating',
	// 				},
	// 				2.4: {
	// 					count: 3,
	// 					initiatingCount: 3,
	// 					implementingCount: 0,
	// 					developingCount: 0,
	// 					sustainingCount: 0,
	// 					total: 13,
	// 					initiatingTotal: 3,
	// 					implementingTotal: 3,
	// 					developingTotal: 3,
	// 					sustainingTotal: 4,
	// 					ratio: 0.23076923076923078,
	// 					initiatingRatio: 1,
	// 					implementingRatio: 0,
	// 					developingRatio: 0,
	// 					sustainingRatio: 0,
	// 					phase: 'Implementing',
	// 				},
	// 				3.1: {
	// 					count: 4,
	// 					initiatingCount: 2,
	// 					implementingCount: 0,
	// 					developingCount: 2,
	// 					sustainingCount: 0,
	// 					total: 16,
	// 					initiatingTotal: 4,
	// 					implementingTotal: 4,
	// 					developingTotal: 4,
	// 					sustainingTotal: 4,
	// 					ratio: 0.25,
	// 					initiatingRatio: 0.5,
	// 					implementingRatio: 0,
	// 					developingRatio: 0.5,
	// 					sustainingRatio: 0,
	// 					phase: 'Initiating',
	// 				},
	// 			},
	// 			considerationsEstablished: ['1.5.4', '1.5.5', '2.7.14', '2.7.15', '2.7.16'],
	// 			continuumVersion: '1.0',
	// 			dateCompleted: 1784743676508,
	// 			dateCreated: 1781895178989,
	// 			dateExported: 1782395151341,
	// 			dateModified: 1784743825655,
	// 			district: 'ASD-N',
	// 			id: 2,
	// 			lastModifiedBy: null,
	// 			reportingYear: '2032',
	// 			school: 'North & South Esk Elementary School',
	// 			status: 'Complete',
	// 			schemaVersion: '1.0',
	// 			unexportedChanges: true,
	// 		},
	// 		{
	// 			activeAssessor: null,
	// 			assessors: [],
	// 			changeLog: [
	// 				{ date: 1768400811747, assessor: null, message: 'Assessment created.' },
	// 				{
	// 					date: 1779280778937,
	// 					assessor: null,
	// 					message: 'updated assessment status to completed.',
	// 				},
	// 				{
	// 					date: 1781024698387,
	// 					assessor: null,
	// 					message: 'updated assessment status to completed.',
	// 				},
	// 			],
	// 			considerationsEstablished: ['1.5.4'],
	// 			continuumVersion: '1.0',
	// 			dateCompleted: null,
	// 			dateCreated: 1768400811747,
	// 			dateExported: null,
	// 			dateModified: 1768400811747,
	// 			district: 'ASD-N',
	// 			id: 1,
	// 			lastModifiedBy: null,
	// 			reportingYear: '2023',
	// 			school: 'Nelson Rural School',
	// 			status: 'In Progress',
	// 			schemaVersion: '1.0',
	// 			unexportedChanges: false,
	// 			continuumCompletion: {},
	// 		},
	// 	],
	// };

	let upgraded = false;

	if (data.uiPreferences.schemaVersion !== currentPreferencesSchemaVersion) {
		console.warn('User preferences schema is out of date.');
		data.uiPreferences = upgradeSchema(data.uiPreferences, userSchema.uiPreferences);
		data.uiPreferences.schemaVersion = currentPreferencesSchemaVersion;
		upgraded = true;
	}

	if (data.uiState.schemaVersion !== currentStateSchemaVersion) {
		console.warn('User state schema is out of date.');
		data.uiState = upgradeSchema(data.uiState, userSchema.uiState);
		data.uiState.schemaVersion = currentStateSchemaVersion;
		upgraded = true;
	}

	let upgradeAssessmentsResult = await upgradeAssessments(data.assessments, 'load');

	if (upgradeAssessmentsResult.upgraded) upgraded = true;

	if (upgraded) setUserData(data);
};

//
// Methods (Checkers)
//

let checkForChanges = ({ data, update }) => {
	let updatedKeys = [];
	let changedValues = {};

	for (let [key, value] of Object.entries(update)) {
		let oldValue = data[key];

		// If the value is an array, detect added/removed items
		if (Array.isArray(value) && Array.isArray(oldValue)) {
			let added = value.filter((v) => !oldValue.includes(v));
			let removed = oldValue.filter((v) => !value.includes(v));

			if (added.length || removed.length) {
				updatedKeys.push({
					key,
					changes: [
						...(added.length ? [{ type: 'added', value: added }] : []),
						...(removed.length ? [{ type: 'removed', value: removed }] : []),
					],
				});
				changedValues[key] = value;
			}
		}
		// Normal comparison for other types
		else if (!isEqual(value, oldValue)) {
			updatedKeys.push({ key });
			changedValues[key] = value;
		}
	}

	if (Object.keys(changedValues).length !== 0) {
		return { updatedKeys, changedValues };
	} else {
		return false;
	}
};

let checkAnnouncementSession = () => {
	let announcementSession = data.uiState.announcementSession ?? {
		views: 0,
		lastSeen: null,
	};

	let { views, lastSeen } = announcementSession;
	let { latestResourceTimestamp } = data.uiState;

	let sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
	let recencyTimeout = 30 * 24 * 60 * 60 * 1000; // 30 days
	let now = Date.now();

	let showAnnouncement = false;

	// Check if it's been over a month since the most recent resource was added
	if (!latestResourceTimestamp || now - latestResourceTimestamp > recencyTimeout) {
		// Reset session
		views = 0;
		lastSeen = null;
	} else {
		// Check if it's been over 24 hours since the user has accessed the site
		if (!lastSeen || now - lastSeen > sessionTimeout) {
			// Reset session
			views = 0;
		}

		// Keep track of announcement views
		views = (views || 0) + 1;

		lastSeen = now;

		// Show for the first 3 page views
		showAnnouncement = views <= 3;
	}

	setState({
		announcementSession: {
			views,
			lastSeen,
		},
	});

	return showAnnouncement;
};

//
// Methods (Deleters)
//

let deleteAssessment = (id) => {
	// console.log('Deleting Assessment', id);
	let changes = {};
	let index = data.assessments.findIndex((obj) => obj.id === id);
	if (index !== -1) {
		let update = [...data.assessments];
		update.splice(index, 1);
		Object.assign(data, { assessments: update });
		changes.assessments = [];
	}

	let isActiveAssessment = id === data.uiState.activeAssessmentId;

	if (isActiveAssessment) {
		let update = {};
		if (isActiveAssessment) {
			update.activeAssessmentId = null;
			update.mode = 'reading';
		}
		Object.assign(data.uiState, update);
		changes.uiState = Object.keys(update);
	}
	save();
	notify(changes);
};

let deleteImportConflictData = () => (importConflictData = null);

//
// Methods (Import/Export)
//

/**
 * Export assessment object as CSV
 * @param {Object} assessment - Assessment data
 */
let exportAssessment = (assessment) => {
	// Define columns for the main CSV
	let mainData = [
		{
			Id: assessment.id || '',
			School: assessment.school || '',
			District: assessment.district || '',
			'Reporting Year': assessment.reportingYear || '',
			Status: assessment.status || '',
			'Date Completed': formatDateAsString(assessment.dateCompleted),
			'Date Created': formatDateAsString(assessment.dateCreated),
			'Date Modified': formatDateAsString(assessment.dateModified),
			'Date Exported': formatDateAsString(assessment.dateExported),
			'Last Modified By': assessment.lastModifiedBy || '',
			Assessors: (assessment.assessors || []).join(', '),
			'Considerations Established': (assessment.considerationsEstablished || []).join(', '),
			'Continuum Version': assessment.continuumVersion || '',
			'Schema Version': assessment.schemaVersion || '',
		},
	];

	// Define change log CSV
	let changeLogData = (assessment.changeLog || []).map((log) => ({
		Date: formatDateAsString(log.date) || '',
		Message: log.message || '',
		Assessor: log.assessor || '',
	}));

	if (!changeLogData.length) {
		changeLogData = [{ Note: 'No change log' }];
	}

	// Convert both sections to CSV
	let mainCsv = Papa.unparse(mainData);
	let logCsv = Papa.unparse(changeLogData);

	// Combine with separation
	let combinedCsv = mainCsv + '\n\n' + logCsv;

	// Filename
	let fileDate = formatDateAsString(assessment.dateExported || new Date(), false);
	let filename = `assessment_${toKebabCase(assessment.school)}_${assessment.reportingYear}_export-${fileDate}.csv`;

	// Trigger download
	let blob = new Blob([combinedCsv], { type: 'text/csv;charset=utf-8;' });
	let link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	link.click();
};

/**
 * Parse a CSV file and convert it back into an assessment object
 * @param {File} file - File uploaded by the user
 * @returns {Promise<Object>} Parsed assessment object
 */
let importAssessment = (file) => {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();

		reader.onload = (event) => {
			let data = event.target.result;

			// Split the combined CSV into main and change log parts
			let [mainCsv, logCsv] = data.split(/\n\s*\n/);

			// Parse with PapaParse
			let mainResult = Papa.parse(mainCsv, {
				header: true,
				skipEmptyLines: true,
			});
			let logResult = Papa.parse(logCsv || '', {
				header: true,
				skipEmptyLines: true,
			});

			if (!mainResult.data || !mainResult.data.length) {
				return reject('No main data found in the file');
			}

			let mainRow = mainResult.data[0]; // Only one row expected
			let assessment = {
				activeAssessor: null,
				assessors: mainRow['Assessors']
					? mainRow['Assessors'].split(',').map((s) => s.trim())
					: [],
				changeLog: [],
				considerationsEstablished: mainRow['Considerations Established']
					? mainRow['Considerations Established'].split(',').map((s) => s.trim())
					: [],
				continuumVersion: mainRow['Continuum Version'] || '',
				dateCompleted: mainRow['Date Completed']
					? normalizeImportedDate(mainRow['Date Completed'])
					: null,
				dateCreated: mainRow['Date Created']
					? normalizeImportedDate(mainRow['Date Created'])
					: null,
				dateExported: mainRow['Date Exported']
					? normalizeImportedDate(mainRow['Date Exported'])
					: null,
				dateModified: mainRow['Date Modified']
					? normalizeImportedDate(mainRow['Date Modified'])
					: null,
				district: mainRow['District'] || '',
				id: Number(mainRow['Id']) || 1,
				lastModifiedBy: mainRow['Last Modified By'] || null,
				reportingYear: mainRow['Reporting Year'] || '',
				school: mainRow['School'] || '',
				status: mainRow['Status'] || 'In Progress',
				schemaVersion: mainRow['Schema Version'] || '',
				unexportedChanges: false,
			};

			// Parse change log rows
			if (logResult.data && logResult.data.length) {
				assessment.changeLog = logResult.data.map((log) => ({
					date: log['Date'] ? normalizeImportedDate(log['Date']) : null,
					assessor: log['Assessor'] || null,
					message: log['Message'] || log['Note'] || '',
				}));
			}

			upgradeAssessments([assessment], 'import');

			resolve(assessment);
		};

		reader.onerror = (err) => reject(err);

		reader.readAsText(file);
	});
};

/**
 * Detect conflicts separately for ID and School/Year
 * @param {Object} importedAssessment - Assessment object from import
 * @param {Object[]} localAssessments - Existing assessments
 * @returns {Object} Conflict details with separate arrays
 */
let findAssessmentConflicts = ({ importedAssessment, localAssessments }) => {
	let idConflict = false;
	let schoolYearConflict = false;
	for (let assessment of localAssessments) {
		if (assessment.id === importedAssessment.id) {
			idConflict = assessment;
		}

		if (
			assessment.school === importedAssessment.school &&
			assessment.reportingYear === importedAssessment.reportingYear
		) {
			schoolYearConflict = assessment;
		}
	}

	return { idConflict, schoolYearConflict };
};

//
// Methods (Encoding)
//

let compressData = (data) => {
	try {
		return LZString.compressToBase64(JSON.stringify(data));
	} catch (err) {
		throw new Error('Unable to compress JSON', { cause: 'JSON' });
	}
};

let decompressData = (data) => {
	try {
		return JSON.parse(LZString.decompressFromBase64(data));
	} catch (err) {
		throw new Error('Unable to parse JSON', { cause: 'JSON' });
	}
};

//
// Methods (Storage and DOM Updates)
//

/**
 * Notify all components of data update
 */
let notify = (changes) => {
	// console.log('Notifying', subscribers);
	for (let fn of subscribers) fn(structuredClone(data), changes);
};

/**
 * Save to localStorage
 */
let save = () => {
	console.log('Saving to local storage', data);
	localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Subscribe to data updates
 * @param {(data: typeof data, changes: any) => void} fn
 */
let subscribe = (fn) => {
	if (!subscribers.includes(fn)) {
		// console.log('Subscribing', fn.name);
		subscribers.push(fn);
		let changes = {
			initiating: true,
		};
		fn(structuredClone(data), changes);
	}
	// Return a function that removes the subscriber
	return () => {
		// console.log('Unsubscribing', fn.name);
		subscribers = subscribers.filter((sub) => sub !== fn);
	};
};

//
// Inits
//

let userDataStore = (() => {
	let considerationCountPromise = null;

	let init = () => {
		if (!considerationCountPromise) {
			considerationCountPromise = fetch('./data/consideration-count.json')
				.then((res) => res.json())
				.catch((err) => {
					console.error('Failed to fetch consideration count:', err);
					return null;
				});
		}

		save();
		let changes = {
			initiating: true,
		};
		notify(changes);
	};

	let getConsiderationCount = () => considerationCountPromise;

	let load = async () => {
		let debug = true;

		try {
			let raw = localStorage.getItem(key);
			if (raw) {
				data = JSON.parse(raw);
				if (debug) console.log('User data from local storage', data);
			} else {
				if (debug) console.log('No user data found in local storage, using default', data);
			}
		} catch (err) {
			console.warn('Failed to load user data:', err);
			localStorage.removeItem(key);
		}
	};

	return { init, load, getConsiderationCount };
})();

userDataStore.load();

userDataStore.init();
eventControl.add({
	elem: document,
	eventType: 'astro:after-swap',
	fn: userDataStore.init,
});

upgradeUserData(data);

//
// Exports
//

export {
	checkForChanges,
	compressData,
	decompressData,
	findAssessmentConflicts,
	getActiveAssessmentData,
	getAssessmentData,
	getAssessmentDate,
	getAssessmentName,
	getActiveAssessor,
	getExportStatus,
	getStatusColour,
	getUserData,
	getImportConflictData,
	subscribe,
	setPreferences,
	setState,
	createAssessment,
	duplicateAssessment,
	setAssessment,
	setImportConflictData,
	deleteAssessment,
	exportAssessment,
	importAssessment,
	updateChangeLog,
	updateContinuumCompletion,
	generateContinuumCompletion,
	deleteImportConflictData,
	userDataStore,
	checkAnnouncementSession,
};
