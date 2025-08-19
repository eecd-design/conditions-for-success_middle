// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

// 3. Define your collection(s)
const posts = defineCollection({
	loader: glob({ pattern: "**/*.mdoc", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		// pubDate: z.date(),
		// description: z.string(),
		// author: z.string(),
	})
});

const indicators = defineCollection({
	loader: glob({ pattern: "**/*.yaml", base: "./src/content/indicators" }),
	schema: z.object({
        tag: z.string(),
		title: z.string(),
		colour: z.string(),
	})
});

const components = defineCollection({
	loader: glob({ pattern: "**/*.yaml", base: "./src/content/components" }),
	schema: z.object({
        indicator: z.string(),
        tag: z.string(),
		title: z.string(),
        initiating: z.object({
            considerations: z.array(
                z.object({
                    tag: z.string(),
                    description: z.string(),
                    compass: z.boolean(),
					categories: z.array(z.string()),
                })
            )
        }),
        implementing: z.object({
            considerations: z.array(
                z.object({
                    tag: z.string(),
                    description: z.string(),
                    compass: z.boolean(),
					categories: z.array(z.string()),
                })
            )
        }),
        developing: z.object({
            considerations: z.array(
                z.object({
                    tag: z.string(),
                    description: z.string(),
                    compass: z.boolean(),
					categories: z.array(z.string()),
                })
            )
        }),
        sustaining: z.object({
            considerations: z.array(
                z.object({
                    tag: z.string(),
                    description: z.string(),
                    compass: z.boolean(),
					categories: z.array(z.string()),
                })
            )
        }),
	})
});

const resources = defineCollection({
	loader: glob({ pattern: "**/*.yaml", base: "./src/content/resources" }),
	schema: z.object({
		title: z.string(),
		type: z.string(),
		source: z.object({
			filePath: z.optional(z.string()),
			url: z.optional(z.string()),
		}),
		linkedIndicators: z.array(z.string()),
		linkedComponents: z.array(z.string()),
		linkedConsiderations: z.array(z.string()),
	})
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { posts, indicators, components, resources };