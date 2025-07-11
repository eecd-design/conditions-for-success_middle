//
// Variables
//







//
// Methods
//


/**
 * Update an existing local storage item
 * @param  {String} id The name of the local storage item
 * @param  {Object} data The data to update
 * @param  {String} updateType The type of update to perform
 * @param  {Number} max The maximum number of data items per id
 */
let updateStorage = ({id, data, updateType = 'add', max = null}) => {

    console.log('Updating storage', id, updateType, max);

    // Get item from local storage and parse
    let storedItem = localStorage.getItem(id);
    storedItem = JSON.parse(storedItem);

    if (storedItem){

        // If update type is toggle
        if (updateType === 'toggle'){

            storedItem = storedItem === false ? true : false;

        }
        
    } else {
    
        // Otherwise, add data to item
        storedItem.push(data);
    
    }

    // Check if item is not empty
    if (storedItem.length > 0){

        // If so, stringify and store in local storage
        storedItem = JSON.stringify(storedItem);
        localStorage.setItem(id, storedItem);

    } else {

        // Otherwise, remove item from local storage
        localStorage.removeItem(id);
    
    }
}

/**
 * Set a local storage item
 * @param  {String} id The name of the local storage item
 * @param  {Object} data The data to set
 */
let setStorage = ({id, data}) => {

    // Stringify and store in local storage
    localStorage.setItem(id, JSON.stringify(data));

}

let createUserData = ({currentPage}) => {

	let data = {
		uiPreferences: {
			theme: 'light',
		},
		uiState: {
			mode: 'reading',
			onboardingCompleted: false,
			lastVisitedPage: currentPage ?? null,
			lastModifiedPage: null,
			activeAssessment: null,
			unsavedChanges: false,
			lastSavedAt: null,
			changeHistory: [], 
		},
		assessments: [],
	}

	return data;

}

let createAssessmentData = ({lastId, district, school, year, assessors}) => {

	let data = {
		id: lastId ? lastId + 1 : 1,
		status: 'In Progress',
		continuumVersion: '1.0',
		dateCreated: Date.now(),
		dateModified: Date.now(),
		lastModifiedBy: null,
		reportingYear: year,
		district: district,
		school: school,
		assessors: assessors,
		considerationsEstablished: [],
		componentPhase: {},
	}

	return data;

}



let updateTheme = (theme) => {
	
	if (theme !== 'dark' && theme !== 'light') return;

	// Get the html root
	let html = document.documentElement;

	// Update the theme
	html.setAttribute('data-theme', theme);

}

let updateMode = (mode) => {

	if (mode !== 'assessment' && mode !== 'reading') return;

	// Get the html root
	let main = document.querySelector('main');

	// Update the theme
	main.setAttribute('data-mode', mode);

}

let updateHome = (state) => {

	let { lastVisitedPage, lastModifiedPage } = state;

	// If not viewing the home page, bail
	if (window.location.pathname !== '/' ) return;
	
	if (!lastVisitedPage && !lastModifiedPage) return;

	// Get the dynamic widget and update...


}

let updateToolbar = (state, assessments) => {

	let { activeAssessment, unsavedChanges, lastSavedAt } = state;

	// If not viewing a big seven page, bail
	if (!window.location.pathname.includes('/big-seven')) return;

	if (!activeAssessment && !unsavedChanges && !lastSavedAt) return;

	// Get the toolbar
	let toolbar = document.querySelector('.assessment-controls');

	let activeAssessmentTitle = toolbar?.querySelector('.active-assessment-title');
	let saveStatus = toolbar?.querySelector('.save-status');

	if (activeAssessment) {

		// Get the assessment info
		let activeAssessmentInfo = findObjectByKey(assessments, 'id', activeAssessment);

		if (!activeAssessmentInfo) return;

		let string = `Editing "${activeAssessmentInfo.reportingYear} ${activeAssessmentInfo.school}"`

		activeAssessmentTitle.textContent = string;

	}

	if (unsavedChanges) {

		if (lastSavedAt) {

			// Compare current date with last saved date

		}

		let string = `Unsaved Changes`;

		saveStatus.textContent = string;

	}

}

let updateDialogs = ({state, assessments, changeType}) => {

	// createAssessment, editAssessmentDetails, considerationChecked, saveAssessment, openAssessment, 

	let viewDialog = document.querySelector('#view-assessment');
	let openDialog = document.querySelector('#open-assessment');
	let saveDialog = document.querySelector('#save-assessment');

	let updateViewDialog = () => {

		let detailFields = {
			'dd.district': 'district',
			'dd.school': 'school',
			'dd.reporting-year': 'reportingYear',
			'dd.assessors': 'assessors',
			'.meta .status': 'status',
			'.meta .date-created .slot': 'dateCreated',
			'.meta .date-modified .slot': 'dateModified'
		};

		let formFields = {
			'select.district': 'district',
			'select.school': 'school',
			'input.reporting-year': 'reportingYear',
			'.assessor-list': 'assessors',
		}

		let activeAssessment = findObjectByKey(assessments, 'id', state.activeAssessment);

		for (let [selector, key] of Object.entries(detailFields)) {
			let element = viewDialog.querySelector(selector);
			if (element) {
				let value = activeAssessment[key];
				if (Array.isArray(value)){
					element.textContent = value.join(', ');
				} else if (key.startsWith('date')) {
					element.textContent = dateFormatter.format(new Date(value));
				} else {
					element.textContent = value;
				}
				
			}
		}

		for (let [selector, key] of Object.entries(formFields)) {
			let element = viewDialog.querySelector(selector);
			if (element) {
				let value = activeAssessment[key];
				if (Array.isArray(value)){
					
				} else {
					element.value = value;
				}
			}
		}

	}

	let updateOpenDialog = () => {



	}

	if (changeType === 'initialize') {
		updateViewDialog();
	}

	if (changeType === 'create-assessment') {
		updateViewDialog();
	}

	if (changeType === 'edit-assessment-details') {}
	if (changeType === 'save-assessment') {}
	if (changeType === 'open-assessment') {}
	if (changeType === 'consideration-checked') {



	}

} 

