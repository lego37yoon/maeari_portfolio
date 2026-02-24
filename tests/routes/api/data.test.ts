import { describe, expect, it, vi } from 'vitest';

const { createStoreMock } = vi.hoisted(() => ({ createStoreMock: vi.fn() }));

vi.mock('../../../src/utils/data', () => ({
	createFirebasePortfolioDataStore: () => ({
		fetch: createStoreMock
	}),
	isPortfolioDataType: (value: string) => value === 'project' || value === 'teaser'
}));

import { GET } from '../../../src/routes/api/data/+server';

describe('GET /api/data', () => {
	it('returns data from store when type is valid', async () => {
		createStoreMock.mockResolvedValueOnce({
			mode: 'array',
			data: [
				{
					id: '1',
					data: { title: 'demo' }
				}
			]
		});

		const response = await GET({
			url: new URL('https://example.com/api/data?type=project')
		} as any);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual([
			{
				id: '1',
				data: { title: 'demo' }
			}
		]);
	});

	it('returns 400 when type is invalid', async () => {
		await expect(
			GET({
				url: new URL('https://example.com/api/data?type=invalid')
			} as any)
		).rejects.toMatchObject({
			status: 400
		});
	});
});
