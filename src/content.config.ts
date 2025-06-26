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
        id: z.string(),
		title: z.string(),
		colour: z.string(),
	})
});

const components = defineCollection({
	loader: glob({ pattern: "**/*.yaml", base: "./src/content/components" }),
	schema: z.object({
        indicator: z.string(),
        id: z.string(),
		title: z.string(),
        reflectionQuestion: z.string(),
        goal: z.string(),
        initiating: z.object({
            focus: z.string(),
            considerations: z.array(
                z.object({
                    id: z.string(),
                    description: z.string(),
                    compass: z.boolean(),
                })
            )
        }),
	})
});

const resources = defineCollection({
	loader: glob({ pattern: "**/*.yaml", base: "./src/content/resources" }),
	schema: z.object({
		title: z.string(),
		// pubDate: z.date(),
		// description: z.string(),
		// author: z.string(),
	})
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { posts, indicators, components, resources };