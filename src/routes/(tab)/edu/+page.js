/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const educationData = await fetch("/api/data?type=education");
    const certificationData = await fetch("/api/data?type=certification");

    const combinedData = {
        education: await educationData.json(),
        certification: await certificationData.json()
    }

    return combinedData;
}