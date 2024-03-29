/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const projectData = await fetch("/api/data?type=project");
    const contributionData = await fetch("/api/data?type=contribution");
    const activityData = await fetch("/api/data?type=activity");

    const combinedData = {
        project: await projectData.json(),
        contribution: await contributionData.json(),
        activity: await activityData.json()
    }

    return combinedData;
}