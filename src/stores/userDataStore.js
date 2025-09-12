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
	toKebabCase 
} from "src/utilities/helpers.js";
import * as XLSX from 'xlsx'; // Sheets.js (XLSX) is used to create and interpret CSV and Excel files
import LZString from 'lz-string'; // LZString is used to compress data into the exportcode


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
		lastModifiedPage: null,
		lastVisitedPage: typeof window !== 'undefined' ? {
			title: document.querySelector('h1').textContent,
			path: window.location.pathname
		} : null,
		mode: 'reading',
		onboardingCompleted: false,
		schemaVersion: '0.3',
	},
	assessments: [],
};

let subscribers = [];

let importConflictData = null;


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

			if (minutes < 1) return verbose ? `Saved to browser. Exported just now.` : minutes;
			if (minutes === 1) return verbose ? `Saved to browser. 1 min. since last export.` : minutes;
			return verbose ? `Saved in browser. ${minutes} min. since last export.` : minutes;
		}
		return verbose ? 'Saved in browser. Export for backup.' : 0;
	}

	return verbose ? 'No changes since last export.' : 0;
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
 * Update user preference values
 * @param {Partial<typeof data.uiPreferences>} update
 */
let setPreferences = (update) => {
	// console.log('Setting Preferences', update);
	Object.assign(data.uiPreferences, update);
	save();
	notify();
};

/**
 * Update ui state values
 * @param {Partial<typeof data.uiState>} update
 */
let setState = (update) => {
	// console.log('Setting State', update);
	Object.assign(data.uiState, update);
	save();
	notify();
};

/**
 * Update assessment values
 * @param {Partial<typeof data.assessments[0]>} update
 */
let setAssessment = (update) => {
	console.log('Setting Assessment', update);

	let targetId = update.id ?? data.uiState.activeAssessmentId;

	// Find the active assessment in user data
	let index = findIndexByKey(data.assessments, 'id', targetId);

	console.log('Existing Assessment Index', index);

	// If absent, add the new/imported assessment to user data
	if (index === -1) {
		data.assessments.push(update);

		// Otherwise, update the assessment
	} else {

		// Update last modified page
		let pageTitle = document.querySelector('h1')?.textContent;
		if (pageTitle) {
			data.uiState.lastModifiedPage = typeof window !== 'undefined' ? {
				title: document.querySelector('h1')?.textContent,
				path: window.location.pathname,
			} : null;
		}

		update.lastModifiedBy = update.activeAssessor ?? data.assessments[index].activeAssessor;
		Object.assign(data.assessments[index], update);
	}

	save();
	notify();
};

/**
 * Create an assessment data object
 * @param {Partial<typeof data.meta>} input
 */
let createAssessment = (values) => {
	// console.log('Creating Assessment', values);
	let { reportingYear, district, school } = values;

	let highestId = findHighestValueByKey(data.assessments, 'id');
	let id = (typeof highestId === 'number' && !isNaN(highestId)) ? highestId + 1 : 1;

	let assessment = {
		activeAssessor: null,
		assessors: [],
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
		district,
		id,
		lastModifiedBy: null,
		reportingYear,
		school,
		status: 'In Progress',
		schemaVersion: '0.1',
		unexportedChanges: true,
	};

	setState({
		activeAssessmentId: id,
		mode: 'assessment',
	})

	setAssessment(assessment);

};

let setImportConflictData = ({ importedAssessment, localAssessment }) => {
	importConflictData = {
		importedAssessment,
		localAssessment
	};
}

let updateChangeLog = ({ assessment = getActiveAssessmentData(), assessor = getActiveAssessor(), message }) => {

	if (!assessment || !message) return;

	let entry = {
		date: Date.now(),
		assessor: assessor,
		message: message,
	}

	assessment.changeLog.push(entry);

	// Limit change history to 20 items
	if (assessment.changeLog.length > 20) assessment.changeLog.splice(0, 1);

	return assessment.changeLog;

}

let updateContinuumCompletionEntry = async ({ count, completion, key, system, phase, operation }) => {

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
		entry.totalCount = Math.max(0, entry.totalCount - 1);
		entry[phaseCountKey] = Math.max(0, entry[phaseCountKey] - 1);
	}

	entry.totalRatio = count[system].total ? entry.totalCount / count[system].total : 0;
	entry[phaseRatioKey] = count[system][phase] ? entry[phaseCountKey] / count[system][phase] : 0;

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

let generateContinuumCompletion = async (assessment) => {
	if (!assessment) return;

	let completion = assessment.continuumCompletion ?? {};

	let { considerationsEstablished } = assessment;
	if (considerationsEstablished.length === 0) return completion;

	let count = await userDataStore.getConsiderationCount();
	if (!count) return;

	for (let consideration of considerationsEstablished) {

		// Get the connections
		let phase = count[consideration].phase;
		let indicator = count[consideration].indicator;
		let component = count[consideration].component;

		updateContinuumCompletionEntry({ count, completion, key: 'continuum', system: 'continuum', phase, operation: 'add' });
		updateContinuumCompletionEntry({ count, completion, key: indicator, system: indicator, phase, operation: 'add' });
		updateContinuumCompletionEntry({ count, completion, key: component, system: component, phase, operation: 'add' });

	}

	return completion;

}

