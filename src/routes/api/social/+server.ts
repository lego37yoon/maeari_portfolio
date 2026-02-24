import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchRssNewsFeed } from '../../../utils/news';

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');
	const maxPostsRaw = Number(url.searchParams.get('maxPosts'));
	const maxPosts = Number.isFinite(maxPostsRaw) && maxPostsRaw > 0 ? Math.floor(maxPostsRaw) : 5;
	const maxOpenGraphLookupsRaw = Number(url.searchParams.get('maxOpenGraphLookups'));
	const maxOpenGraphLookups = Number.isFinite(maxOpenGraphLookupsRaw) && maxOpenGraphLookupsRaw > 0
		? Math.floor(maxOpenGraphLookupsRaw)
		: undefined;

	switch (type) {
		case 'tistory':
		case 'rss': {
			const raw = await fetchRssNewsFeed({
				rssUrl: import.meta.env.VITE_RSS_URL,
				customDomain: import.meta.env.VITE_RSS_CUSTOM_URL,
				maxPosts,
				maxOpenGraphLookups
			});

			if (!raw.posts || raw.posts.length === 0) {
				error(400, '데이터 종류 설정이 잘못되었습니다. 관리자에게 문의하세요.');
			}

			return json(raw);
		}
	}

	error(400, '데이터 종류 설정이 잘못되었습니다. 관리자에게 문의하세요.');
};
