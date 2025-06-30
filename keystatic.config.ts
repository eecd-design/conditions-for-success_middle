// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
	storage: {
		kind: 'github',
		repo: {
			owner: 'eecd-design',
			name: 'conditions-for-success_middle'
		}
	},
	ui: {
		brand: {
			name: 'NB Middle School Conditions for Success'
		}
	},
	collections: {

		indicators: collection({
			label: 'Indicators',
			columns: ['tag', 'title'],
			slugField: 'title',
			path: 'src/content/indicators/*/',
			schema: {
				tag: fields.text({
					label: 'Indicator Tag',
					validation: {
						isRequired: true,
						pattern: {
							regex: /^\d$/,
							message: 'Must match the following pattern: #'
						},
						length: {
							min: 1,
							max: 1,
						}
					},
				}),
				title: fields.slug({
					name: {
						label: 'Name',
						description: 'The name of the indicator',
					},
					slug: {
						label: 'Numbered slug',
						description: 'This will define the file/folder name for this entry',
						validation: {
							length: {
								max: 50,
							}
						},
					}
				}),
				colour: fields.select({
					label: 'Indicator Colour',
					options: [
						{ label: 'Red', value: 'red' },
						{ label: 'Orange', value: 'orange' },
						{ label: 'Yellow', value: 'yellow' },
						{ label: 'Green', value: 'green' },
						{ label: 'Cyan', value: 'cyan' },
						{ label: 'Blue', value: 'blue' },
						{ label: 'Purple', value: 'purple' },
					],
					defaultValue: 'red',
				}),
				description: fields.mdx({
					label: 'Description',
					extension: 'md'
				})
			}
		}),

		components: collection({
			label: 'Components',
			columns: ['tag', 'title'],
			slugField: 'title',
			path: 'src/content/components/*/',
			schema: {
				indicator: fields.relationship({
					label: 'Parent Indicator',
					collection: 'indicators',
				}),
				tag: fields.text({
					label: 'Component Tag',
					validation: {
						isRequired: true,
						pattern: {
							regex: /^\d\.\d$/,
							message: 'Must match the following pattern: #.#'
						},
						length: {
							min: 3,
							max: 3,
						}
					},
				}),
				title: fields.slug({
					name: {
						label: 'Name',
						description: 'The name of the component',
					},
					slug: {
						label: 'Numbered slug',
						description: 'This will define the file/folder name for this entry',
						validation: {
							length: {
								max: 50,
							}
						},
					}
				}),
				reflectionQuestion: fields.mdx({
					label: 'Reflection Question',
					extension: 'md',
				}),
				goal: fields.mdx({
					label: 'Goal',
					extension: 'md',
				}),
				initiating: fields.object({
					focus: fields.mdx({
						label: 'Focus',
						extension: 'md',
					}),
					considerations: fields.array(
						fields.object({
							tag: fields.text({
								label: 'Consideration Tag',
								validation: {
									isRequired: true,
									pattern: {
										regex: /^\d\.\d\.\d$/,
										message: 'Must match the following pattern: #.#.#'
									},
									length: {
										min: 5,
										max: 5,
									}
								}
							}),
							description: fields.text({
								label: 'Description',
								multiline: true,
							}),
							compass: fields.checkbox({
								label: 'Compass',
								description: 'Flag considerations that respond to students who have not demonstrated literacy and numeracy proficiency.'
							})
						}),
						{
							label: 'Considerations',
							itemLabel: (props) => props.fields.tag.value,
						}
					),
				},
					{
						label: 'Phase: Initiating',
					}),
				implementing: fields.object({
					focus: fields.mdx({
						label: 'Focus',
						extension: 'md',
					}),
					considerations: fields.array(
						fields.object({
							tag: fields.text({
								label: 'Consideration Tag',
								validation: {
									isRequired: true,
									pattern: {
										regex: /^\d\.\d\.\d$/,
										message: 'Must match the following pattern: #.#.#'
									},
									length: {
										min: 5,
										max: 5,
									}
								}
							}),
							description: fields.text({
								label: 'Description',
								multiline: true,
							}),
							compass: fields.checkbox({
								label: 'Compass',
								description: 'Flag considerations that respond to students who have not demonstrated literacy and numeracy proficiency.'
							})
						}),
						{
							label: 'Considerations',
							itemLabel: (props) => props.fields.tag.value,
						}
					),
				},
					{
						label: 'Phase: Implementing',
					})
			}
		}),

		resources: collection({
			label: 'Resources',
			columns: [],
			slugField: 'title',
			path: 'src/content/resources/*/',
			schema: {
				title: fields.slug({
					name: {
						label: 'Name',
						description: 'The name of the resource',
					},
					slug: {
						label: 'Slug',
						description: 'This will define the file/folder name for this entry',
						validation: {
							length: {
								max: 50,
							}
						},
					}
				}),
				external: fields.conditional(
					// Condition
					fields.checkbox({
						label: 'External resource',
						description: 'Is the resource hosted on an external website?',
						defaultValue: false,
					}),
					// Conditional Fields
					{
						false: fields.object({
							category: fields.conditional(
								// Condition
								fields.select({
									label: 'Category',
									options: [
										{ label: 'Document', value: 'document' },
										{ label: 'Video', value: 'video' },
										{ label: 'Presentation', value: 'presentation' },
										{ label: 'Audio', value: 'audio' },
									],
									defaultValue: 'video',
								}),
								// Conditional Fields
								{
									document: fields.object({
										existing: fields.conditional(
											// Condition
											fields.checkbox({
												label: 'Existing resource',
												description: 'Is the resource already uploaded to the website?',
												defaultValue: false,
											}),
											// Conditional Fields
											{
												false: fields.object({
													file: fields.file({
														label: 'File Upload',
														description: 'Upload the resource to the website',
														directory: 'public/resources/documents',
														publicPath: '/resources/documents'
													}),
												}),
												true: fields.object({
													filePath: fields.pathReference({
														label: 'Resource File Path',
														description: 'Folder path to the file on the website',
														pattern: 'public/resources/documents/*',
													}),
												})
											}
										)
									}),
									video: fields.object({
										existing: fields.conditional(
											// Condition
											fields.checkbox({
												label: 'Existing resource',
												description: 'Is the resource already uploaded to the website?',
												defaultValue: false,
											}),
											// Conditional Fields
											{
												false: fields.object({
													file: fields.file({
														label: 'File Upload',
														description: 'Upload the resource to the website',
														directory: 'public/resources/videos',
														publicPath: '/resources/videos'
													}),
												}),
												true: fields.object({
													filePath: fields.pathReference({
														label: 'Resource File Path',
														description: 'Folder path to the file on the website',
														pattern: 'public/resources/videos/*',
													}),
												})
											}
										)
									}),
									presentation: fields.object({
										existing: fields.conditional(
											// Condition
											fields.checkbox({
												label: 'Existing resource',
												description: 'Is the resource already uploaded to the website?',
												defaultValue: false,
											}),
											// Conditional Fields
											{
												false: fields.object({
													file: fields.file({
														label: 'File Upload',
														description: 'Upload the resource to the website',
														directory: 'public/resources/presentations',
														publicPath: '/resources/presentations'
													}),
												}),
												true: fields.object({
													filePath: fields.pathReference({
														label: 'Resource File Path',
														description: 'Folder path to the file on the website',
														pattern: 'public/resources/presentations/*',
													}),
												})
											}
										)
									}),
									audio: fields.object({
										existing: fields.conditional(
											// Condition
											fields.checkbox({
												label: 'Existing resource',
												description: 'Is the resource already uploaded to the website?',
												defaultValue: false,
											}),
											// Conditional Fields
											{
												false: fields.object({
													file: fields.file({
														label: 'File Upload',
														description: 'Upload the resource to the website',
														directory: 'public/resources/audio',
														publicPath: '/resources/audio'
													}),
												}),
												true: fields.object({
													filePath: fields.pathReference({
														label: 'Resource File Path',
														description: 'Folder path to the file on the website',
														pattern: 'public/resources/audio/*',
													}),
												})
											}
										)
									}),
								}
							)
						}),						
						true: fields.object({
							url: fields.url({
								label: 'Resource URL',
								description: 'URL to the external resource',
							})
						})
					}
				),
				linkedIndicators: fields.array(
					fields.text({
						label: 'Indicator',
						description: 'This resource will appear in the resource sections of every component of the indicator.',
						validation: {
							isRequired: true,
							pattern: {
								regex: /^\d$/,
								message: 'Must match the following pattern: #'
							},
							length: {
								min: 1,
								max: 1,
							}
						}
					}), {
					label: 'Linked Indicators',
					itemLabel: props => props.value ?? 'Select a Indicator',
				}
				),
				linkedComponents: fields.array(
					fields.text({
						label: 'Component',
						description: 'This resource will appear in the resource sections of all four phases of the component.',
						validation: {
							isRequired: true,
							pattern: {
								regex: /^\d\.\d$/,
								message: 'Must match the following pattern: #.#'
							},
							length: {
								min: 3,
								max: 3,
							}
						}
					}), {
					label: 'Linked Components',
					itemLabel: props => props.value ?? 'Select a Component',
				}
				),
				linkedConsiderations: fields.array(
					fields.text({
						label: 'Consideration',
						description: 'This resource will appear in the resource section of the phase associated with the consideration.',
						validation: {
							isRequired: true,
							pattern: {
								regex: /^\d\.\d\.\d$/,
								message: 'Must match the following pattern: #.#.#'
							},
							length: {
								min: 5,
								max: 5,
							}
						}
					}), {
					label: 'Linked Considerations',
					itemLabel: props => props.value ?? 'Select a Consideration',
				}
				),
			}
		})
	},
});