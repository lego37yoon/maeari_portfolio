import { describe, expect, it } from 'vitest';
import { buildTeaserPayload } from '../../../src/utils/teaser/builder';

describe('buildTeaserPayload', () => {
	it('returns default notice payload when no input is provided', () => {
		const result = buildTeaserPayload();

		expect(result.intro?.title).toBe('안녕하세요,');
		expect(result.notice?.data.length).toBeGreaterThan(0);
	});

	it('keeps provided notice data when valid', () => {
		const result = buildTeaserPayload({
			notice: {
				data: [
				{
					background: 'transparent',
					text: 'hello',
					desc: 'world',
					enabled: true
				}
			]
			}
		});

		expect(result.notice?.data).toEqual([
			{
				background: 'transparent',
				text: 'hello',
				desc: 'world',
				enabled: true
			}
		]);
	});

	it('appends news posts as additional notice items', () => {
		const result = buildTeaserPayload({
			newsPosts: [
				{
					title: '블로그 소식',
					link: 'https://example.com',
					pubDate: '2026-01-01',
					category: 'dev',
					description: '요약 텍스트',
					thumbnail: 'https://example.com/thumbnail.png'
				}
			]
		});

		const titles = result.notice?.data.map((item) => item.text);
		expect(titles).toContain('블로그 소식');
		const mapped = result.notice?.data.find((item) => item.text === '블로그 소식');
		expect(mapped?.desc).toBe('요약 텍스트');
		expect(mapped?.link).toBe('https://example.com');
		expect(mapped?.background).toBe('url("https://example.com/thumbnail.png")');
		expect(mapped?.['link-title']).toBe('더 읽어보기');
	});
});
