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
	import { faCode, faDrum, faPenNib, faTheaterMasks } from '@fortawesome/free-solid-svg-icons';
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
			icon: faCode,
			size: '2x'
		},
		{
			icon: faPenNib,
			size: '2x'
		},
		{
			icon: faDrum,
			size: '2x'
		},
		{
			icon: faTheaterMasks,
			size: '2x'
		}
	].map((i) => ({
		...i,
		component: Fa
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

<svelte:window on:scroll={onScroll} bind:scrollY={top} bind:innerWidth={width} />
<svelte:head>
	<link rel="stylesheet" href="/smui.css" />
</svelte:head>
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
					<IoMdMenu />
				</IconButton>
			{/if}
		</Section>
	</Row>
</TopAppBar>

<div:any use:clickOutside on:click_outside={() => (open = false)}>
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
</div:any>

<AutoAdjust {topAppBar}>
	<div class="container">
		<slot />
	</div>
</AutoAdjust>

<style>
	:global(body) {
		margin: 0;
		overflow-y: hidden;
		overflow-x: hidden;
		position: relative;
	}
	:global(:root) {
		--width-sm: 640px;
		--width-md: 768px;
		--width-lg: 1024px;
		--width-xl: 1280px;
	}

	:global(h1 > *, h2 > *, h3 > *, h4 > *, h3 > *, h1, h2, h3, h4) {
		font-family: 'Red Hat Display' !important;
	}

	:global(.smui-accordion
			.smui-accordion__panel
			> .smui-accordion__header
			.smui-accordion__header__description) {
		opacity: 0.75 !important;
		flex-basis: initial !important;
		white-space: normal !important;
	}

	:global(.smui-accordion .smui-accordion__panel.smui-accordion__panel--raised, .smui-accordion
			.smui-accordion__panel.smui-paper--unelevated) {
		border-top-color: rgba(0, 0, 0, 0.2) !important;
	}

	:global(.smui-accordion
			.smui-accordion__panel
			> .smui-accordion__header
			.smui-accordion__header__title.smui-accordion__header__title--with-description) {
		flex-basis: initial !important;
	}

	:global(.smui-accordion
			.smui-accordion__panel
			> .smui-accordion__header
			.smui-accordion__header__title) {
		flex-grow: 0 !important;
	}

	:global(*) {
		font-family: 'IBM Plex Sans' !important;
		box-sizing: border-box;
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
