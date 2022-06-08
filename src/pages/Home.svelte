<script lang="ts">
	import FloatingIcon from '../components/FloatingIcon.svelte';
	import Fa from 'svelte-fa';
	import { faCode, faDrum, faPenNib, faTheaterMasks } from '@fortawesome/free-solid-svg-icons';
	// import FaCode from 'svelte-icons/fa/FaCode.svelte';
	// import FaPenNib from 'svelte-icons/fa/FaPenNib.svelte';
	// import FaDrum from 'svelte-icons/fa/FaDrum.svelte';
	// import FaTheaterMasks from 'svelte-icons/fa/FaTheaterMasks.svelte';
</script>

<div id="home" class="section">
	<FloatingIcon>
		<Fa icon={faCode} size="3x" />
	</FloatingIcon>
	<FloatingIcon>
		<Fa icon={faPenNib} size="3x" />
	</FloatingIcon>
	<FloatingIcon>
		<Fa icon={faDrum} size="3x" />
	</FloatingIcon>
	<FloatingIcon>
		<Fa icon={faTheaterMasks} size="3x" />
	</FloatingIcon>
</div>

<style>
	#home {
		background: url('/images/Snehil Kakani.webp') content-box no-repeat fixed;
		background-position: center;
		background-size: cover;
		min-height: calc(100vh - 64px);
	}
	@media only screen and (max-width: 991px) {
		#home {
			background-size: cover;
			background-position: center;
			background-origin: content-box;
			background-repeat: no-repeat;
			background-attachment: scroll;
			min-height: 50vh;
			height: 50vh;
			width: 100%;
		}
	}
</style>
