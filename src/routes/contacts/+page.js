/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const fetchData = await fetch("/api/data?type=contacts");

    return await fetchData.json();
}