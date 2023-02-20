<script lang="ts">
	import List, { Graphic, Item, Text } from '@smui/list';
	import Paper, { Content } from '@smui/paper';
	import { onDestroy, onMount } from 'svelte';
	import Typed from 'typed.js';
	import MdEmail from 'svelte-icons/md/MdEmail.svelte';
	import MdSchool from 'svelte-icons/md/MdSchool.svelte';
	import AboutAccordion from '../components/AboutAccordion.svelte';
	import Accordion from '@smui-extra/accordion';

	let el: HTMLElement;
	let typed: Typed;

	onMount(() => {
		const options = {
			strings: [
				"Striving for community improvement",
				"Dedicated to sharing knowledge",
				"Learning new ideas every day",
				"Focused on building relationships",
			],
			typeSpeed: 80,
			smartBackspace: true,
			fadeOutDelay: 600,
			backSpeed: 40,
			loop: true,
			loopCount: Infinity,
			fadeOut: true
		};
		typed = new Typed(el, options);
	});

	onDestroy(() => {
		typed?.destroy();
	});
</script>

<div id="about" class="section">
	<Paper
		style="max-width: 1500px; margin: auto; border-radius: 1.25rem; padding: 0; overflow: hidden;"
		elevation={2}
	>
		<Content>
			<div class="card-columns">
				<div class="col-1">
					<img src="/images/aboutphoto.webp" alt="Snehil Kakani" loading="lazy" />
				</div>
				<div class="col-2">
					<div class="card-body">
						<h1 class="card-title">
							<span bind:this={el} />
						</h1>
						<h5 class="card-text">
							Hi! My name is Snehil, and I'm an aspiring programmer. I love working on solid,
							flexible UIs in the frontend, creating APIs and server apps in the backend, and
							designing intelligent computer vision models. I'm also a graphic designer, gamer,
							drummer, actor, and more! You can find me on social media, or contact me directly.
						</h5>
						<div class="card-list">
							<List nonInteractive class="list">
								<Item>
									<Graphic>
										<MdEmail />
									</Graphic>
									<Text>kakanisnehil@gmail.com</Text>
								</Item>
								<Item>
									<Graphic>
										<MdSchool />
									</Graphic>
									<Text>Rising Sophomore - Lynbrook High School</Text>
								</Item>
							</List>
						</div>
						<hr />
						<div class="card-columns-flex">
							<!-- <div class="col-3">
								<h4>Professional Experience</h4>
								<Accordion color="primary">
									<AboutAccordion title="Director of Technology" description="@ STEMist Education">
										As the director of technology at <a
											href="https://joinstemist.org"
											target="_blank"
											rel="noreferrer noopener">STEMist Education</a
										>, I manage the tech team, report and relay between the officers and the tech
										team, interview tech candidates, and focus primarily on building the website.
										The website is built using React, Next.js, and Tailwind.
									</AboutAccordion>
									<AboutAccordion
										title="Graphic Designer"
										description="@ Youth Economics Initiative"
									>
										As a graphic designer at the <a
											href="https://theyei.org"
											target="_blank"
											rel="noreferrer noopener">YEI</a
										>, I make professional Instagram posts and stories to promote their events, as
										well as educating people about economics. To accomplish this, I use the graphic
										design platform
										<a href="https://canva.com" target="_blank" rel="noreferrer noopener">Canva</a>.
									</AboutAccordion>
									<AboutAccordion
										title="Full Stack Web Developer"
										description="@ YoungWonks Open Source Project 2021"
									>
										In the summer of 2021, I was selected into an open source project called
										GeoRepair <a
											href="https://github.com/youngwonks/ywsos2021_web"
											target="_blank"
											rel="noreferrer noopener">(learn more)</a
										>. I worked as a frontend developer and created the homepage, forum page, and
										assisted in creating basic backend functionalities.
									</AboutAccordion>
								</Accordion>
							</div> -->
							<div class="col-4">
								<h4>My Hobbies</h4>
								<ul>
									<li>Aspiring actor, love being in school plays and musicals</li>
									<li>Avid drummer, enjoy covering favorite songs</li>
									<li>Marvel and Star Wars aficionado and buff</li>
									<li>Occasional gamer, sometimes with friends</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Content>
	</Paper>
</div>

<style>
	:global(.list) {
		color: #4f4f4f !important;
		fill: #4f4f4f !important;
	}

	:global(.mdc-deprecated-list .mdc-deprecated-list-item__graphic) {
		color: #4f4f4f !important;
	}
	#about {
		padding: 1.5rem;
	}
	.card-columns {
		display: flex;
		flex-direction: column;
		overflow-wrap: anywhere !important;
	}

	.card-columns-flex {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.card-columns h4 {
		font-size: calc(1.275rem + 0.3vw);
		font-weight: 400;
		padding-bottom: 0.5rem;
		margin-top: 0.5rem;
		line-height: 1.2;
		margin-bottom: 0;
	}

	.card-columns ul {
		margin-top: 0;
	}
	.card-columns > * {
		overflow: hidden;
	}

	.card-title {
		margin-bottom: 1rem;
		margin-top: 0;
		font-weight: 500;
		font-size: calc(1.3rem + 0.5vw);
	}

	.card-body {
		flex: 1 1 auto;
	}

	.card-text {
		font-weight: 400;
		margin-bottom: 0;
		font-size: 1.2rem;
		margin-top: 0;
		line-height: 1.2;
	}

	.col-1,
	.col-2,
	.col-3,
	.col-4 {
		width: 100%;
		flex: 0 0 auto;
	}

	.col-3,
	.col-4 {
		display: inline;
		padding: 0;
		min-width: 0;
	}

	@media (min-width: 992px) {
		.col-1 {
			width: 41.7%;
			position: relative;
		}
		.col-1 > img {
			position: absolute;
			height: 50%;
		}

		.col-2 {
			width: 58.3%;
		}

		.col-3,
		.col-4 {
			padding: 0 1rem;
		}

		.card-columns {
			flex-direction: row;
		}
		.card-body {
			padding: 1rem;
		}
	}

	.col-1 > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.col-2 {
		padding: 15px;
	}

	:global(.mdc-deprecated-list-item__text) {
		text-overflow: clip;
		white-space: normal;
	}
</style>
