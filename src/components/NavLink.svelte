<script lang="ts">
	import Button from '@smui/button';
	import { changePage } from '../lib/page';
	export let href: string;
	$: modifiedHref = href === '/' ? '#home' : `#${href}`;
	let active: boolean;
	let y: number;

	function onScroll() {
		const section = document.getElementById(modifiedHref) as HTMLElement;
		const fromTop = y;
		if (
			section.offsetTop <= fromTop + 56.286 &&
			section.offsetTop + section.offsetHeight >= fromTop + 56.286
		) {
			active = true;
		} else {
			active = false;
		}
	}

	function onClick(e: CustomEvent<any>) {
		e.preventDefault();
		changePage(modifiedHref);
	}
</script>

<svelte:window bind:scrollY={y} on:scroll={onScroll} />

<Button variant={active ? 'unelevated' : 'text'} ripple={false} on:click={onClick} {href}
	><slot /></Button
>
