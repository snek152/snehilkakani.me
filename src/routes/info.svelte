<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async () => {
		return {
			redirect: 'https://youtu.be/dQw4w9WgXcQ',
			status: 308
		};
	};
</script>
