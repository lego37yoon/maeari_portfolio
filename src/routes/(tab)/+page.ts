import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const projectData = await fetch('/api/data?type=project');

	const combinedData = {
		project: await projectData.json(),
	};

	return combinedData;
};
