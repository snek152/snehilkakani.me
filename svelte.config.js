import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import viteCompression from 'vite-plugin-compression';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		vite: {
			plugins: [viteCompression()]
		}
	}
};

export default config;
