import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from "mdsvex";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	compilerOptions: {
		runes: true
	},
	preprocess: [
		mdsvex({
			extensions: ['.md']
		}),
		vitePreprocess()
	],
	kit: {
		adapter: adapter()
	}
};

export default config;
