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
      columns: ['id', 'title'],
      slugField: 'title',
      path: 'src/content/indicators/*',
      schema: {
        id: fields.text({
          label: 'Indicator ID',
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
            // generate: (name, id) => { `${id}-${name}` },
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
        description: fields.markdoc({
          label: 'Description',
        })
      }
    }),

    components: collection({
      label: 'Components',
      columns: ['id', 'title'],
      slugField: 'title',
      path: 'src/content/components/*',
      schema: {
        indicator: fields.relationship({
          label: 'Parent Indicator',
          collection: 'indicators',
        }),
        id: fields.text({
          label: 'Component ID',
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
        }),
        reflectionQuestion: fields.text({
          label: 'Reflection Question',
        }),
        goal: fields.markdoc.inline({
          label: 'Goal',
        }),
        intiating: fields.object({
          focus: fields.text({
            label: 'Focus',
          }),
          considerations: fields.array(
            fields.object({
              id: fields.text({
                label: 'Consideration ID',
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
              itemLabel: (props) => props.fields.id.value,
            }
          ),
        },
        { 
          label: 'Phase: Initiating',
        })
      }
    }),

    resources: collection({
      label: 'Resources',
      columns: [],
      slugField: 'title',
      path: 'src/content/resources/*',
      schema: {
        title: fields.slug({
          name: {
            label: 'Name',
            description: 'The name of the resource',
          }
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Document', value: 'document' },
            { label: 'Video', value: 'video' },
            { label: 'Website', value: 'website' },
            { label: 'Presentation', value: 'presentation' },
            { label: 'Audio', value: 'audio' },
          ],
          defaultValue: 'video',
        }),
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
                min: 5,
                max: 5,
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
                min: 5,
                max: 5,
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
        internal: fields.conditional(
          // Condition
          fields.checkbox({
            label: 'Internal resource',
            description: 'Is the resource hosted on this website?',
            defaultValue: true,
          }),
          // Conditional Fields
          {
            true: fields.object({
              filePath: fields.pathReference({
                label: 'Resource File Path',
                description: 'A reference to the file in the `public` folder',
                pattern: 'public/**/*',
              })
            }),
            false: fields.object({
              url: fields.url({
                label: 'Resource URL',
                description: 'URL to the external resource',
              })
            })
          }
        )
      }
    })

  },
});