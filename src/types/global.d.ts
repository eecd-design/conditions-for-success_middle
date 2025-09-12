declare global {

	type UserData = {
		uiPreferences: Preferences,
		uiState: State,
		assessments: Assessment[]
	}

	type Preferences = {
		schemaVersion: string,
		theme: string,
	}

	type State = {
		schemaVersion: string,
		activeAssessmentId: number;
		lastModifiedPage: Page;
		lastVisitedPage: Page;
		mode: string;
		onboardingCompleted: boolean;
	};
	
	type Assessment = {
		schemaVersion: string,
		activeAssessor: string;
		assessors: string[];
		changeLog: ChangeLogItem[];
		continuumCompletion: {},
		considerationsEstablished: string[];
		continuumVersion: string;
		dateCreated: number;
		dateExported: number;
		dateModified: number;
		district: string;
		id: number;
		lastModifiedBy: string;
		reportingYear: string;
		school: string;
		status: string;
		unexportedChanges: boolean;
	};

	type ChangeLogItem = {
		assessor: string,
		date: number,
		message: string,
	}

	type Page = {
		path: string,
		title: string,
	}

}

export {};