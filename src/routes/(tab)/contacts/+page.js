/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const fetchData = await fetch("/api/data?type=contact");

    return await fetchData.json();
}