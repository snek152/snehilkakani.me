<script lang="ts">
	import Button from '@smui/button';
	import Paper, { Content } from '@smui/paper';
	import CircularProgress from '@smui/circular-progress';
	import Textfield from '@smui/textfield';
	import Fa from 'svelte-fa';
	import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';

	let email = '';
	let name = '';
	let message = '';

	let loading = false;
	let submitted = false;

	async function formSubmit() {
		loading = true;
		await fetch('https://formspree.io/f/xyylnqbg', {
			headers: {
				'Content-Type': 'application/json',
				'Data-Type': 'json'
			},
			method: 'POST',
			mode: 'no-cors',
			body: JSON.stringify({ name, email, message })
		});
		setTimeout(() => {
			loading = false;
			submitted = true;
			setTimeout(() => {
				submitted = false;
			}, 1000);
		}, 1000);
	}
</script>

<div id="contact" class="section">
	<Paper class="contact-container">
		<h1 class="header">Contact Me</h1>
		<form on:submit|preventDefault={formSubmit}>
			<Content class="flex-container">
				<div class="flex-cols">
					<Textfield
						bind:value={name}
						label="Name"
						required
						variant="outlined"
						style="width: 100%"
					/>
					<Textfield
						bind:value={email}
						label="Email"
						style="width: 100%"
						required
						variant="outlined"
						type="email"
					/>
				</div>
				<div>
					<Textfield bind:value={message} label="Message" required textarea style="width: 100%" />
				</div>
				<div>
					<Button
						variant={!loading ? 'raised' : 'unelevated'}
						type="submit"
						color={!loading ? 'primary' : 'secondary'}
						disabled={loading || submitted}
					>
						{#if loading}
							<CircularProgress indeterminate color="secondary" style="width: 20px; height: 20px" />
						{:else if submitted}
							<Fa icon={faCheck} />
						{:else}
							submit
						{/if}
					</Button>
				</div>
			</Content>
		</form>
	</Paper>
</div>

<style>
	:global(.contact-container) {
		padding: 1rem 2rem 1.5rem 2rem;
		margin: 0 2rem;
		border-radius: 0.75rem !important;
	}

	:global(.flex-container) {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.flex-cols {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 800px) {
		.flex-cols {
			flex-direction: row;
		}
		:global(.contact-container) {
			padding: 1rem 5rem 1.5rem 5rem;
			margin: 0 5rem;
		}
	}
	.header {
		margin: auto;
		display: block;
		width: fit-content;
		/* color: #c2c2c2; */
		font-size: calc(1.375rem + 1.5vw);
		font-weight: 500;
		line-height: 1.2;
	}

	.header::after {
		content: '';
		display: block;
		margin: 0.8rem auto;
		width: 75%;
		border-bottom: 0.2rem solid #4f4f4f;
	}
</style>
