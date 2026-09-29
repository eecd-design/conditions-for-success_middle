// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

import netlify from '@astrojs/netlify';

let isNetlify = process.env.NETLIFY === 'true';
let isNetlifyPreview = process.env.CONTEXT && process.env.CONTEXT !== 'production';
let isLocalDev = import.meta.env.DEV; // Local server (npx astro dev)

// Determine the canonical site URL dynamically
const getSite = () => {
	if (isNetlify) {
		return isNetlifyPreview ? process.env.DEPLOY_PRIME_URL : process.env.URL;
	}
	return 'https://middle.nbed.ca';
};

// https://astro.build/config
export default defineConfig({
	integrations: [react(), markdoc(), keystatic()],
	trailingSlash: 'always',
	adapter: netlify({
		imageCDN: false,
	}),

	// Local host -> devSite, Netlify previews -> DEPLOY_PRIME_URL, Production -> middle.nbed.ca
	site: getSite(),

	// Use root '/' when running on Netlify (production or preview) or local dev;
	// use the subpath only when deploying to your custom static server host.
	base: isNetlify || isLocalDev ? '/' : '/conditions-for-success/',
});
