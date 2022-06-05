<script>
	import Navbar from '../components/Navbar.svelte';
</script>

<Navbar />
<div class="container"><slot /></div>

<style>
	:global(body) {
		margin: 0;
	}
	:global(:root) {
		--width-sm: 640px;
		--width-md: 768px;
		--width-lg: 1024px;
		--width-xl: 1280px;
	}

	:global(h1, h2, h3, h4, h3 > *) {
		font-family: 'Red Hat Display' !important;
	}

	:global(*) {
		font-family: 'IBM Plex Sans' !important;
	}
</style>
