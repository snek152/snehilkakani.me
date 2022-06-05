<script lang="ts">
	import RandomObjectMover from '$lib/object-mover';

	import { onMount } from 'svelte';

	let icon: HTMLElement;
	onMount(() => {
		const obj = new RandomObjectMover(icon, document.querySelector('#home')!);
		obj.start();
	});
</script>

<div class="floating-icon" bind:this={icon}>
	<slot />
</div>

<style>
	.floating-icon {
		width: 50px;
		height: 50px;
		color: white;
		user-select: none;
		position: absolute;
	}
</style>
