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
            label: 'Title',
            description: 'The title of the indicator',
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
            { label: 'Blue', value: 'blue' },
            { label: 'Purple', value: 'purple' },
            { label: 'Pink', value: 'pink' },
          ],
          defaultValue: 'red',
        }),
        description: fields.markdoc({
          label: 'Description',
        })
      }
    }),

    subindicators: collection({
      label: 'Subindicators',
      columns: ['subindicatorID', 'title'],
      slugField: 'title',
      schema: {
        indicator: fields.relationship({
          label: 'Parent Indicator',
          collection: 'indicators',
        }),
        subindicatorID: fields.text({
          label: 'Subindicator ID',
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
            label: 'Title',
            description: 'The title of the subindicator',
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
          focusItems: fields.array(
            fields.object({
              id: fields.text({
                label: 'ID',
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
                description: 'Flag focus items that respond to students who have not demonstrated literacy and numeracy proficiency.'
              })
            }),
            {
              label: 'Focus Items',
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
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            description: 'The title of the resource',
          }
        }),
        type: fields.select({
          label: 'Resource Type',
          options: [
            { label: 'Document', value: 'document' },
            { label: 'Video', value: 'video' },
            { label: 'Website', value: 'website' },
            { label: 'Presentation', value: 'presentation' },
            { label: 'Audio', value: 'audio' },
          ],
          defaultValue: 'video',
        }),
        linkedFocusItems: fields.array(
          fields.text({
            label: 'Focus Item',
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
            label: 'Linked Focus Items',
            itemLabel: props => props.value ?? 'Select a Focus Item',
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