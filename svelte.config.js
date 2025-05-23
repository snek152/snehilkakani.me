import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import viteCompression from 'vite-plugin-compression';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess()],

	kit: {
		adapter: adapter(),
		vite: {
			plugins: [viteCompression()],
			optimizeDeps: {
				include: ['lodash.get', 'lodash.isequal', 'lodash.clonedeep']
			}
		}
	}
};

export default config;
