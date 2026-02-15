import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const fetchData = await fetch('/api/data?type=contact');

	return await fetchData.json();
};
