import { fadeIn, fadeOut } from './fade-utils';

export async function changePage(href: string) {
	const container = document.querySelector('.container') as HTMLElement;
	await fadeOut(container, 300);
	document.querySelector(href)?.scrollIntoView({ behavior: 'auto' });
	await fadeIn(container, 300);
}
