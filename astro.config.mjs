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
	adapter: netlify({
		imageCDN: false,
	}),

	// ↓ Test Only Setting ↓
	site: 'https://middle-success.netlify.app/',

	// ↓ Build Only Setting ↓
	// site: 'https://middle.nbed.ca',
	// base: '/conditions-for-success/',
	// output: 'static',

});