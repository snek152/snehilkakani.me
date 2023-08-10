<script>
	import AudioPlayer from '../components/AudioPlayer.svelte';
</script>

<div id="music" class="section">
	<h1 class="header">Music Portfolio</h1>
	<AudioPlayer />
</div>

<style>
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
</style>
