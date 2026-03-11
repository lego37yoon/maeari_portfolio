import { describe, expect, it, vi } from 'vitest';

const { fetchNewsMock } = vi.hoisted(() => ({ fetchNewsMock: vi.fn() }));

vi.mock('../../../src/utils/news', () => ({
	fetchRssNewsFeed: fetchNewsMock
}));

import { GET } from '../../../src/routes/api/social/+server';

describe('GET /api/social', () => {
	it('returns social feed for supported type', async () => {
		fetchNewsMock.mockResolvedValueOnce({
			url: 'https://diary.paperbox.pe.kr/',
			posts: [
				{
					title: 't',
					link: 'https://diary.paperbox.pe.kr',
					pubDate: '2026.01.01',
					category: 'dev'
				}
			]
		});

		const response = await GET({
			url: new URL('https://example.com/api/social?type=tistory')
		} as any);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({
			url: 'https://diary.paperbox.pe.kr/',
			posts: [
				{
					title: 't',
					link: 'https://diary.paperbox.pe.kr',
					pubDate: '2026.01.01',
					category: 'dev'
				}
			]
		});
	});

	it('returns 400 when no supported type', async () => {
		await expect(
			GET({
				url: new URL('https://example.com/api/social?type=rssx')
			} as any)
		).rejects.toMatchObject({
			status: 400
		});
	});

	it('returns 400 when data is empty', async () => {
		fetchNewsMock.mockResolvedValueOnce({
			url: 'https://diary.paperbox.pe.kr/',
			posts: []
		});

		await expect(
			GET({
				url: new URL('https://example.com/api/social?type=tistory')
			} as any)
		).rejects.toMatchObject({
			status: 400
		});
	});
});
