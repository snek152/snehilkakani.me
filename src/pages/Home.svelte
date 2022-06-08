<script lang="ts">
	import FloatingIcon from '../components/FloatingIcon.svelte';
	import Fa from 'svelte-fa';
	import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
	import { faPenNib } from '@fortawesome/free-solid-svg-icons/faPenNib';
	import { faDrum } from '@fortawesome/free-solid-svg-icons/faDrum';
	import { faTheaterMasks } from '@fortawesome/free-solid-svg-icons/faTheaterMasks';
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
