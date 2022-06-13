<script lang="ts">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import { onMount } from 'svelte';
	import NavLink from '../components/NavLink.svelte';
	import { fadeOut } from '$lib/fade-utils';
	import { navLinks } from '$lib/data';
	import Fab from '@smui/fab';
	import IoIosArrowUp from 'svelte-icons/io/IoIosArrowUp.svelte';
	import IoMdMenu from 'svelte-icons/io/IoMdMenu.svelte';
	import IconButton from '@smui/icon-button';
	import Drawer, { Content } from '@smui/drawer';
	import List from '@smui/list';
	import { clickOutside } from '$lib/click-outside';
	import { dev } from '$app/env';
	import { changePage } from '$lib/page';
	import { activePage } from '$lib/stores';
	import Fa from 'svelte-fa';
	import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
	import { faPenNib } from '@fortawesome/free-solid-svg-icons/faPenNib';
	import { faDrum } from '@fortawesome/free-solid-svg-icons/faDrum';
	import { faTheaterMasks } from '@fortawesome/free-solid-svg-icons/faTheaterMasks';
	let topAppBar: any;
	let preloaderVisible = true;
	let preloader: HTMLElement;

	$: {
		if (!preloaderVisible) {
			fadeOut(preloader, 500).then(() => (preloader.style.display = 'none'));
		}
	}
	onMount(() => {
		setTimeout(
			() => {
				preloaderVisible = false;
				document.body.style.overflowY = 'auto';
			},
			dev ? 0 : 1000
		);
		onScroll();
	});
	const preloaderImages = [
		{
			icon: faCode
		},
		{
			icon: faPenNib
		},
		{
			icon: faDrum
		},
		{
			icon: faTheaterMasks
		}
	].map((i) => ({
		...i,
		component: Fa,
		size: '2x'
	}));

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

	let width: number;
	let open: boolean = false;
</script>

<svelte:window on:scroll|passive={onScroll} bind:scrollY={top} bind:innerWidth={width} />

<div
	style="background: {open
		? 'rgba(0,0,0,0.5)'
		: 'transparent'}; width: 100%; overflow: hidden; height: 100%; position: absolute; transition: background-color 100ms; z-index: 5; pointer-events: none;"
/>
<div class="topbutton-container">
	<div class="topbutton-inner">
		<Fab
			color="primary"
			ripple={false}
			{exited}
			on:click={() => {
				changePage('#home').then(() => {
					exited = true;
					activePage.set('/');
				});
			}}
		>
			<span class="sr-only">Scroll to Top</span>
			<div class="topbutton-icon"><IoIosArrowUp /></div>
		</Fab>
	</div>
</div>
<div class="preloader" bind:this={preloader}>
	<div class="spinner">
		{#each [-0.32, -0.16, 0, 0.16] as delay, index}
			<div class="bounce" style="animation-delay: {delay}s">
				<svelte:component
					this={preloaderImages[index].component}
					icon={preloaderImages[index].icon}
					size={preloaderImages[index].size}
				/>
			</div>
		{/each}
	</div>
</div>
<TopAppBar variant="fixed" color="secondary" bind:this={topAppBar}>
	<Row>
		<Section>
			<Title>Snehil Kakani</Title>
		</Section>
		<Section align="end" toolbar>
			{#if width > 991}
				{#each navLinks as link}
					<NavLink href={link.href}>{link.title}</NavLink>
				{/each}
			{:else}
				<IconButton on:click={() => (open = !open)}>
					<span class="sr-only">Open Menu</span>
					<IoMdMenu />
				</IconButton>
			{/if}
		</Section>
	</Row>
</TopAppBar>

<div use:clickOutside on:click_outside={() => (open = false)}>
	<Drawer variant="modal" fixed bind:open>
		<Content>
			<List>
				{#each navLinks as link}
					<NavLink href={link.href} mobile on:click={() => (open = false)}>
						{link.title}
					</NavLink>
				{/each}
			</List>
		</Content>
	</Drawer>
</div>

<AutoAdjust {topAppBar}>
	<div class="container">
		<slot />
	</div>
</AutoAdjust>
<div class="footer">
	<svg id="wave" viewBox="0 0 1440 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<path
			fill="#0d6efd"
			d="M0,80L26.7,70C53.3,60,107,40,160,40C213.3,40,267,60,320,60C373.3,60,427,40,480,38.3C533.3,37,587,53,640,61.7C693.3,70,747,70,800,63.3C853.3,57,907,43,960,36.7C1013.3,30,1067,30,1120,36.7C1173.3,43,1227,57,1280,65C1333.3,73,1387,77,1440,70C1493.3,63,1547,47,1600,36.7C1653.3,27,1707,23,1760,21.7C1813.3,20,1867,20,1920,26.7C1973.3,33,2027,47,2080,46.7C2133.3,47,2187,33,2240,33.3C2293.3,33,2347,47,2400,46.7C2453.3,47,2507,33,2560,31.7C2613.3,30,2667,40,2720,50C2773.3,60,2827,70,2880,71.7C2933.3,73,2987,67,3040,68.3C3093.3,70,3147,80,3200,75C3253.3,70,3307,50,3360,46.7C3413.3,43,3467,57,3520,61.7C3573.3,67,3627,63,3680,56.7C3733.3,50,3787,40,3813,35L3840,30L3840,100L3813.3,100C3786.7,100,3733,100,3680,100C3626.7,100,3573,100,3520,100C3466.7,100,3413,100,3360,100C3306.7,100,3253,100,3200,100C3146.7,100,3093,100,3040,100C2986.7,100,2933,100,2880,100C2826.7,100,2773,100,2720,100C2666.7,100,2613,100,2560,100C2506.7,100,2453,100,2400,100C2346.7,100,2293,100,2240,100C2186.7,100,2133,100,2080,100C2026.7,100,1973,100,1920,100C1866.7,100,1813,100,1760,100C1706.7,100,1653,100,1600,100C1546.7,100,1493,100,1440,100C1386.7,100,1333,100,1280,100C1226.7,100,1173,100,1120,100C1066.7,100,1013,100,960,100C906.7,100,853,100,800,100C746.7,100,693,100,640,100C586.7,100,533,100,480,100C426.7,100,373,100,320,100C266.7,100,213,100,160,100C106.7,100,53,100,27,100L0,100Z"
		/>
	</svg>
</div>

<style>
	.sr-only {
		border: 0 !important;
		clip: rect(1px, 1px, 1px, 1px) !important; /* 1 */
		-webkit-clip-path: inset(50%) !important;
		clip-path: inset(50%) !important; /* 2 */
		height: 1px !important;
		margin: -1px !important;
		overflow: hidden !important;
		padding: 0 !important;
		position: absolute !important;
		width: 1px !important;
		white-space: nowrap !important; /* 3 */
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
