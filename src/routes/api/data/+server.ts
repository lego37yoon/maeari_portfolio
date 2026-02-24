import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createFirebasePortfolioDataStore, isPortfolioDataType } from '../../../utils/data';

const store = createFirebasePortfolioDataStore();

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');
	if (!type || !isPortfolioDataType(type)) {
		error(400, '데이터 종류 설정이 잘못되었습니다. 관리자에게 문의하세요.');
	}

	const result = await store.fetch(type);

	return json(result.data);
};
