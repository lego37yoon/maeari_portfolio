import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const contributionData = await fetch('/api/data?type=contribution');
	const activityData = await fetch('/api/data?type=activity');

	const combinedData = {
		contribution: await contributionData.json(),
		activity: await activityData.json()
	};

	return combinedData;
};
