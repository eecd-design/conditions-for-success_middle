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
							title: fields.text({
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
							title: fields.text({
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
							title: fields.text({
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
							title: fields.text({
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
						label: 'Resource Title',
						description: 'Enter the title as it should appear on the website and in links.',
					},
					slug: {
						label: 'Resource Filename',
						description: `Use a short, lowercase, hyphen-separated name (e.g., behaviour-management-pink-envelope). Max 50 characters.`,
						validation: {
							length: {
								max: 50,
							}
						},
					}
				}),
				dateAdded: fields.date({
					label: 'Date Added',
					description: 'Defaults to today’s date.',
					defaultValue: { kind: "today" },
				}),
				type: fields.select({
					label: 'Resource Type',
					description: 'Determines the icon shown in links and allows filtering on the resource page.',
					options: [
						{ label: 'Video', value: 'video' },
						{ label: 'Document', value: 'document' },
						{ label: 'Presentation', value: 'presentation' },
						{ label: 'Audio', value: 'audio' },
						{ label: 'Website', value: 'website' },
					],
					defaultValue: 'video',
				}),
				description: fields.text({
					label: 'Resource Description',
					description: 'Optional short summary or details about the resource.',
					multiline: true,
				}),
				topics: fields.multiselect({
					label: 'Topics',
					description: 'Select topics to categorize the resource for filtering.',
					options: [
						{ label: 'Test', value: 'test' }
					],
				}),
				external: fields.conditional(
					fields.checkbox({ 
						label: 'External Resource', 
						description: 'Check if this resource is hosted on an external website.', 
						defaultValue: false 
					}),
					{
						true: fields.object({
							url: fields.url({ 
								label: 'External URL',
								description: 'Provide a full, valid URL to the resource.', 
							}),
						}),
						false: fields.object({
							fileType: fields.text({
								label: 'File Type',
								description: "Specify only if different from default: video (.mp4), document (.pdf), presentation (.pdf), audio (.mp3).",
							}),
						}),
					}
				),
				linkedIndicators: fields.array(
					fields.text({
						label: 'Indicator Tag',
						description: 'Use [#] format (e.g., 1). This adds the resource to all components and considerations of the indicator.',
						validation: {
							isRequired: true,
							pattern: {
								regex: /^\d$/,
								message: 'Must match [#] format (e.g., 1)'
							},
							length: {
								min: 1,
								max: 1,
							}
						}
					}), {
						label: 'Linked Indicators',
						itemLabel: props => props.value ?? 'Add indicator tag',
					}
				),
				linkedComponents: fields.array(
					fields.text({
						label: 'Component Tag',
						description: 'Use [#.#] format (e.g., 1.1). This adds the resource to all considerations of the component.',
						validation: {
							isRequired: true,
							pattern: {
								regex: /^\d\.\d$/,
								message: 'Must match [#.#] format (e.g., 1.1)'
							},
							length: {
								min: 3,
								max: 3,
							}
						}
					}), {
						label: 'Linked Components',
						itemLabel: props => props.value ?? 'Add component tag',
					}
				),
				linkedConsiderations: fields.array(
					fields.text({
						label: 'Consideration Tag',
						description: 'Use [#.#.#] format (e.g., 1.1.1). This adds the resource to the consideration.',
						validation: {
							isRequired: true,
							pattern: {
								regex: /^\d\.\d\.\d{1,2}$/,
								message: 'Must match [#.#.#] format (e.g., 1.1.1)'
							},
							length: {
								min: 5,
								max: 6,
							}
						}
					}), {
						label: 'Linked Considerations',
						itemLabel: props => props.value ?? 'Add consideration tag',
					}
				),
			}
		})
	},
});