let updateContinuumCompletion = async ({ assessment = getActiveAssessmentData(), consideration, operation }) => {

	if (!assessment || !consideration || !/^\d+\.\d+\.\d+$/.test(consideration)) return;

	let count = await userDataStore.getConsiderationCount();

	if (!count || !count[consideration]) return;

	// Get the connections
	let phase = count[consideration].phase;
	let indicator = count[consideration].indicator;
	let component = count[consideration].component;

	let completion = assessment.continuumCompletion;
	if (!completion) return;

	updateContinuumCompletionEntry({ count, completion, key: 'continuum', system: 'continuum', phase, operation });
	updateContinuumCompletionEntry({ count, completion, key: indicator, system: indicator, phase, operation });
	updateContinuumCompletionEntry({ count, completion, key: component, system: component, phase, operation });

	return completion;

}

let checkForChanges = ({ data, update }) => {
	let updatedKeys = [];
	let changedValues = {};

	for (let [key, value] of Object.entries(update)) {
		let oldValue = data[key];

		// If the value is an array, detect added/removed items
		if (Array.isArray(value) && Array.isArray(oldValue)) {
			let added = value.filter(v => !oldValue.includes(v));
			let removed = oldValue.filter(v => !value.includes(v));

			if (added.length || removed.length) {
				updatedKeys.push({
					key,
					changes: [
						...(added.length ? [{ type: 'added', value: added }] : []),
						...(removed.length ? [{ type: 'removed', value: removed }] : [])
					]
				});
				changedValues[key] = value;
			}
		} 
		// Normal comparison for other types
		else if (!isEqual(value, oldValue)) {
			updatedKeys.push({key});
			changedValues[key] = value;
		}
	}

	if (Object.keys(changedValues).length !== 0) {
		return { updatedKeys, changedValues };
	} else {
		return false;
	}
}


//
// Methods (Deleters)
//

let deleteAssessment = (id) => {
	console.log('Deleting Assessment', id);
	let index = data.assessments.findIndex(obj => obj.id === id);
	if (index !== -1) {
		let update = [...data.assessments];
		update.splice(index, 1);
		Object.assign(data, { assessments: update });
	}
	save();
	notify();
}

let deleteImportConflictData = () => importConflictData = null;

//
// Methods (Import/Export)
//

/**
 * Export assessment object as CSV or Excel
 * @param {Object} assessment - Assessment data
 * @param {string} format - 'csv' or 'xlsx'
 */
let exportAssessment = (assessment, format = 'csv') => {

	/**
	 * Auto fit column widths based on content
	 * @param {Object} worksheet - XLSX worksheet
	 */
	let autoFitColumns = function (worksheet) {
		let range = XLSX.utils.decode_range(worksheet['!ref']);
		let colWidths = [];

		for (let C = range.s.c; C <= range.e.c; C++) {
			let maxLength = 10; // minimum width
			for (let R = range.s.r; R <= range.e.r; R++) {
				let cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
				let cell = worksheet[cellAddress];
				if (cell && cell.v) {
					let len = String(cell.v).length;
					if (len > maxLength) maxLength = len;
				}
			}
			colWidths.push({ wch: maxLength + 2 }); // add a little padding
		}
		worksheet['!cols'] = colWidths;
	};

	// Define columns and order for the main sheet
	let mainData = {
		'Id': assessment.id || '',
		'School': assessment.school || '',
		'District': assessment.district || '',
		'Reporting Year': assessment.reportingYear || '',
		'Status': assessment.status || '',
		'Date Created': formatDateAsString(assessment.dateCreated),
		'Date Modified': formatDateAsString(assessment.dateModified),
		'Date Exported': formatDateAsString(assessment.dateExported),
		'Last Modified By': assessment.lastModifiedBy || '',
		'Assessors': (assessment.assessors || []).join(', '),
		'Considerations Established': (assessment.considerationsEstablished || []).join(', '),
		'Continuum Version': assessment.continuumVersion || '',
		'Schema Version': assessment.schemaVersion || '',
	};

	// Define columns and order for the change log sheet
	let changeLogData = (assessment.changeLog || []).map(log => ({
		'Date': formatDateAsString(log.date) || '',
		'Message': log.message || '',
		'Assessor': log.assessor || '',
	}));

	let workbook = XLSX.utils.book_new();
	let mainSheet = XLSX.utils.json_to_sheet([mainData]);
	let logSheet = XLSX.utils.json_to_sheet(changeLogData.length ? changeLogData : [{ Note: 'No change log' }]);

	// Auto-fit columns
	autoFitColumns(mainSheet);
	autoFitColumns(logSheet);

	XLSX.utils.book_append_sheet(workbook, mainSheet, 'Assessment Info');
	XLSX.utils.book_append_sheet(workbook, logSheet, 'Change Log');

	// Filename with date
	let fileDate = formatDateAsString(assessment.dateExported || new Date(), false);
	let filename = `assessment_${toKebabCase(assessment.school)}_${assessment.reportingYear}_export-${fileDate}`;


	if (format === 'csv') {
		// Convert sheets to csv and combine
		let csv = XLSX.utils.sheet_to_csv(mainSheet) + '\n\n' + XLSX.utils.sheet_to_csv(logSheet);
		let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		let link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `${filename}.csv`;
		link.click();
	} else {
		// Save as Excel
		XLSX.writeFile(workbook, `${filename}.xlsx`);
	}

}

