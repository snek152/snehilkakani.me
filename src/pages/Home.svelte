<script lang="ts">
	import FloatingIcon from '../components/FloatingIcon.svelte';
	import FaCode from 'svelte-icons/fa/FaCode.svelte';
	import FaPenNib from 'svelte-icons/fa/FaPenNib.svelte';
	import FaDrum from 'svelte-icons/fa/FaDrum.svelte';
	import FaTheaterMasks from 'svelte-icons/fa/FaTheaterMasks.svelte';
</script>

<div id="home">
	<FloatingIcon>
		<FaCode />
	</FloatingIcon>
	<FloatingIcon>
		<FaPenNib />
	</FloatingIcon>
	<FloatingIcon>
		<FaDrum />
	</FloatingIcon>
	<FloatingIcon>
		<FaTheaterMasks />
	</FloatingIcon>
</div>

<style>
	#home {
		background: url('/images/Snehil Kakani.webp') content-box no-repeat fixed;
		background-position: center;
		background-size: cover;
		min-height: calc(100vh - 64px);
	}
</style>
