export async function changePage(href: string) {
	const container = document.querySelector('.container') as HTMLElement;
	await fadeOut(container, 750);
	document.getElementById(href)?.scrollIntoView({ behavior: 'auto' });
	await fadeIn(container, 750);
}

function defaultFadeConfig(): KeyframeAnimationOptions {
	return {
		easing: 'linear',
		iterations: 1,
		direction: 'normal',
		fill: 'forwards',
		delay: 0,
		endDelay: 0
	};
}

async function fadeOut(
	el: HTMLElement,
	durationInMs: number,
	config = defaultFadeConfig()
): Promise<void> {
	return new Promise((resolve) => {
		const animation = el.animate(
			[{ opacity: '1' }, { opacity: '0', offset: 0.5 }, { opacity: '0', offset: 1 }],
			{ duration: durationInMs, ...config }
		);
		animation.onfinish = () => resolve();
	});
}

async function fadeIn(
	el: HTMLElement,
	durationInMs: number,
	config = defaultFadeConfig()
): Promise<void> {
	return new Promise((resolve) => {
		const animation = el.animate(
			[{ opacity: '0' }, { opacity: '0.5', offset: 0.5 }, { opacity: '1', offset: 1 }],
			{ duration: durationInMs, ...config }
		);
		animation.onfinish = () => resolve();
	});
}
