import { fadeIn, fadeOut } from './fade-utils';

export async function changePage(href: string) {
	const container = document.querySelector('.container') as HTMLElement;
	await fadeOut(container, 750);
	document.getElementById(href)?.scrollIntoView({ behavior: 'auto' });
	await fadeIn(container, 750);
}
