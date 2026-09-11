// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

import netlify from '@astrojs/netlify';

// Either netlify or local server (npx astro dev)
let isDev = process.env.NETLIFY === 'true' || import.meta.env.DEV;
let devSite = 'https://middle-success.netlify.app/';

// https://astro.build/config
export default defineConfig({
	integrations: [react(), markdoc(), keystatic()],
	trailingSlash: 'always',
	adapter: netlify({
		imageCDN: false,
	}),

	site: isDev ? process.env.DEPLOY_PRIME_URL || devSite : 'https://middle.nbed.ca',
	base: isDev ? '/' : '/conditions-for-success/',
});
