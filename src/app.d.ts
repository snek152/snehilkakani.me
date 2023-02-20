/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}

declare namespace svelte.JSX {
	interface DOMAttributes<T> {
		onclick_outside?: CompositionEventHandler<T>;
	}
}

declare module 'svelte-carousel';

declare module 'svelte-simple-icons';
