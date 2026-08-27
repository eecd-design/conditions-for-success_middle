let TransformationType = {
	DELETED: 'deleted',
	REORDERED: 'reordered',
	COMBINED: 'combined',
	SPLIT: 'split',
	ADDED: 'added',
};

export let continuumChanges = {
	v2: [
		{
			oldTag: '1.1.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.1.2',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.1.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.1.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.1.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.1.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.1.7',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.1.8',
			edited: false,
			transformation: {
				type: TransformationType.DELETED,
				to: [],
			},
		},
		{
			oldTag: '1.1.9',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['1.1.8'],
			},
		},
		{
			oldTag: '1.2.1',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.2.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.3',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.2.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.5',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.2.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.7',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.9',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.10',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.11',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.12',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.2.13',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.14',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.15',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.16',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.17',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.2.18',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.19',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.2.20',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.7',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.8',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.3.9',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.10',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.11',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.12',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.13',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.14',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.15',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.16',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.17',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.18',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.19',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.3.20',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.4.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.4.2',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.4.3',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.4.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '1.4.5',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['1.4.6'],
			},
		},
		{
			oldTag: '1.4.6',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['1.4.5'],
			},
		},
		{
			oldTag: '1.4.7',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.4.8',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.4.9',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.4.10',
			edited: false,
			transformation: {
				type: TransformationType.DELETED,
				to: [],
			},
		},
		{
			oldTag: '1.4.11',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['1.4.10'],
			},
		},
		{
			oldTag: '1.4.12',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['1.4.11'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['1.4.12'],
			},
		},
		{
			oldTag: '1.5.1',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.5.2',
			edited: true,
			transformation: null,
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['1.5.3'],
			},
		},
		{
			oldTag: '1.5.3',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['1.5.4'],
			},
		},
		{
			oldTag: '1.5.4',
			edited: false,
			transformation: {
				type: TransformationType.COMBINED,
				to: ['1.5.5'],
			},
		},
		{
			oldTag: '1.5.5',
			edited: false,
			transformation: {
				type: TransformationType.COMBINED,
				to: ['1.5.5'],
			},
		},
		{
			oldTag: '1.5.6',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.5.7',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.5.8',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.5.9',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.5.10',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '1.5.11',
			edited: true,
			transformation: null,
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['1.5.12'],
			},
		},
		{
			oldTag: '2.1.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.1.2',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '2.1.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.1.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.1.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.1.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.1.7',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '2.1.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.1.9',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.1.10',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.1.11',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.1.12',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.2.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.2.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.2.3',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '2.2.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.2.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.2.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.2.7',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.2.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.2.9',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.2.10',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.2.11',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '2.2.12',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.7',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.9',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.10',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.11',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.12',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.13',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.14',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.15',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.3.16',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '2.4.1',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.8.1'],
			},
		},
		{
			oldTag: '2.4.2',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.8.2'],
			},
		},
		{
			oldTag: '2.4.3',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.8.3'],
			},
		},
		{
			oldTag: '2.4.4',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.8.4'],
			},
		},
		{
			oldTag: '2.4.5',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.8.5'],
			},
		},
		{
			oldTag: '2.4.6',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.8.6'],
			},
		},
		{
			oldTag: '2.4.7',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.8.7'],
			},
		},
		{
			oldTag: '2.4.8',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.8.8'],
			},
		},
		{
			oldTag: '2.4.9',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.8.9'],
			},
		},
		{
			oldTag: '2.4.10',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.8.10'],
			},
		},
		{
			oldTag: '2.4.11',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.8.11'],
			},
		},
		{
			oldTag: '2.4.12',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.8.12'],
			},
		},
		{
			oldTag: '2.4.13',
			edited: false,
			transformation: {
				type: TransformationType.DELETED,
				to: [],
			},
		},
		{
			oldTag: '2.5.1',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.6.1'],
			},
		},
		{
			oldTag: '2.5.2',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.6.2'],
			},
		},
		{
			oldTag: '2.5.3',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.6.3'],
			},
		},
		{
			oldTag: '2.5.4',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.6.4'],
			},
		},
		{
			oldTag: '2.5.5',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.6.5'],
			},
		},
		{
			oldTag: '2.5.6',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.6.6'],
			},
		},
		{
			oldTag: '2.5.7',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.6.7'],
			},
		},
		{
			oldTag: '2.5.8',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.6.8'],
			},
		},
		{
			oldTag: '2.5.9',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.6.9'],
			},
		},
		{
			oldTag: '2.5.10',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.6.10'],
			},
		},
		{
			oldTag: '2.5.11',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.6.11'],
			},
		},
		{
			oldTag: '2.5.12',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.6.12'],
			},
		},
		{
			oldTag: '2.6.1',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.4.1'],
			},
		},
		{
			oldTag: '2.6.2',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.4.2'],
			},
		},
		{
			oldTag: '2.6.3',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.4.3'],
			},
		},
		{
			oldTag: '2.6.4',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.4.4'],
			},
		},
		{
			oldTag: '2.6.5',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.4.5'],
			},
		},
		{
			oldTag: '2.6.6',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.4.6'],
			},
		},
		{
			oldTag: '2.6.7',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.4.7'],
			},
		},
		{
			oldTag: '2.6.8',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.4.8'],
			},
		},
		{
			oldTag: '2.6.9',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.4.9'],
			},
		},
		{
			oldTag: '2.6.10',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.4.10'],
			},
		},
		{
			oldTag: '2.6.11',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.4.11'],
			},
		},
		{
			oldTag: '2.6.12',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.4.12'],
			},
		},
		{
			oldTag: '2.7.1',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.1'],
			},
		},
		{
			oldTag: '2.7.2',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.2'],
			},
		},
		{
			oldTag: '2.7.3',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.3'],
			},
		},
		{
			oldTag: '2.7.4',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.4'],
			},
		},
		{
			oldTag: '2.7.5',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.5'],
			},
		},
		{
			oldTag: '2.7.6',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.6'],
			},
		},
		{
			oldTag: '2.7.7',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.7'],
			},
		},
		{
			oldTag: '2.7.8',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.8'],
			},
		},
		{
			oldTag: '2.7.9',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.9'],
			},
		},
		{
			oldTag: '2.7.10',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.10'],
			},
		},
		{
			oldTag: '2.7.11',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.11'],
			},
		},
		{
			oldTag: '2.7.12',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.12'],
			},
		},
		{
			oldTag: '2.7.13',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.13'],
			},
		},
		{
			oldTag: '2.7.14',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.14'],
			},
		},
		{
			oldTag: '2.7.15',
			edited: false,
			transformation: {
				type: TransformationType.DELETED,
				to: [],
			},
		},
		{
			oldTag: '2.7.16',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.15'],
			},
		},
		{
			oldTag: '2.7.17',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.5.16'],
			},
		},
		{
			oldTag: '2.8.1',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.1'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['2.7.2'],
			},
		},
		{
			oldTag: '2.8.2',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.3'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['2.7.4'],
			},
		},
		{
			oldTag: '2.8.3',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.5'],
			},
		},
		{
			oldTag: '2.8.4',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.6'],
			},
		},
		{
			oldTag: '2.8.5',
			edited: false,
			transformation: {
				type: TransformationType.DELETED,
				to: [],
			},
		},
		{
			oldTag: '2.8.6',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.7'],
			},
		},
		{
			oldTag: '2.8.7',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.8'],
			},
		},
		{
			oldTag: '2.8.8',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.9'],
			},
		},
		{
			oldTag: '2.8.9',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.10'],
			},
		},
		{
			oldTag: '2.8.10',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.11'],
			},
		},
		{
			oldTag: '2.8.11',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.12'],
			},
		},
		{
			oldTag: '2.8.12',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.13'],
			},
		},
		{
			oldTag: '2.8.13',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.14'],
			},
		},
		{
			oldTag: '2.8.14',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.15'],
			},
		},
		{
			oldTag: '2.8.15',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['2.7.16'],
			},
		},
		{
			oldTag: '2.8.16',
			edited: false,
			transformation: {
				type: TransformationType.DELETED,
				to: [],
			},
		},
		{
			oldTag: '3.1.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.7',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '3.1.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.9',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.10',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.11',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.12',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.13',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.14',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.15',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.1.16',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.2.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.2.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.2.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.2.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.2.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.2.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.2.7',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.2.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.5',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '3.3.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.7',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.9',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.10',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.11',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.12',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.13',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.14',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.15',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.16',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.3.17',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.7',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.9',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.10',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.11',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.12',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.13',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.14',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.15',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.16',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.17',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '3.4.18',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '4.1.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '4.1.2',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '4.1.3',
			edited: false,
			transformation: {
				type: TransformationType.DELETED,
				to: [],
			},
		},
		{
			oldTag: '4.1.4',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.1.3'],
			},
		},
		{
			oldTag: '4.1.5',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.1.4'],
			},
		},
		{
			oldTag: '4.1.6',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.1.5'],
			},
		},
		{
			oldTag: '4.1.7',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.1.6'],
			},
		},
		{
			oldTag: '4.1.8',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.1.7'],
			},
		},
		{
			oldTag: '4.1.9',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.1.8'],
			},
		},
		{
			oldTag: '4.1.10',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.1.9'],
			},
		},
		{
			oldTag: '4.1.11',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.1.10'],
			},
		},
		{
			oldTag: '4.1.12',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.1.11'],
			},
		},
		{
			oldTag: '4.1.13',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.1.12'],
			},
		},
		{
			oldTag: '4.2.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['4.2.2'],
			},
		},
		{
			oldTag: '4.2.2',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.2.3'],
			},
		},
		{
			oldTag: '4.2.3',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.2.4'],
			},
		},
		{
			oldTag: '4.2.4',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.2.5'],
			},
		},
		{
			oldTag: '4.2.5',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.2.6'],
			},
		},
		{
			oldTag: '4.2.6',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.2.7'],
			},
		},
		{
			oldTag: '4.2.7',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['4.2.8'],
			},
		},
		{
			oldTag: '5.1.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '5.1.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['5.1.3'],
			},
		},
		{
			oldTag: '5.1.3',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['5.1.4'],
			},
		},
		{
			oldTag: '5.1.4',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['5.1.5'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['5.1.6'],
			},
		},
		{
			oldTag: '5.1.5',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['5.1.7'],
			},
		},
		{
			oldTag: '5.1.6',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['5.1.8'],
			},
		},
		{
			oldTag: '5.1.7',
			edited: false,
			transformation: {
				type: TransformationType.DELETED,
				to: [],
			},
		},
		{
			oldTag: '5.1.8',
			edited: false,
			transformation: {
				type: TransformationType.DELETED,
				to: [],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['5.1.9'],
			},
		},
		{
			oldTag: '5.1.9',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['5.1.10'],
			},
		},
		{
			oldTag: '5.1.10',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['5.1.11'],
			},
		},
		{
			oldTag: '5.1.11',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['5.1.12'],
			},
		},
		{
			oldTag: '5.2.1',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '5.2.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '5.2.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '5.2.4',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '5.2.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '5.2.6',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '5.2.7',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '5.2.8',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '5.2.9',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '5.2.10',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '5.2.11',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '5.2.12',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '5.2.13',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '5.2.14',
			edited: false,
			transformation: null,
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['5.2.15'],
			},
		},
		{
			oldTag: '6.1.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.1.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.1.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.1.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.1.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.1.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.1.7',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.1.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.2.1',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '6.2.2',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '6.2.3',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '6.2.4',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '6.2.5',
			edited: true,
			transformation: null,
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.2.6'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.2.7'],
			},
		},
		{
			oldTag: '6.2.6',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.8'],
			},
		},
		{
			oldTag: '6.2.7',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.9'],
			},
		},
		{
			oldTag: '6.2.8',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.10'],
			},
		},
		{
			oldTag: '6.2.9',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.11'],
			},
		},
		{
			oldTag: '6.2.10',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.12'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.2.13'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.2.14'],
			},
		},
		{
			oldTag: '6.2.11',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.15'],
			},
		},
		{
			oldTag: '6.2.12',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.16'],
			},
		},
		{
			oldTag: '6.2.13',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.17'],
			},
		},
		{
			oldTag: '6.2.14',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.18'],
			},
		},
		{
			oldTag: '6.2.15',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.19'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.2.20'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.2.21'],
			},
		},
		{
			oldTag: '6.2.16',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.22'],
			},
		},
		{
			oldTag: '6.2.17',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.23'],
			},
		},
		{
			oldTag: '6.2.18',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.24'],
			},
		},
		{
			oldTag: '6.2.19',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.25'],
			},
		},
		{
			oldTag: '6.2.20',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.2.26'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.2.27'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.2.28'],
			},
		},
		{
			oldTag: '6.3.1',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '6.3.2',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '6.3.3',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '6.3.4',
			edited: true,
			transformation: null,
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.3.5'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.3.6'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.3.7'],
			},
		},
		{
			oldTag: '6.3.5',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.3.8'],
			},
		},
		{
			oldTag: '6.3.6',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.3.9'],
			},
		},
		{
			oldTag: '6.3.7',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.3.10'],
			},
		},
		{
			oldTag: '6.3.8',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.3.11'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.3.12'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.3.13'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.3.14'],
			},
		},
		{
			oldTag: '6.3.9',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.3.15'],
			},
		},
		{
			oldTag: '6.3.10',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.3.16'],
			},
		},
		{
			oldTag: '6.3.11',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.3.17'],
			},
		},
		{
			oldTag: '6.3.12',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.3.18'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.3.19'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.3.20'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.3.21'],
			},
		},
		{
			oldTag: '6.3.13',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.3.22'],
			},
		},
		{
			oldTag: '6.3.14',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.3.23'],
			},
		},
		{
			oldTag: '6.3.15',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.3.24'],
			},
		},
		{
			oldTag: '6.3.16',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['6.3.25'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.3.26'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.3.27'],
			},
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['6.3.28'],
			},
		},
		{
			oldTag: '6.4.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.7',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.9',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.10',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.11',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.12',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.13',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.14',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.15',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '6.4.16',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.17',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.18',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.19',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '6.4.20',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.1.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.1.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.1.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.1.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.1.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.1.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.1.7',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.1.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.2.1',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.2.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.2.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.2.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.2.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.2.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.2.7',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.2.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.3.1',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '7.3.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.3.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.3.4',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '7.3.5',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.3.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.3.7',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '7.3.8',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.3.9',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.3.10',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '7.3.11',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.3.12',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.1',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '7.4.2',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.3',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.4',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.5',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '7.4.6',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.7',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.8',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '7.4.9',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.10',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.11',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.12',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '7.4.13',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.14',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.15',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.16',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.17',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.18',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.4.19',
			edited: true,
			transformation: null,
		},
		{
			oldTag: '7.4.20',
			edited: false,
			transformation: null,
		},
		{
			oldTag: '7.5.1',
			edited: true,
			transformation: null,
		},
		{
			oldTag: null,
			edited: false,
			transformation: {
				type: TransformationType.ADDED,
				to: ['7.5.2'],
			},
		},
		{
			oldTag: '7.5.2',
			edited: true,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['7.5.3'],
			},
		},
		{
			oldTag: '7.5.3',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['7.5.4'],
			},
		},
		{
			oldTag: '7.5.4',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['7.5.5'],
			},
		},
		{
			oldTag: '7.5.5',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['7.5.6'],
			},
		},
		{
			oldTag: '7.5.6',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['7.5.7'],
			},
		},
		{
			oldTag: '7.5.7',
			edited: false,
			transformation: {
				type: TransformationType.REORDERED,
				to: ['7.5.8'],
			},
		},
	],
};
