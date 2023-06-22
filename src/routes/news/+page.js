/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const fetchData = await fetch("/api/social?type=tistory");

    return await fetchData.json();
}