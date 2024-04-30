import { error, json } from '@sveltejs/kit';
import { XMLParser } from "fast-xml-parser";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    const type = url.searchParams.get("type");

    switch(type) {
        case "tistory":
        case "rss":
            const rawData = await fetch(import.meta.env.VITE_RSS_URL).then(async (res) => await res.text());
            const customDomain = import.meta.env.VITE_RSS_CUSTOM_URL;
            const parser = new XMLParser();
            const parsedData = parser.parse(rawData).rss.channel;

            if (parsedData.item.length > 0) {
                if (customDomain) {
                    
                    parsedData.item.forEach(item => {
                        item.link.replace(parsedData.link, 
                            customDomain.endsWith("/") ? customDomain : `${customDomain}/`);
                    });
                }

                return new json({
                    url: customDomain ?? parsedData.link,
                    posts: parsedData.item.map((post) => {
                        const postDate = new Date(Date.parse(post.pubDate));
                        const localPostDate = postDate.toLocaleString("ko-KR");

                        if (customDomain) {
                            return {
                                ...post,
                                pubDate: localPostDate,
                                link: post.link.replace(parsedData.link, customDomain.endsWith("/") ? customDomain : `${customDomain}/`)
                            }
                        } else {
                            return {...post, pubDate: localPostDate}
                        }
                    }).slice(0, 5)
                });
            } 
        default:
            error(400, "데이터 종류 설정이 잘못되었습니다. 관리자에게 문의하세요.");
    }
}