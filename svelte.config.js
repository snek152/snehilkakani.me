import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import viteCompression from 'vite-plugin-compression';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),
		vite: {
			plugins: [viteCompression()]
		}
	}
};

export default config;
