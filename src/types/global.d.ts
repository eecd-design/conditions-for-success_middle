declare global {
	type UserData = {
		uiPreferences: Preferences;
		uiState: State;
		assessments: Assessment[];
	};

	type Preferences = {
		reportIncludedIndicators: string[];
		resourcePageSort: string;
		resourcePageLayout: string;
		theme: string;
		schemaVersion: string;
	};

	type State = {
		activeAssessmentId: number;
		announcementSession: AnnoucementSession;
		continuumVersion: string;
		latestResourceTimestamp: number;
		lastModifiedPage: Page;
		lastVisitedPage: Page;
		mode: string;
		onboardingCompleted: boolean;
		schemaVersion: string;
	};

	type Assessment = {
		activeAssessor: string;
		assessors: string[];
		changeLog: ChangeLogItem[];
		continuumCompletion: {};
		considerationsEstablished: string[];
		continuumVersion: string;
		dateCompleted: number;
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
		schemaVersion: string;
	};

	type ChangeLogItem = {
		assessor: string;
		date: number;
		message: string;
	};

	type Page = {
		path: string;
		title: string;
	};

	type AnnoucementSession = {
		lastSeen: number;
		views: number;
	};
}

export {};
