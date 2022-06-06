import { writable } from 'svelte/store';

const createWritableStore = <T>(key: string, startValue: T) => {
	const { subscribe, set } = writable(startValue);

	return {
		subscribe,
		set,
		useLocalStorage: () => {
			const json = localStorage.getItem(key);
			if (json) {
				set(JSON.parse(json));
			}

			subscribe((current) => {
				localStorage.setItem(key, JSON.stringify(current));
			});
		}
	};
};

export const activePage = writable('/');

export const theme = createWritableStore('theme', { mode: 'light' });
