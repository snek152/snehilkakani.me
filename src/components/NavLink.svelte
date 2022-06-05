<script lang="ts">
	import Button from '@smui/button';
	import { onMount } from 'svelte';
	import { changePage } from '../lib/page';
	export let href: string;
	$: modifiedHref = href === '/' ? '#' : `#${href}`;
	let active: boolean;
	onMount(() => {
		window.addEventListener('scroll', () => {
			const section = document.getElementById(modifiedHref) as HTMLElement;
			const fromTop = window.scrollY;
			if (
				section.offsetTop <= fromTop + 56.286 &&
				section.offsetTop + section.offsetHeight >= fromTop + 56.286
			) {
				active = true;
			} else {
				active = false;
			}
		});
	});
</script>

<Button
	variant={active ? 'unelevated' : 'text'}
	ripple={false}
	on:click={() => changePage(modifiedHref)}
	{href}><slot /></Button
>
