<script lang="ts">
	import Chip, { Set, Text } from '@smui/chips';

	export let subheaders: string[];
</script>

<Set chips={subheaders} let:chip nonInteractive class="chips">
	<Chip {chip}>
		<Text>{chip}</Text>
	</Chip>
</Set>
