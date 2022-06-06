<script lang="ts">
	import { Content, Header, Panel } from '@smui-extra/accordion';
	import IoIosArrowDown from 'svelte-icons/io/IoIosArrowDown.svelte';
	import IoIosArrowUp from 'svelte-icons/io/IoIosArrowUp.svelte';

	let open = false;

	export let title: string;
	export let description: string;
</script>

<Panel bind:open>
	<Header>
		{title}
		<span slot="description">{description}</span>
		<div class="icon" slot="icon">
			{#if open}
				<IoIosArrowUp />
			{:else}
				<IoIosArrowDown />
			{/if}
		</div>
	</Header>
	<Content>
		<slot />
	</Content>
</Panel>

<style>
	.icon {
		height: 16px;
		width: 16px;
	}
</style>
