<script lang="ts">
	import IconButton from '@smui/icon-button';
	import MdPlayArrow from 'svelte-icons/md/MdPlayArrow.svelte';
	import MdForward10 from 'svelte-icons/md/MdForward10.svelte';
	import MdReplay10 from 'svelte-icons/md/MdReplay10.svelte';
	import MdPause from 'svelte-icons/md/MdPause.svelte';
	import { Graphic, Item, Text } from '@smui/list';
	import LinearProgress, { type LinearProgressComponentDev } from '@smui/linear-progress';
	// import {LinearProgressComponentDev}
	import { onMount } from 'svelte';
	import { beats } from '$lib/data';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import MdPlayCircleFilled from 'svelte-icons/md/MdPlayCircleFilled.svelte';

	let progress: number = 0;

	let audio_file = '';
	let current_name = 'Not Playing';
	let audio: HTMLAudioElement;

	let audio_duration: number = 0;

	let playing: boolean = false;

	let current_time: number = 0;

	function loadAudioTime(cb?: () => void) {
		audio.volume = 0.4;
		if (audio.readyState > 0) {
			if (cb) cb();
			audio_duration = audio.duration;
		} else {
			audio.addEventListener('loadedmetadata', () => {
				if (cb) cb();
				audio_duration = audio.duration;
			});
		}
	}

	$: if (audio) {
		audio.addEventListener('timeupdate', () => {
			current_time = audio.currentTime;
			progress = Math.round((500 * audio.currentTime) / audio_duration) / 500;
		});
	}

	onMount(() => {
		loadAudioTime();
	});

	const calculateTime = (secs: number) => {
		const minutes = Math.floor(secs / 60);
		const seconds = Math.floor(secs % 60);
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
		return `${minutes}:${returnedSeconds}`;
	};

	// let col1Height = 0;

	// const updateCol1Height = () => {
	// 	const col1 = document.querySelector('.col-1') as HTMLElement;
	// 	if (col1) {
	// 		col1Height = col1.offsetHeight;
	// 	}
	// };

	// onMount(() => {
	// 	updateCol1Height();
	// 	window.addEventListener('resize', updateCol1Height);
	// });

	let width: number;

	const clickBar = (e: CustomEvent) => {
		let modE = e as unknown as MouseEvent;
		modE.preventDefault();
		console.log(modE.clientX);
		console.log(modE.currentTarget);
		const width = modE.clientX - progressBar.getElement().getBoundingClientRect().x;
		const ratio = width / progressBar.getElement().getBoundingClientRect().width;
		const newTime = audio_duration * ratio;
		audio.currentTime = newTime;
		audio.play();
		playing = true;
	};

	let progressBar: LinearProgressComponentDev;
</script>

<svelte:window bind:innerWidth={width} />

<!-- <Paper class="contact-container"> -->
<div class="container">
	<div class="col-2">
		<!-- <div class="scrollable" > -->
		<LayoutGrid>
			{#each beats as beat}
				<Cell
					span={width >= 1800 ? 1 : width >= 1500 ? 2 : width >= 1000 ? 2 : width >= 900 ? 3 : 2}
				>
					<Item
						ripple={false}
						style="background-color: {current_name === beat.title ? '#0d6efd' : 'none'};"
						on:SMUI:action={() => {
							audio.pause();
							audio.currentTime = 0;
							playing = false;
							audio_file = beat.file;
							current_name = beat.title;
							audio.load();
							loadAudioTime(() => {
								audio.play();
								playing = true;
							});
						}}
					>
						<Graphic style="color: {current_name === beat.title ? '#fbfbfb' : '#c2c2c2'};">
							<MdPlayCircleFilled />
						</Graphic>
						<Text
							class="title"
							style="color: {current_name === beat.title ? '#fbfbfb' : '#c2c2c2'};"
						>
							{beat.title}
						</Text>
						<!-- <div class="cell-wrapper">
							<span class="cell-play">
								<MdPlayCircleFilled />
							</span>
							<p class="title">{beat.title}</p>
						</div> -->
					</Item>
				</Cell>
			{/each}
		</LayoutGrid>
		<!-- </div> -->
	</div>
	<div class="col-1">
		<!-- <h1>{current_name}</h1> -->
		<audio bind:this={audio} src={audio_file} preload="metadata" />
		<LinearProgress {progress} bind:this={progressBar} on:click={clickBar} class="progress" />
		<div class="toolbar">
			<span class="time">{calculateTime(current_time)}</span>
			<div class="buttons">
				<IconButton
					color="secondary"
					on:click={() => {
						audio.currentTime -= 10;
						audio.play();
						playing = true;
					}}
				>
					<div class="play_icon">
						<MdReplay10 />
					</div>
				</IconButton>
				<IconButton
					color="secondary"
					on:click={() => {
						if (audio.currentTime === audio_duration) {
							audio.currentTime = 0;
							playing = false;
						}
						if (playing) {
							audio.pause();
							playing = false;
						} else {
							audio.play();
							playing = true;
						}
					}}
				>
					<div class="play_icon">
						{#if playing && audio?.currentTime !== audio_duration}
							<MdPause />
						{:else}
							<MdPlayArrow />
						{/if}
					</div>
				</IconButton>
				<IconButton
					color="secondary"
					on:click={() => {
						audio.currentTime += 10;
						audio.play();
						playing = true;
					}}
				>
					<div class="play_icon">
						<MdForward10 />
					</div>
				</IconButton>
			</div>
			<span class="time">{calculateTime(audio_duration)}</span>
		</div>
	</div>
</div>
<!-- <Button
	variant="raised"
	class="project-button"
	href={project.url}
	target="_blank"
	rel="noreferrer noopener"
>
	<span class="icon">
		<MdOpenInNew />
	</span>
	{project.buttonText}
</Button> -->

<!-- </Paper> -->
<style>
	:global(.mdc-layout-grid__inner) {
		gap: 0rem;
	}
	:global(.mdc-layout-grid) {
		padding: 0 0 1rem !important;
	}
	:global(.title) {
		color: #c2c2c2;
		margin: 0;
	}

	/* .cell-wrapper {
		display: inline-flex;
		align-items: center;
	}

	.cell-play {
		height: 10px;
		width: 10px;
	} */

	/* :global(.progress) {
		height: 0.3rem;
	} */
	.time {
		color: #fbfbfb;
	}
	.container {
		padding: 0 0 0.5rem;
		margin: 0 2rem;
		display: flex;
		flex-direction: column;
	}

	.col-2 {
		overflow: auto;
	}
	.play_icon {
		color: #fbfbfb;
		height: 30px;
		width: 30px;
	}
	.toolbar {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	.toolbar > span {
		padding-top: 5px;
	}

	:global(.play_icon > svg) {
		height: 30px;
		width: 30px;
	}

	:global(.mdc-linear-progress) {
		transform: scaleY(2);
	}

	:global(.mdc-linear-progress:hover) {
		cursor: pointer;
	}

	:global(.mdc-linear-progress__buffer-bar) {
		background-color: #4d4d4d;
	}

	/* .col-1 > h1 {
		color: #c2c2c2;
		margin: 0;
		margin-bottom: 0.5rem;
	} */
</style>
