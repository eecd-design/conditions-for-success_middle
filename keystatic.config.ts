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

    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        pubDate: fields.datetime({ label: 'Published Date' }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),

    indicators: collection({
      label: 'Indicators',
      columns: ['id', 'title'],
      slugField: 'title',
      schema: {
        id: fields.integer({
          label: 'Indicator ID',
          validation: {
            min: 1,
            max: 7,
          },
        }),
        title: fields.slug({
          name: {
            label: 'Title',
            description: 'The title of the indicator',
          },
          slug: {
            label: 'Numbered slug',
            description: 'This will define the file/folder name for this entry'
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
      columns: ['indicatorID', 'subindicatorID', 'title'],
      slugField: 'title',
      schema: {
        indicatorID: fields.integer({
          label: 'Indicator ID',
          validation: {
            min: 1,
            max: 7,
          },
        }),
        subindicatorID: fields.integer({
          label: 'Subindicator ID',
          validation: {
            min: 1,
            max: 12,
          },
        }),
        title: fields.slug({
          name: {
            label: 'Title',
            description: 'The title of the subindicator',
          },
        }),
        description: fields.markdoc({
          label: 'Description',
        })
      }
    }),

    focusItems: collection({
      label: 'Focus Items',
      columns: ['indicatorID', 'subindicatorID', 'focusItemID'],
      slugField: 'title',
      schema: {
        indicatorID: fields.integer({
          label: 'Indicator ID',
          validation: {
            min: 1,
            max: 12,
          },
        }),
        subindicatorID: fields.integer({
          label: 'Subindicator ID',
          validation: {
            min: 1,
            max: 12,
          },
        }),
        focusItemID: fields.integer({
          label: 'Focus Item ID',
          validation: {
            min: 1,
            max: 12,
          },
        }),
        phase: fields.select({
          label: 'Phase',
          options: [
            { label: 'Initiating', value: 'initiating' },
            { label: 'Developing', value: 'developing' },
            { label: 'Yellow', value: 'yellow' },
            { label: 'Sustaining', value: 'sustaining' },
          ],
          defaultValue: 'initiating',
        }),
        title: fields.slug({
          name: {
            label: 'Title',
            description: 'The title of the focus item',
          },
        }),
        description: fields.markdoc({
          label: 'Description',
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
        // linkedFocusItems: fields.array({
        //   fields.relationship({
        //     label: 
        //   })
        // })

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