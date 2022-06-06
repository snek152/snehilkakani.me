<script lang="ts">
	import Paper, { Content } from '@smui/paper';
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
				<div class="col-2" />
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
</style>
