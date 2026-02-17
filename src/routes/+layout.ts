import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	const fetchData = await fetch('/api/data?type=teaser');

	return await fetchData.json();
};
