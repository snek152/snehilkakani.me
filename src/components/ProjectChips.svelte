<script lang="ts">
	import Chip, { Set, Text } from '@smui/chips';

	export let subheaders: string[];
</script>

<Set chips={subheaders} let:chip nonInteractive class="chips">
	<Chip {chip}>
		<Text>{chip}</Text>
	</Chip>
</Set>

<style>
	:global(.mdc-chip__text) {
		font-size: 12px;
	}

	:global(.mdc-chip) {
		height: 20px;
	}

	:global(.chips) {
		justify-content: center;
	}
</style>
