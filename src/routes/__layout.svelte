<script lang="ts">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import { onMount } from 'svelte';
	import NavLink from '../components/NavLink.svelte';
	import FaCode from 'svelte-icons/fa/FaCode.svelte';
	import FaPenNib from 'svelte-icons/fa/FaPenNib.svelte';
	import FaDrum from 'svelte-icons/fa/FaDrum.svelte';
	import FaTheaterMasks from 'svelte-icons/fa/FaTheaterMasks.svelte';
	import { fadeOut } from '$lib/fade-utils';
	import { navLinks } from '$lib/data';
	import Fab from '@smui/fab';
	import IoIosArrowUp from 'svelte-icons/io/IoIosArrowUp.svelte';

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
		onScroll();
	});
	const preloaderImages = [FaCode, FaPenNib, FaDrum, FaTheaterMasks];

	let top: number;
	let exited = true;
	function onScroll() {
		const homepage = document.getElementById('home')!;
		if (top >= homepage.offsetHeight) {
			exited = false;
		} else {
			exited = true;
		}
	}
</script>

<svelte:window on:scroll={onScroll} bind:scrollY={top} />
<div class="topbutton-container">
	<div class="topbutton-inner">
		<Fab color="primary" ripple={false} {exited} on:click={() => console.log('clicked')}>
			<div class="topbutton-icon"><IoIosArrowUp /></div>
		</Fab>
	</div>
</div>
<div class="preloader" bind:this={preloader}>
	<div class="spinner">
		{#each [-0.32, -0.16, 0, 0.16] as delay, index}
			<div class="bounce" style="animation-delay: {delay}s">
				<svelte:component this={preloaderImages[index]} />
			</div>
		{/each}
	</div>
</div>
<TopAppBar variant="fixed" color="secondary" bind:this={topAppBar}>
	<Row>
		<Section>
			<Title>Snehil Kakani</Title>
		</Section>
		<Section align="end">
			{#each navLinks as link}
				<NavLink href={link.href}>{link.title}</NavLink>
			{/each}
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
		overflow-x: hidden;
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

	:global(.section) {
		scroll-margin-top: 64px;
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

	.topbutton-container {
		position: fixed;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		width: 100%;
		height: 100%;
		z-index: 40;
		pointer-events: none;
	}

	.topbutton-inner {
		pointer-events: all;
		margin: 1rem;
	}

	.topbutton-inner:focus {
		background-color: transparent;
	}

	.topbutton-icon {
		height: 40px;
		width: 40px;
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
