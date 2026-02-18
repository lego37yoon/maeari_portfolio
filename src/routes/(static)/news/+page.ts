import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const postData = await fetch('/api/social?type=tistory');
	const postJson = await postData.json();

	if (!postData.ok) {
		throw error(500, '오류가 발생하였습니다.');
	}

	return postJson;
};