let createAssessment = (target) => {

	let form = target.closest('form');

	// Get the form values
	let district = form.querySelector('select.district').value;
	let school = form.querySelector('select.school').value;
	let year = form.querySelector('input.reporting-year').value;
	let assessors = [];
	let assessorList = form.querySelectorAll('.assessor-list .label');
	for (let item of assessorList) {
		assessors.push(item.textContent.trim());
	}

	// Get the user data
	let userData = JSON.parse(localStorage.getItem('user'));

	// If there is none in storage, create one
	if (!userData) userData = createUserData({
		currentPage: window.location.pathname,
	});

	// Get the most recent id (highest numerical value)
	let lastId;
	if (userData) {
		lastId = findHighestValueByKey(userData.assessments, 'id');
	}

	// Create the assessment data 
	let assessmentData = createAssessmentData({
		lastId: lastId,
		district: district,
		school: school,
		year: year,
		assessors: assessors,
	});

	// Add it to the user data
	userData.assessments.push(assessmentData);

	// Update user data
	userData.uiState.activeAssessment = assessmentData.id;
	userData.uiState.mode = 'assessment';
	userData.uiState.unsavedChanges = true;

	setStorage({
		id: 'user',
		data: userData
	});

	updateMode(userData.uiState.mode);
	updateToolbar(userData.uiState, userData.assessments);
	updateDialogs({
		state: userData.uiState, 
		assessments: userData.assessments,
		changeType: 'create-assessment'
	});

	// Close the dialog
	let dialog = target.closest('dialog');
	dialog.close();

}

let initStorage = () => {

    // Get user data
    let userData = JSON.parse(localStorage.getItem('user'));

	if (userData) {

		updateTheme(userData.uiPreferences.theme);
		updateMode(userData.uiState.mode);
		updateHome(userData.uiState);
		updateToolbar(userData.uiState, userData.assessments);
		updateDialogs({
			state: userData.uiState,
			assessments: userData.assessments,
			changeType: 'initialize',
		})

	} else {

		// Create the user data object
		let userData = createUserData({
			currentPage: window.location.pathname,
		});

		// Store the data in local storage
		setStorage({
			id: 'user',
			data: userData,
		});

	}

}


//
// Inits & Event Listeners
//


initStorage();

let main = document.querySelector('main');

main.addEventListener('click', (event) => {

	let target = event.target;

	if (target.matches('#create-assessment-submit')) {

		createAssessment(target);

	}

	if (target.matches('#update-assessment-submit')) {

		// updateAssessment();

	}

	if (target.matches('#upload-csv-button')){}
	if (target.matches('#paste-url-button')){}
	if (target.matches('button.open-assessment')){}
	if (target.matches('button.save-assessment')){}


});


//
// Inits & Event Listeners
//

document.addEventListener("click", (event) => {
	let target = event.target;

	if (target.matches("button.open-dialog")) {
		console.log(target);
		let targetDialog = target.getAttribute("data-dialog");
		openDialog(targetDialog);
	}

	if (target.matches("button.close-dialog")) {
		closeDialog(target.closest("dialog"));
	}

	if (target.matches("button.add-assessor")) {
		addAssessorToList(target);
	}

	if (target.matches("button.remove-assessor")) {
		removeAssessorFromList(target);
	}
	
});

document.addEventListener("input", (event) => {
	let target = event.target;

	if (target.matches("select.district")) {
		let schoolSelect = target.closest("form").querySelector("select.school");
		let schoolOptionGroups = schoolSelect?.querySelectorAll("optgroup");

		if (target.value !== "") {
			schoolSelect.removeAttribute("disabled");
			console.log(target.value);
			schoolSelect.querySelector(`.${target.value.toLowerCase()}-schools`).removeAttribute('hidden');

		} else {
			schoolSelect.value = '';
			schoolSelect.setAttribute("disabled", "");
			for (let group of schoolOptionGroups) {
				group.setAttribute('hidden', '');
			}

		}
	}
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		let target = event.target;

		if (target.matches("input.assessor")) {
			addAssessorToList(target);
		}
	}
});


let schema = {
	uiPreferences: {
		theme: 'light',
	},
	uiState: {
		assessmentMode: false,
		onboardingCompleted: false,
		lastVisitedPage: null,
		lastModifiedPage: null,
		unsavedChanges: false,
		lastSavedAt: null,
		changeHistory: [], 
	},
	assessments: [
		{
			id: '',
			status: '',
			continuumVersion: '',
			dateCreated: '',
			dateModified: '',
			lastModifiedBy: '',
			reportingYear: '2024',
			district: 'ASD-W',
			school: 'Maple Grove Elementary',
			assessors: [
				'Jane Doe',
				'John Doe',
			],
			considerationsEstablished: [
				'1.1.1',
				'1.1.2',
			],
			componentPhase: {
				'1.1': 'initiating',
				'1.2': 'implementing',
			},
		}
	]
}


