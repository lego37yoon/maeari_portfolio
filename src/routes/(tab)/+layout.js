/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch }) {
    const fetchData = await fetch("/api/data?type=teaser");

    return await fetchData.json();
}