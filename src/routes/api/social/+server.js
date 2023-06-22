import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    const type = url.searchParams.get("type");

    switch(type) {
        case "tistory":
            const token = import.meta.env.VITE_TISTORY_ACCESS_TOKEN;
            const handle = import.meta.env.VITE_TISTORY_BLOG_HANDLE;
            return new json(await tistory(token, handle));
        case "metaweblog":
        case "wordpress":
            throw error(400, "아직 지원하지 않는 API입니다.");
        default:
            throw error(400, "데이터 종류 설정이 잘못되었습니다. 관리자에게 문의하세요.");
    }
}

async function tistory(token, handle) {
    const fetchedData = await fetch(`https://www.tistory.com/apis/post/list?access_token=${token}&output=json&blogName=${handle}&page=1`);
    return await fetchedData.json();
}