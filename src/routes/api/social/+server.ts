import { error, json } from '@sveltejs/kit';
import { XMLParser } from 'fast-xml-parser';
import type { RequestHandler } from './$types';

interface RSSPost {
	pubDate: string;
	link: string;
	[key: string]: unknown;
}

interface RSSChannel {
	link: string;
	item: RSSPost[];
}

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');

	switch (type) {
		case 'tistory':
		case 'rss': {
			const rawData = await fetch(import.meta.env.VITE_RSS_URL).then((res) => res.text());
			const customDomain = import.meta.env.VITE_RSS_CUSTOM_URL;
			const parser = new XMLParser();
			const parsedData = parser.parse(rawData).rss.channel as RSSChannel;

			if (parsedData.item.length > 0) {
				if (customDomain) {
					parsedData.item.forEach((item) => {
						item.link = item.link.replace(parsedData.link, customDomain.endsWith('/') ? customDomain : `${customDomain}/`);
					});
				}

				const posts = parsedData.item.map((post) => {
					const postDate = new Date(Date.parse(post.pubDate));
					const localPostDate = postDate.toLocaleString('ko-KR');

					if (customDomain) {
						return {
							...post,
							pubDate: localPostDate,
							link: post.link.replace(parsedData.link, customDomain.endsWith('/') ? customDomain : `${customDomain}/`)
						};
					}

					return { ...post, pubDate: localPostDate };
				});

				return json({
					url: customDomain ?? parsedData.link,
					posts: posts.slice(0, 5)
				});
			}
	}

	error(400, '데이터 종류 설정이 잘못되었습니다. 관리자에게 문의하세요.');
};
