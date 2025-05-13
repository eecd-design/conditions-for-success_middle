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

  },
});