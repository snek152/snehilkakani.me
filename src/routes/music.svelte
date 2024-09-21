<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import AudioPlayer from '../components/AudioPlayer.svelte';
	import { type Beat, beats } from '$lib/data';
	import Ripple from '@smui/ripple';
	import Button from '@smui/button';
	import FaRegPlayCircle from 'svelte-icons/fa/FaRegPlayCircle.svelte';
	import { onMount } from 'svelte';

	let width: number;

	onMount(() => {
		document.body.style.overflowY = 'auto';
	});

	let primaryBeats: Beat[];
	$: primaryBeats = beats.filter((b) => b.primary);
</script>

<svelte:window bind:innerWidth={width} />

<div class="container">
	<div id="home" class="section">
		<h1 class="header">Snehil Kakani</h1>
		<h2 class="header2">Music Portfolio</h2>
	</div>
	<div class="grid">
		<LayoutGrid>
			{#each primaryBeats as beat}
				<Cell
					span={width >= 1800 ? 3 : width >= 1300 ? 3 : width >= 1000 ? 3 : width >= 870 ? 3 : 2}
				>
					<div use:Ripple={{ surface: true, color: 'primary' }} class="grid-item">
						<div class="grid-item-container">
							<span class="image">
								<img
									src={'/images/albumcovers.webp'}
									alt={beat.title}
									draggable={false}
									on:dragstart={() => false}
									loading="lazy"
								/>
							</span>
							<span class="project-content">
								<h6 class="project-header">{beat.title}</h6>
								<Button
									variant="raised"
									class="project-button"
									href={beat.file}
									target="_blank"
									rel="noreferrer noopener"
								>
									<span class="icon">
										<FaRegPlayCircle />
									</span>
								</Button>
							</span>
						</div>
					</div>
				</Cell>
			{/each}
		</LayoutGrid>
	</div>
	<AudioPlayer />
</div>

<style>
	#home {
		background: url('/images/Snehil Kakani.webp') content-box no-repeat fixed;
		background-position: top;
		background-size: cover;
		min-height: calc(40vh);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
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

	.grid {
		padding: 0 2rem;
	}
	.icon {
		height: 16px;
		width: 16px;
		display: inline-block;
		margin-right: 3px;
	}

	.grid-item {
		aspect-ratio: 1 / 1;
		position: relative;
		overflow: hidden !important;
		display: flex;
		margin: 0.5rem;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		cursor: pointer;
	}

	.grid-item-container {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.image {
		display: flex;
		align-self: center;
		justify-self: center;
		flex-direction: column;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		height: 100%;
		width: 100%;
		transition: all 0.25s linear;
		overflow: hidden;
		user-select: none;
	}

	.image img {
		height: 100%;
		user-select: none;
		pointer-events: none;
	}

	.grid-item:hover .image {
		box-sizing: border-box;
		overflow: hidden;
		width: 120%;
		height: 120%;
		opacity: 0.1;
		transition: all 0.25s linear;
	}

	.project-content {
		width: 95%;
		color: white;
		opacity: 0;
		transition: all 0.25s linear;
		text-align: center;
		user-select: none;
		display: inline-block;
		height: -webkit-fit-content;
		height: -moz-fit-content;
		height: fit-content;
		vertical-align: middle;
		padding-right: 7px;
		padding-left: 7px;
	}

	.grid-item:hover .project-content {
		opacity: 1;
		transition: all 0.25s linear;
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

	.project-header
	/* .project-desc,
	.project-subheader { */ {
		text-align: center;
	}

	/* .project-desc {
		margin-top: 0px;
		font-size: 15px;
	} */

	.project-header {
		font-size: 20px;
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-weight: 500;
		line-height: 1.2;
	}
</style>
