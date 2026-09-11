// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

import netlify from '@astrojs/netlify';

let isDev = process.env.NETLIFY === 'true';
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
