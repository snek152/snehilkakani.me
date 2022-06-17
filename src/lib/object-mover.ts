type Loc = {
	x: number;
	y: number;
};

class RandomObjectMover {
	$object: HTMLElement;
	$container: HTMLElement;
	container_is_window = false;
	pixels_per_second = 75;
	current_position: Loc = {
		x: Math.floor(Math.random() * 1000),
		y: Math.floor(Math.random() * 1000)
	};
	is_running = false;
	boundEvent: () => void;
	constructor(obj: HTMLElement, container: HTMLElement) {
		this.$object = obj;
		this.$container = container;
		this.boundEvent = this._moveOnce.bind(this);
	}

	setSpeed(pxPerSec: number) {
		this.pixels_per_second = pxPerSec;
	}

	_getContainerDimensions() {
		return {
			height: this.$container.clientHeight,
			width: this.$container.clientWidth
		};
	}

	_generateNewPosition(): Loc {
		const containerSize = this._getContainerDimensions();
		const availableHeight = containerSize.height - this.$object.clientHeight;
		const availableWidth = containerSize.width - this.$object.clientHeight;

		const y = Math.floor(Math.random() * availableHeight);
		const x = Math.floor(Math.random() * availableWidth);

		return { x, y };
	}

	_calcDelta(a: Loc, b: Loc) {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	_moveOnce() {
		const next = this._generateNewPosition();
		const delta = this._calcDelta(this.current_position, next);
		const speed = Math.round((delta / this.pixels_per_second) * 100) / 100;
		this.$object.style.transition = `transform ${speed}s linear`;
		this.$object.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
		this.current_position = next;
	}

	start() {
		if (this.is_running) {
			return;
		}
		// this.$object.willChange = 'transform';
		// this.$object.pointerEvents = 'auto';

		this.boundEvent = this._moveOnce.bind(this);

		this.$object.addEventListener('transitionend', this.boundEvent);

		this._moveOnce();

		this.is_running = true;
	}

	stop() {
		if (!this.is_running) {
			return;
		}

		this.$object.removeEventListener('transitionend', this.boundEvent);

		this.is_running = false;
	}
}

export default RandomObjectMover;
