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
					pubDateTimestamp: new Date('2026-01-01T00:00:00+09:00').getTime(),
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
		expect(mapped?.source).toBe('news');
		expect(mapped?.date).toBe('2026년 1월 1일');
		expect(mapped?.['link-title']).toBe('더 읽어보기');
	});

	it('keeps existing notice dates for Firebase-provided notices', () => {
		const result = buildTeaserPayload({
			notice: {
				data: [
					{
						background: 'linear-gradient(45deg, #123456, #654321)',
						text: '점검 안내',
						desc: '서버 점검이 진행됩니다.',
						enabled: true,
						date: '2026-01-01',
						'link-title': '자세히 보기'
					}
				]
			}
		});

		const mapped = result.notice?.data[0];
		expect(mapped?.date).toBe('2026-01-01');
		expect(mapped?.source).toBeUndefined();
	});

	it('falls back to pubDate when pubDateTimestamp is missing', () => {
		const result = buildTeaserPayload({
			newsPosts: [
				{
					title: '타임스탬프 없는 소식',
					link: 'https://example.com/no-timestamp',
					pubDate: '2026-03-08',
					category: 'dev'
				}
			]
		});

		const mapped = result.notice?.data.find((item) => item.text === '타임스탬프 없는 소식');
		expect(mapped?.date).toBe('2026년 3월 8일');
		expect(mapped?.source).toBe('news');
	});

	it('falls back to pubDate when pubDate value is an RFC date string', () => {
		const result = buildTeaserPayload({
			newsPosts: [
				{
					title: 'RFC 날짜',
					link: 'https://example.com/rss-date',
					pubDate: 'Sun, 11 Jan 2026 05:32:43 +0900',
					category: 'dev'
				}
			]
		});

		const mapped = result.notice?.data.find((item) => item.text === 'RFC 날짜');
		expect(mapped?.date).toBe('2026년 1월 11일');
		expect(mapped?.source).toBe('news');
	});
});
