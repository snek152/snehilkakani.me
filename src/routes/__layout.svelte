<script lang="ts">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import { onMount } from 'svelte';
	import NavLink from '../components/NavLink.svelte';
	import FaCode from 'svelte-icons/fa/FaCode.svelte';
	import FaPenNib from 'svelte-icons/fa/FaPenNib.svelte';
	import FaDrum from 'svelte-icons/fa/FaDrum.svelte';
	import FaTheaterMasks from 'svelte-icons/fa/FaTheaterMasks.svelte';
	import { fadeOut } from '$lib/fade-utils';

	let topAppBar: any;
	let preloaderVisible = true;
	let preloader: HTMLElement;

	$: {
		if (!preloaderVisible) {
			fadeOut(preloader, 500).then(() => (preloader.style.display = 'none'));
		}
	}
	onMount(() => {
		setTimeout(() => {
			preloaderVisible = false;
			document.body.style.overflow = 'auto';
		}, 1000);
	});
	const preloaderImages = [FaCode, FaPenNib, FaDrum, FaTheaterMasks];
</script>

<div class="preloader" bind:this={preloader}>
	<div class="spinner">
		{#each [-0.32, -0.16, 0, 0.16] as delay, index}
			<div class="bounce" style="animation-delay: {delay}s">
				<svelte:component this={preloaderImages[index]} />
			</div>
		{/each}
	</div>
</div>
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
	</div>
</AutoAdjust>

<style>
	:global(body) {
		margin: 0;
		overflow: hidden;
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

	.preloader {
		position: fixed;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100%;
		z-index: 50;
		justify-content: center;
		align-items: center;
		display: flex;
		background-color: white;
	}

	.spinner {
		width: 100vw;
		text-align: center;
		justify-content: space-between;
	}

	.spinner > div {
		width: 2.5rem;
		height: 2.5rem;
		background-repeat: no-repeat !important;
		border-radius: 0%;
		margin: 0 5px;
		display: inline-block;
		animation: sk-bouncedelay 1.3s infinite ease-in-out both;
	}

	@keyframes sk-bouncedelay {
		0%,
		80%,
		100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
		}
	}
</style>
