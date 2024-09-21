<script lang="ts">
	import AudioPlayer from '../components/AudioPlayer.svelte';
	import { type Beat, beats } from '$lib/data';
	import Button from '@smui/button';
	import { onMount } from 'svelte';
	import { fadeOut } from '$lib/fade-utils';
	import { dev } from '$app/env';

	let width: number;

	onMount(() => {
		document.body.style.overflowY = 'auto';
	});

	let primaryBeats: Beat[];
	$: primaryBeats = beats.filter((b) => b.primary);

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
	});
	import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
	import { faPenNib } from '@fortawesome/free-solid-svg-icons/faPenNib';
	import { faDrum } from '@fortawesome/free-solid-svg-icons/faDrum';
	import { faTheaterMasks } from '@fortawesome/free-solid-svg-icons/faTheaterMasks';
	import Fa from 'svelte-fa';
	import IoIosSkipBackward from 'svelte-icons/io/IoIosSkipBackward.svelte';

	const preloaderImages = [faCode, faPenNib, faDrum, faTheaterMasks].map((icon) => ({
		icon,
		component: Fa,
		size: '2x'
	}));
</script>

<svelte:window bind:innerWidth={width} />

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
<div class="container">
	<div id="home" class="section">
		<div class="back">
			<Button
				variant="outlined"
				color="secondary"
				ripple={false}
				on:click={() => {
					history.pushState({}, '', '/');
					window.location.href = '/';
				}}
				class="nav-link-button-cool nav-link-button"
				touch
			>
				<IoIosSkipBackward />
				Main Website
			</Button>
		</div>
		<h1 class="header">Snehil Kakani</h1>
		<h2 class="header2">Music Portfolio</h2>
	</div>
	<br />
	<AudioPlayer />
</div>
<div id="footer">
	<svg id="wave" viewBox="0 0 1440 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<path
			fill="#0d6efd"
			d="M0,80L26.7,70C53.3,60,107,40,160,40C213.3,40,267,60,320,60C373.3,60,427,40,480,38.3C533.3,37,587,53,640,61.7C693.3,70,747,70,800,63.3C853.3,57,907,43,960,36.7C1013.3,30,1067,30,1120,36.7C1173.3,43,1227,57,1280,65C1333.3,73,1387,77,1440,70C1493.3,63,1547,47,1600,36.7C1653.3,27,1707,23,1760,21.7C1813.3,20,1867,20,1920,26.7C1973.3,33,2027,47,2080,46.7C2133.3,47,2187,33,2240,33.3C2293.3,33,2347,47,2400,46.7C2453.3,47,2507,33,2560,31.7C2613.3,30,2667,40,2720,50C2773.3,60,2827,70,2880,71.7C2933.3,73,2987,67,3040,68.3C3093.3,70,3147,80,3200,75C3253.3,70,3307,50,3360,46.7C3413.3,43,3467,57,3520,61.7C3573.3,67,3627,63,3680,56.7C3733.3,50,3787,40,3813,35L3840,30L3840,100L3813.3,100C3786.7,100,3733,100,3680,100C3626.7,100,3573,100,3520,100C3466.7,100,3413,100,3360,100C3306.7,100,3253,100,3200,100C3146.7,100,3093,100,3040,100C2986.7,100,2933,100,2880,100C2826.7,100,2773,100,2720,100C2666.7,100,2613,100,2560,100C2506.7,100,2453,100,2400,100C2346.7,100,2293,100,2240,100C2186.7,100,2133,100,2080,100C2026.7,100,1973,100,1920,100C1866.7,100,1813,100,1760,100C1706.7,100,1653,100,1600,100C1546.7,100,1493,100,1440,100C1386.7,100,1333,100,1280,100C1226.7,100,1173,100,1120,100C1066.7,100,1013,100,960,100C906.7,100,853,100,800,100C746.7,100,693,100,640,100C586.7,100,533,100,480,100C426.7,100,373,100,320,100C266.7,100,213,100,160,100C106.7,100,53,100,27,100L0,100Z"
		/>
	</svg>
	<div class="footer-inner">
		<h1 class="footheader">Snehil Kakani</h1>
		<p class="copyright">Copyright © 2024 All rights reserved.</p>
	</div>
</div>

<style>
	/* .mainheader {
		margin: auto;
		display: block;
		width: fit-content;
		color: #c2c2c2;
		font-size: calc(1.375rem + 1.5vw);
		font-weight: 500;
		line-height: 1.2;
	}

	.mainheader::after {
		content: '';
		display: block;
		margin: 0.8rem auto;
		width: 75%;
		border-bottom: 0.2rem solid #c2c2c2;
	} */
	#wave {
		transform: translateY(1px);
	}
	#footer {
		display: flex;
		flex-direction: column;
	}
	.footheader {
		margin: auto;
		display: block;
		width: fit-content;
		color: #fff;
		font-size: 2rem;
		font-weight: 400;
		line-height: 1.2;
	}

	.copyright {
		text-align: center;
		padding-bottom: 1rem;
		color: #fff;
	}

	.footheader::after {
		content: '';
		display: block;
		margin: 0.3rem 0;
		width: 35%;
		border-bottom: 0.2rem solid #fff;
	}
	.footer-inner {
		background-color: #0d6efd;
		height: 100px;
	}

	:global(.nav-link-button-cool) {
		display: flex;
		gap: 0.5rem;
		color: #fbfbfb !important;
		border-color: #fbfbfb !important;
	}

	:global(.nav-link-button-cool > svg) {
		height: 1rem;
		width: 1rem;
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

	.back {
		margin: 0 !important;
		position: absolute;
		top: 0.5rem;
		left: 1rem;
	}

	#home {
		background: url('/images/Snehil Kakani.webp') content-box no-repeat fixed;
		background-position: top;
		background-size: cover;
		min-height: calc(40vh);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.header {
		color: #fbfbfb;
		font-weight: 400;
		text-align: center;
		font-size: calc(7vw);
		margin: 0 !important;
	}

	.header2 {
		margin: 0 !important;
		font-size: calc(3vw);
		text-transform: uppercase;
		font-weight: 600;
		color: #fbfbfb;
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
	/* 
	:global(.project-button) {
		transform: translate(0, 300%);
		transition: all 0.25s linear !important;
		padding: 0.5rem 0.75rem;
	}

	:global(.grid-item:hover .project-button) {
		transform: translate(0, 0);
		transition: all 0.25s linear;
	} */
</style>
