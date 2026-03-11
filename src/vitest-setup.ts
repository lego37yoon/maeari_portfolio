import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';

class ResizeObserverMock {
	target: unknown;
	observe() {}
	unobserve() {}
	disconnect() {}
}

class IntersectionObserverMock {
	constructor() {}
	observe() {}
	unobserve() {}
	disconnect() {}
}

afterEach(() => {
	cleanup();
});

if (!('matchMedia' in window)) {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: (query: string) => ({
			media: query,
			matches: false,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false
		})
	});
}

if (!(globalThis as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver) {
	(globalThis as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
}

if (!(globalThis as unknown as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver) {
	(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;
}
