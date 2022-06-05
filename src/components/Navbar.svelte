<script lang="ts">
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import NavLink from './NavLink.svelte';
</script>

<TopAppBar variant="static" color="secondary">
	<Row>
		<Section>
			<Title>Flex Static</Title>
		</Section>
		<Section align="end">
			<NavLink href="#">Home</NavLink>
		</Section>
	</Row>
</TopAppBar>
