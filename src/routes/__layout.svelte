<script lang="ts">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import NavLink from '../components/NavLink.svelte';

	let topAppBar: any;
</script>

<TopAppBar variant="standard" color="secondary" bind:this={topAppBar}>
	<Row>
		<Section>
			<Title>Snehil Kakani</Title>
		</Section>
		<Section align="end">
			<NavLink href="#">Home</NavLink>
		</Section>
	</Row>
</TopAppBar>

<AutoAdjust {topAppBar}>
	<div class="container">
		<slot />
	</div></AutoAdjust
>

<style>
	:global(body) {
		margin: 0;
	}
	:global(:root) {
		--width-sm: 640px;
		--width-md: 768px;
		--width-lg: 1024px;
		--width-xl: 1280px;
	}

	:global(h1, h2, h3, h4, h3 > *) {
		font-family: 'Red Hat Display' !important;
	}

	:global(*) {
		font-family: 'IBM Plex Sans' !important;
	}
</style>
