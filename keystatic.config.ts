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
					description: 'Tag must follow the format: [#]. Example: 1',
					validation: {
						isRequired: true,
						pattern: {
							regex: /^\d$/,
							message: 'Tag must follow the format: [#]. Example: 1'
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
						description: 'The indicator name.',
					},
					slug: {
						label: 'Slug',
						description: `This slug defines the page url for this entry.`,
						validation: {
							length: {
								max: 50,
							}
						},
					}
				}),
				colour: fields.select({
					label: 'Indicator Colour',
					description: 'This selection customizes the colour palette of the indicator page UI elements.',
					options: [
						{ label: 'Red', value: 'red' },
						{ label: 'Orange', value: 'orange' },
						{ label: 'Yellow', value: 'yellow' },
						{ label: 'Green', value: 'green' },
						{ label: 'Teal', value: 'teal' },
						{ label: 'Blue', value: 'blue' },
						{ label: 'Purple', value: 'purple' },
					],
					defaultValue: 'red',
				}),
				description: fields.mdx({
					label: 'Description',
					description: 'This content will appear below the page title.',
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
					description: 'Tag must follow the format: [#.#]. Example: 1.1',
					validation: {
						isRequired: true,
						pattern: {
							regex: /^\d\.\d$/,
							message: 'Tag must follow the format: [#.#]. Example: 1.1'
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
						description: 'The component name.',
					},
					slug: {
						label: 'Slug',
						description: `This slug defines the folder and jump link name for this entry. Abbreviate the component name as necessary.`,
						validation: {
							length: {
								max: 50,
							}
						},
					}
				}),
				description: fields.mdx({
					label: 'Description',
					description: `This description defines terms used in the component title and appears directly below the component heading.`,
					extension: 'md',
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
								description: 'Tag must follow the format: [#.#.#]. Example: 1.1.1',
								validation: {
									isRequired: true,
									pattern: {
										regex: /^\d\.\d\.\d{1,2}$/,
										message: 'Tag must follow the format: [#.#.#]. Example: 1.1.1'
									},
									length: {
										min: 5,
										max: 6,
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
							}),
							categories: fields.array(
								fields.text({
									label: 'Category',

								}),
							{
								label: 'Categories',
								itemLabel: (props) => props.value,
								description: 'These categories will appear next to the consideration tag with a similar styling.',
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
								description: 'Tag must follow the format: [#.#.#]. Example: 1.1.1',
								validation: {
									isRequired: true,
									pattern: {
										regex: /^\d\.\d\.\d{1,2}$/,
										message: 'Tag must follow the format: [#.#.#]. Example: 1.1.1'
									},
									length: {
										min: 5,
										max: 6,
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
							}),
							categories: fields.array(
								fields.text({
									label: 'Category',

								}),
							{
								label: 'Categories',
								itemLabel: (props) => props.value,
								description: 'These categories will appear next to the consideration tag with a similar styling.',
							}),							
						}),
						{
							label: 'Considerations',
							itemLabel: (props) => props.fields.tag.value,
						}
					),
				},
				{
					label: 'Phase: Implementing',
				}),
				developing: fields.object({
					focus: fields.mdx({
						label: 'Focus',
						extension: 'md',
					}),
					considerations: fields.array(
						fields.object({
							tag: fields.text({
								label: 'Consideration Tag',
								description: 'Tag must follow the format: [#.#.#]. Example: 1.1.1',
								validation: {
									isRequired: true,
									pattern: {
										regex: /^\d\.\d\.\d{1,2}$/,
										message: 'Tag must follow the format: [#.#.#]. Example: 1.1.1'
									},
									length: {
										min: 5,
										max: 6,
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
							}),
							categories: fields.array(
								fields.text({
									label: 'Category',

								}),
							{
								label: 'Categories',
								itemLabel: (props) => props.value,
								description: 'These categories will appear next to the consideration tag with a similar styling.',
							}),							
						}),
						{
							label: 'Considerations',
							itemLabel: (props) => props.fields.tag.value,
						}
					),
				},
				{
					label: 'Phase: Developing',
				}),
				sustaining: fields.object({
					focus: fields.mdx({
						label: 'Focus',
						extension: 'md',
					}),
					considerations: fields.array(
						fields.object({
							tag: fields.text({
								label: 'Consideration Tag',
								description: 'Tag must follow the format: [#.#.#]. Example: 1.1.1',
								validation: {
									isRequired: true,
									pattern: {
										regex: /^\d\.\d\.\d{1,2}$/,
										message: 'Tag must follow the format: [#.#.#]. Example: 1.1.1'
									},
									length: {
										min: 5,
										max: 6,
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
							}),
							categories: fields.array(
								fields.text({
									label: 'Category',

								}),
							{
								label: 'Categories',
								itemLabel: (props) => props.value,
								description: 'These categories will appear next to the consideration tag with a similar styling.',
							}),							
						}),
						{
							label: 'Considerations',
							itemLabel: (props) => props.fields.tag.value,
						}
					),
				},
				{
					label: 'Phase: Sustaining',
				})
			}
		}),

		resources: collection({
			label: 'Resources',
			columns: ['type', 'title'],
			slugField: 'title',
			path: 'src/content/resources/*/',
			schema: {
				title: fields.slug({
					name: {
						label: 'Name',
						description: 'The resource name as it should appear in hyperlinks throughout the website.',
					},
					slug: {
						label: 'Slug',
						description: `This slug defines the folder name for this entry, it must follow the format: [resource-name]. Abbreviate the resource name as necessary. Example: behaviour-management-pink-envelope`,
						validation: {
							length: {
								max: 50,
							}
						},
					}
				}),
				type: fields.select({
					label: 'Type',
					description: 'The type organizes this resource for search and filtering, and also determines the icon shown in its hyperlink.',
					options: [
						{ label: 'Video', value: 'video' },
						{ label: 'Document', value: 'document' },
						{ label: 'Presentation', value: 'presentation' },
						{ label: 'Audio', value: 'audio' },
						{ label: 'Website', value: 'website' },
					],
					defaultValue: 'video',
				}),
				source: fields.object({
					filePath: fields.pathReference({
						label: 'Internal Resource',
						description: `If the resource is hosted internally, search and select the correct path to the file in the website's /resources folder. Ensure the resource is uploaded to the website prior to completing this tagging entry.`,
						pattern: 'public/resources/**/*',
					}),
					url: fields.url({
						label: 'External Resource',
						description: 'If the resource is hosted externally, provide a valid URL.',
					})
				},
				{
					label: 'Resource Location',
					description: ''
				}),
				linkedIndicators: fields.array(
					fields.text({
						label: 'Indicator',
						description: 'This resource will be included in every component and phase of the linked indicator. Input the indicator tag, following the format: [#]. Example: 1',
						validation: {
							isRequired: true,
							pattern: {
								regex: /^\d$/,
								message: 'Tag must follow the format: [#]. Example: 1'
							},
							length: {
								min: 1,
								max: 1,
							}
						}
					}), {
					label: 'Linked Indicators',
					itemLabel: props => props.value ?? 'Input an indicator tag',
				}
				),
				linkedComponents: fields.array(
					fields.text({
						label: 'Component',
						description: 'This resource will be included in every phase of the linked component. Input the component tag, following the format: [#.#]. Example: 1.1',
						validation: {
							isRequired: true,
							pattern: {
								regex: /^\d\.\d$/,
								message: 'Tag must follow the format: [#.#]. Example: 1.1'
							},
							length: {
								min: 3,
								max: 3,
							}
						}
					}), {
					label: 'Linked Components',
					itemLabel: props => props.value ?? 'Input a component tag',
				}
				),
				linkedConsiderations: fields.array(
					fields.text({
						label: 'Consideration',
						description: 'This resource will be included in the parent phase of the linked consideration. Input the consideration tag, following the format: [#.#.#]. Example: 1.1.1',
						validation: {
							isRequired: true,
							pattern: {
								regex: /^\d\.\d\.\d{1,2}$/,
								message: 'Tag must follow the format: [#.#.#]. Example: 1.1.1'
							},
							length: {
								min: 5,
								max: 6,
							}
						}
					}), {
					label: 'Linked Considerations',
					itemLabel: props => props.value ?? 'Input a consideration tag',
				}
				),
			}
		})
	},
});