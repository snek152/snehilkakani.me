<script lang="ts">
	import Carousel from 'svelte-carousel';
	import { browser } from '$app/env';
	import { testimonials } from '$lib/data';
	import FaChevronLeft from 'svelte-icons/fa/FaChevronLeft.svelte';
	import FaChevronRight from 'svelte-icons/fa/FaChevronRight.svelte';
	import Button from '@smui/fab';
	import Paper from '@smui/paper';

	let carousel: any;
</script>

<br />
<h1 class="header">Testimonials</h1>

<div class="carousel">
	{#if browser}
		<Carousel bind:carousel let:showPrevPage let:showNextPage swiping={false}>
			<div slot="prev" class="button-container">
				<Button color="primary" on:click={showPrevPage} mini>
					<FaChevronLeft />
				</Button>
			</div>
			<div slot="next" class="button-container">
				<Button color="primary" on:click={showNextPage} mini>
					<FaChevronRight />
				</Button>
			</div>
			{#each testimonials as { name, testimonial }}
				<Paper>
					<div class="testimonial">
						<div class="testimonial-content">
							<p>
								{#each testimonial.split('*') as t, i}
									{#if i % 2 == 1}
										<span class="strong">{t}</span>
									{:else}
										{t}
									{/if}
								{/each}
							</p>
						</div>
						<div class="testimonial-author">
							<h1>{name}</h1>
						</div>
					</div>
				</Paper>
			{/each}
			<div slot="dots" />
		</Carousel>
	{/if}
</div>
<br />

<style>
	.testimonial-author {
		font-size: 0.5rem !important;
		text-align: center;
	}
	.button-container {
		display: flex;
		align-items: center;
		padding: 1rem;
	}

	@media only screen and (max-width: 991px) {
		.button-container {
			padding: 0.5rem;
			position: relative;
		}
		:global(.button-container button) {
			height: 2rem !important;
			width: 2rem !important;
		}
	}

	:global(.button-container svg) {
		height: 16px !important;
		width: 16px !important;
	}

	:global(.carousel .smui-paper) {
		padding: 0.25rem 1rem;
	}

	.header {
		margin: auto;
		display: block;
		width: fit-content;
		color: #c2c2c2;
		font-size: calc(1.375rem + 1.5vw);
		font-weight: 500;
		line-height: 1.2;
	}

	.header::after {
		content: '';
		display: block;
		margin: 0.8rem auto;
		width: 75%;
		border-bottom: 0.2rem solid #c2c2c2;
	}

	.strong {
		font-weight: bold;
		color: #0d6efd;
	}
</style>
