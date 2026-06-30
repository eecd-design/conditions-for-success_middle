// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

import netlify from '@astrojs/netlify';

let isProd = process.env.CONTEXT === 'production';
let prodSite = 'https://middle-success.netlify.app/';

// https://astro.build/config
export default defineConfig({
	integrations: [react(), markdoc(), keystatic()],
	trailingSlash: 'always',
	adapter: netlify({
		imageCDN: false,
	}),

	// ↓ Test Only Setting ↓
	site: isProd ? prodSite : process.env.DEPLOY_PRIME_URL || prodSite,

	// ↓ Build Only Setting ↓
	// site: 'https://middle.nbed.ca',
	// base: '/conditions-for-success/',
	// output: 'static',
});
