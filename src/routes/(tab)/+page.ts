import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const projectData = await fetch('/api/data?type=project');

	const projectList = await projectData.json();

	const project = {
		active: projectList.filter((item) => item.data.status == "active"),
		in_development: projectList.filter((item) => item.data.status == "in_development"),
		maintenance: projectList.filter((item) => item.data.status == "maintenance"),
		deprecated: [
			...projectList.filter((item) => item.data.status == "deprecated"),
		]
	};

	return project;
};
