import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const postData = await fetch("/api/social?type=tistory");
    const postJson = await postData.json();
    
    if (!postData.ok) {
        return error(postData.status, "오류가 발생하였습니다.");
    } else {
        return postJson;
    }
}
