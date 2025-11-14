// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
	integrations: [react(), markdoc(), keystatic()],
	trailingSlash: 'always',

	// ↓ Build Only Setting ↓
	// site: 'https://middle.nbed.ca',
	// base: '/conditions-for-success/',

	// Enable these for build
	output: 'static',

	// Disable these for build
	adapter: netlify({
		imageCDN: false,
	}),

});