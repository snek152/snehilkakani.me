<script lang="ts">
	import Paper, { Content } from '@smui/paper';
	import { onDestroy, onMount } from 'svelte';
	import Typed from 'typed.js';

	let el: HTMLElement;
	let typed: Typed;

	onMount(() => {
		const options = {
			strings: [
				"I'm a frontend engineer",
				"I'm a backend developer",
				"I'm an innovator",
				"I'm a graphic designer",
				"I'm a drummer"
			],
			typeSpeed: 80,
			smartBackspace: true,
			backDelay: 600,
			backSpeed: 40,
			loop: true,
			loopCount: Infinity
		};
		typed = new Typed(el, options);
	});

	onDestroy(() => {
		typed?.destroy();
	});
</script>

<div id="about" class="section">
	<Paper
		style="max-width: 1500px; margin: 1rem; border-radius: 1.25rem; padding: 0; overflow: hidden;"
		elevation={2}
	>
		<Content>
			<div class="card-columns">
				<div class="col-1">
					<img src="/images/aboutphoto.webp" alt="Snehil Kakani" />
				</div>
				<div class="col-2">
					<div class="card-body">
						<h1 class="card-title">
							<span bind:this={el} />
						</h1>
					</div>
				</div>
			</div>
		</Content>
	</Paper>
</div>

<style>
	#about {
		padding: 1rem;
	}
	.card-columns {
		display: flex;
	}

	.card-title {
		margin-bottom: 0.5rem;
		margin-top: 0;
		font-weight: 500;
	}

	.card-body {
		flex: 1 1 auto;
		padding: 1rem;
	}

	@media (min-width: 768px) {
		.col-1 {
			width: 100%;
		}
		.col-2 {
			width: 100%;
		}
	}
	@media (min-width: 1024px) {
		.col-1 {
			width: 41.6%;
		}

		.col-2 {
			width: 58.3%;
		}
	}

	.col-1 > img {
		width: 100%;
		height: 100%;
	}

	.col-2 {
		padding: 15px;
	}
</style>
