<script lang="ts">
	import { codingSkills, designSkills, musicSkills } from '$lib/data';
	import Paper, { Content } from '@smui/paper';
	import Tooltip, { Wrapper, Content as C } from '@smui/tooltip';
	import LinearProgress from '@smui/linear-progress';
	import Fa from 'svelte-fa';
	import { faFileAudio } from '@fortawesome/free-solid-svg-icons/faFileAudio';
	import { faFileCode } from '@fortawesome/free-solid-svg-icons/faFileCode';
	import { faPalette } from '@fortawesome/free-solid-svg-icons/faPalette';
	import Testimonials from '../components/Testimonials.svelte';
</script>

<div id="expertise" class="section">
	<div class="container">
		<div class="row">
			<Paper elevation={5} class="column">
				<Content>
					<Fa icon={faFileCode} style="opacity: 0.65; float: left;" class="card-image" />
					<span>
						<h3 class="card-title">Computer Science</h3>
						<p class="card-description">
							Being an avid programmer, I specialize in front-end and back-end web development,
							functional programming, and data structures. Here are some of the languages and
							platforms I'm proficient with.
						</p>
					</span>
					<div class="icon-grid">
						{#each codingSkills as s}
							<Wrapper>
								<svelte:component this={s.icon} class="icon" />
								<Tooltip xPos="start">
									<C>
										<h3 class="tooltip-header">{s.name}</h3>
										<div class="tooltip-body"><LinearProgress progress={s.progress / 100} /></div>
									</C>
								</Tooltip>
							</Wrapper>
						{/each}
					</div>
				</Content>
			</Paper>
			<Paper elevation={5} class="column">
				<Content>
					<Fa icon={faPalette} style="opacity: 0.65; float: left;" class="card-image" />
					<span>
						<h3 class="card-title">Graphic Design</h3>
						<p class="card-description">
							As a creative designer and budding artist, I enjoy designing Instagram posts, flyers,
							and ads for various companies and events. I use my love of art heavily in this field.
							Below are the platforms I work with.
						</p>
					</span>
					<div class="icon-grid">
						{#each designSkills as s}
							<Wrapper>
								<svelte:component this={s.icon} class="icon" />
								<Tooltip xPos="start">
									<C>
										<h3 class="tooltip-header">{s.name}</h3>
										<div class="tooltip-body"><LinearProgress progress={s.progress / 100} /></div>
									</C>
								</Tooltip>
							</Wrapper>
						{/each}
					</div>
				</Content>
			</Paper>
			<Paper elevation={5} class="column">
				<Content>
					<Fa icon={faFileAudio} style="opacity: 0.65; float: left;" class="card-image" />
					<span>
						<h3 class="card-title">Music</h3>
						<p class="card-description">
							One of my greatest and longest lasting passions is music. Over the years, I have
							learned quite a few instruments and software platforms to use in my music creation.
							Outlined are these platforms and instruments.
						</p>
					</span>
					<div class="icon-grid">
						{#each musicSkills as s}
							<Wrapper>
								<svelte:component this={s.icon} class="icon" />
								<Tooltip xPos="start">
									<C>
										<h3 class="tooltip-header">{s.name}</h3>
										<div class="tooltip-body"><LinearProgress progress={s.progress / 100} /></div>
									</C>
								</Tooltip>
							</Wrapper>
						{/each}
					</div>
				</Content>
			</Paper>
		</div>
		<h3 class="tip">(Tip: Hover over the icons to see progress levels)</h3>
	</div>
	<Testimonials />
</div>

<style>
	.tip {
		color: #c2c2c2;
		font-weight: 400;
		text-align: center;
	}
	.tooltip-header {
		color: white;
		margin-top: 0;
		margin-bottom: 0.5rem;
		padding: 0 1.5rem;
		text-align: center;
	}
	:global(.mdc-tooltip__surface) {
		background-color: rgba(0, 0, 0, 0.7) !important;
	}
	#expertise {
		margin: 1rem 0;
	}
	:global(.column) {
		padding: 15px;
		border-radius: 1rem !important;
		position: relative;
		width: 100%;
	}

	:global(.icon-grid svg) {
		cursor: pointer;
		height: 20px;
		width: 20px;
		user-select: none;
	}

	.icon-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}
	.container {
		padding: 0 1rem;
	}
	.row {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	:global(.card-image) {
		height: 6.5rem !important;
		width: 6.5rem !important;
		padding: 0 1rem 1rem 0;
		margin-bottom: -0.5rem;
	}

	.card-description {
		text-align: left;
		padding-top: 5px;
		font-size: 15px;
		margin-bottom: 10px;
		margin-top: 0;
	}

	.card-title {
		font-size: calc(1.3rem + 0.6vw);
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-weight: 500;
		line-height: 1.2;
	}

	@media (min-width: 992px) {
		:global(.column) {
			flex: 1 0 0%;
		}
		.row {
			flex-direction: row;
		}
	}
</style>
