import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const config = defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			strict: false,
		}
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/vitest-setup.ts']
	}
});

export default config;
