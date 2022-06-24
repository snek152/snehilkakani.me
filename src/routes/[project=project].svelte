<script context="module" lang="ts">
	import { projectUrls } from '$lib/projectUrls';

	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ params }) => {
		return {
			redirect: projectUrls[params.project],
			status: 308
		};
	};
</script>
