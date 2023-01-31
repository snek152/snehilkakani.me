<script lang="ts">
	import { professionalProjects } from '$lib/data';
	import Button from '@smui/button';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import MdOpenInNew from 'svelte-icons/md/MdOpenInNew.svelte';
	import ProjectChips from './ProjectChips.svelte';

	let width: number;
</script>

<svelte:window bind:innerWidth={width} />

<div class="grid">
	<LayoutGrid>
		{#each professionalProjects as project}
			<Cell
				span={width >= 1800 ? 3 : width >= 1300 ? 4 : width >= 1000 ? 6 : width >= 870 ? 12 : 12}
			>
				<div class="grid-item">
					<div class="grid-item-container">
						<span class="image">
							<img
								src={project.image}
								alt={project.title}
								draggable={false}
								on:dragstart={() => false}
								loading="lazy"
							/>
						</span>
						<span class="project-content">
							<h6 class="project-header">{project.title}</h6>
							{#if project.chips}
								<div class="project-subheader">
									<ProjectChips subheaders={project.chips} />
								</div>
							{/if}
							<p class="project-desc">{project.description}</p>
							<Button
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
							</Button>
						</span>
					</div>
				</div>
			</Cell>
		{/each}
	</LayoutGrid>
</div>

<style>
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
		align-items: center;
		justify-content: center;
		flex-direction: column;
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

	:global(.project-button) {
		transform: translate(0, 300%);
		transition: all 0.25s linear !important;
		padding: 0.5rem 0.75rem;
	}

	:global(.grid-item:hover .project-button) {
		transform: translate(0, 0);
		transition: all 0.25s linear;
	}

	.project-header,
	.project-desc,
	.project-subheader {
		text-align: center;
	}

	.project-desc {
		margin-top: 0px;
		font-size: 15px;
	}

	.project-header {
		font-size: 20px;
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-weight: 500;
		line-height: 1.2;
	}
</style>
