<script lang="ts">
	import { activePage } from '$lib/stores';

	import Button from '@smui/button';
	import { onMount } from 'svelte';
	import { changePage } from '../lib/page';
	export let href: string;
	$: modifiedHref = href === '/' ? '#home' : `#${href}`;
	let active: boolean;
	let y: number;

	activePage.subscribe((v) => {
		active = v === href;
	});

	function onScroll(adjustedY?: number) {
		const section = document.querySelector(modifiedHref) as HTMLElement;
		const fromTop = adjustedY || y;
		if (section === null) return;
		if (
			section.offsetTop - 65 <= fromTop &&
			section.offsetTop + section.offsetHeight - 64 >= fromTop
		) {
			activePage.set(href);
		}
	}

	function onClick(e: CustomEvent<any>) {
		e.preventDefault();
		changePage(modifiedHref).then(() => {
			onScroll();
		});
	}

	onMount(() => {
		onScroll();
	});
</script>

<svelte:window bind:scrollY={y} on:scroll={() => onScroll()} />

<Button variant={active ? 'unelevated' : 'text'} ripple={false} on:click={onClick} {href}
	><slot /></Button
>
