import type { LayoutLoad } from './$types';
import { filterRecentNewsPosts, type NewsPost } from '../../utils/news';

export const load: LayoutLoad = async ({ fetch }) => {
	const fetchData = await fetch('/api/data?type=teaser');
	const data = await fetchData.json();
	let newsPosts: Array<NewsPost> = [];

	try {
		const rawData = await fetch('/api/social?type=tistory&maxPosts=3&maxOpenGraphLookups=3');
		const socialData = await rawData.json();
		if (rawData.ok && Array.isArray(socialData?.posts)) {
			newsPosts = filterRecentNewsPosts(socialData.posts, new Date(), 3, 3);
		}
	} catch {
		newsPosts = [];
	}

	return {
		...data,
		...(newsPosts.length ? { newsPosts } : {})
	};
};
