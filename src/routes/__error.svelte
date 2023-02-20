<script lang="ts">
	import { page } from '$app/stores';
</script>

<div>
	{#if $page.status === 404}
		<h1>404 Error</h1>
	{:else}
		<h1>{$page.error?.name}</h1>
		<p>{$page.error?.message}</p>
	{/if}
</div>

<style>
	div {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	h1 {
		color: #c2c2c2;
		text-align: center;
		font-size: 9rem;
		margin-bottom: 0;
		margin-top: 0;
	}
</style>