/**
 * Parse a CSV or Excel file and convert it back into an assessment object
 * @param {File} file - File uploaded by the user
 * @returns {Promise<Object>} Parsed assessment object
 */
let importAssessment = (file) => {

	return new Promise((resolve, reject) => {
		let reader = new FileReader();

		reader.onload = (event) => {
			let data = event.target.result;
			let workbook = XLSX.read(data, { type: 'binary' });

			// Read main sheet (assumes first sheet is main data)
			let mainSheetName = workbook.SheetNames[0];
			let mainSheet = workbook.Sheets[mainSheetName];
			let mainDataArray = XLSX.utils.sheet_to_json(mainSheet, { defval: '' });

			if (!mainDataArray || !mainDataArray.length) {
				return reject('No main data found in the file');
			}

			let mainRow = mainDataArray[0]; // Only one row expected
			let assessment = {
				id: mainRow['Id'] || '',
				school: mainRow['School'] || '',
				district: mainRow['District'] || '',
				reportingYear: mainRow['Reporting Year'] || '',
				status: mainRow['Status'] || '',
				continuumVersion: mainRow['Continuum Version'] || '',
				dateCreated: mainRow['Date Created'] ? normalizeImportedDate(mainRow['Date Created']) : null,
				dateModified: mainRow['Date Modified'] ? normalizeImportedDate(mainRow['Date Modified']) : null,
				dateExported: mainRow['Date Exported'] ? normalizeImportedDate(mainRow['Date Exported']) : null,
				lastModifiedBy: mainRow['Last Modified By'] || '',
				assessors: mainRow['Assessors'] ? mainRow['Assessors'].split(',').map(s => s.trim()) : [],
				considerationsEstablished: mainRow['Considerations Established'] ? mainRow['Considerations Established'].split(',').map(s => s.trim()) : [],
				schemaVersion: mainRow['Schema Version'] || '',
				changeLog: []
			};

			// Read change log sheet (assumes second sheet)
			if (workbook.SheetNames.length > 1) {
				let logSheetName = workbook.SheetNames[1];
				let logSheet = workbook.Sheets[logSheetName];
				let logData = XLSX.utils.sheet_to_json(logSheet, { defval: '' });

				assessment.changeLog = logData.map(log => ({
					date: log['Date'] ? normalizeImportedDate(log['Date']) : null,
					assessor: log['Assessor'] || '',
					message: log['Message'] || ''
				}));
			}

			resolve(assessment);
		};

		reader.onerror = (err) => {
			reject(err);
		};

		reader.readAsArrayBuffer(file);

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
	return LZString.compressToBase64(JSON.stringify(data));
}

let decompressData = (data) => {
	return JSON.parse(LZString.decompressFromBase64(data));
}


//
// Methods (Storage and DOM Updates)
//

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
 * Subscribe to data updates
 * @param {(data: typeof data) => void} fn
 */
let subscribe = (fn) => {
	if (!subscribers.includes(fn)) {
		subscribers.push(fn);
		fn(structuredClone(data));
	}
};


//
// Inits
//

let userDataStore = (() => {

	let considerationCountPromise = null;

	let init = () => {
		// console.log('Initiating User Data Store');
		considerationCountPromise = fetch('/consideration-count.json')
			.then(res => res.json())
			.catch(err => {
				console.error('Failed to fetch consideration count:', err);
				return null;
			});
		save();
		notify();
	}

	let getConsiderationCount = () => considerationCountPromise;

	return { init, getConsiderationCount };

})();

userDataStore.init();
document.addEventListener("astro:after-swap", userDataStore.init);


//
// Exports
//

export {
	checkForChanges,
	compressData,
	decompressData,
	findAssessmentConflicts,
	getActiveAssessmentData,
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
	setAssessment,
	setImportConflictData,
	deleteAssessment,
	exportAssessment,
	importAssessment,
	updateChangeLog,
	updateContinuumCompletion,
	generateContinuumCompletion,
	deleteImportConflictData
};