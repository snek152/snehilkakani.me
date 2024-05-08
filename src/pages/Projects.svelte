<script lang="ts">
	import Button, { Group } from '@smui/button';
	import ProfessionalProjects from '../components/ProfessionalProjects.svelte';
	import ProjectGrid from '../components/ProjectGrid.svelte';
	import DramaProductions from '../components/DramaProductions.svelte';

	let choices = ['All', 'Code Projects', 'Designs', 'Music', 'Drama Productions'];
	let selected = 'All';
</script>

<div id="projects" class="section">
	<h1 class="header">Major Projects & Professional Experience</h1>
	<ProfessionalProjects />
	<h1 class="header">Experience in Theatre</h1>
	<DramaProductions />
	<!-- <AudioPlayer /> -->
	<h1 class="header">Side Projects</h1>
	<!-- <div class="button-group">
		<Group class="group">
			{#each choices as c}
				<Button
					color={selected === c ? 'primary' : 'secondary'}
					variant={selected === c ? 'raised' : 'unelevated'}
					on:click={() => (selected = c)}
					class="button"
				>
					{c}
				</Button>
			{/each}
		</Group>
	</div> -->
	<ProjectGrid />
</div>

<style>
	:global(.group) {
		flex-wrap: wrap;
		margin: 0 1rem;
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

	.button-group {
		display: flex;
		justify-content: center;
	}

	:global(.smui-button--color-secondary.mdc-button--raised:not(:disabled), .smui-button--color-secondary.mdc-button--unelevated:not(:disabled)) {
		background-color: #2b2b2b !important;
	}
</style>
