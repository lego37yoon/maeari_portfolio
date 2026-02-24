import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRssNewsFeed } from '../../../src/utils/news/fetcher';

const makeResponse = (value: string, status = 200) => new Response(value, { status });

describe('fetchRssNewsFeed', () => {
	let originalFetch: typeof fetch;
	let fetchImpl: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		fetchImpl = vi.fn();
		originalFetch = globalThis.fetch;
		globalThis.fetch = fetchImpl as typeof fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('extracts og:image from post page when thumbnail is missing', async () => {
		fetchImpl
			.mockResolvedValueOnce(
				makeResponse(`
					<rss><channel>
						<link>https://diary.paperbox.pe.kr/</link>
						<item>
							<title>오픈그래프 썸네일</title>
							<link>https://diary.paperbox.pe.kr/posts/1</link>
							<pubDate>2026-02-01T00:00:00+09:00</pubDate>
						</item>
					</channel></rss>
				`)
			)
			.mockResolvedValueOnce(
				makeResponse(`
					<html><head><meta property="og:image" content="/assets/thumb.jpg"></head><body/></html>
				`)
			);

		const result = await fetchRssNewsFeed({
			rssUrl: 'https://diary.paperbox.pe.kr/feed',
			maxPosts: 1,
			maxOpenGraphLookups: 1
		});

		expect(fetchImpl).toHaveBeenCalledTimes(2);
		expect(result.posts[0]).toMatchObject({
			title: '오픈그래프 썸네일',
			link: 'https://diary.paperbox.pe.kr/posts/1',
			thumbnail: 'https://diary.paperbox.pe.kr/assets/thumb.jpg'
		});
	});

	it('keeps existing thumbnail when provided', async () => {
		fetchImpl.mockResolvedValueOnce(
			makeResponse(`
				<rss><channel>
					<link>https://diary.paperbox.pe.kr/</link>
					<item>
						<title>이미지 있는 글</title>
						<link>https://diary.paperbox.pe.kr/posts/2</link>
						<media:thumbnail url="https://diary.paperbox.pe.kr/exists.jpg" />
						<pubDate>2026-02-01T00:00:00+09:00</pubDate>
					</item>
				</channel></rss>
			`)
		);

		const result = await fetchRssNewsFeed({
			rssUrl: 'https://diary.paperbox.pe.kr/feed',
			maxPosts: 1
		});

		expect(result.posts[0]).toMatchObject({
			title: '이미지 있는 글',
			thumbnail: 'https://diary.paperbox.pe.kr/exists.jpg'
		});
		expect(fetchImpl).toHaveBeenCalledTimes(1);
	});

	it('ignores invalid or missing og image and returns no thumbnail', async () => {
		fetchImpl
			.mockResolvedValueOnce(
				makeResponse(`
					<rss><channel>
						<link>https://diary.paperbox.pe.kr/</link>
						<item>
							<title>이미지 없음</title>
							<link>https://diary.paperbox.pe.kr/posts/3</link>
							<pubDate>2026-02-01T00:00:00+09:00</pubDate>
						</item>
					</channel></rss>
			`)
			)
			.mockResolvedValueOnce(makeResponse('<html><body>no image</body></html>'));

		const result = await fetchRssNewsFeed({
			rssUrl: 'https://diary.paperbox.pe.kr/feed',
			maxPosts: 1,
			maxOpenGraphLookups: 1
		});

		expect(result.posts[0].thumbnail).toBe('');
	});

	it('does not use body image tag when OG tags are absent', async () => {
		fetchImpl
			.mockResolvedValueOnce(
				makeResponse(`
					<rss><channel>
						<link>https://diary.paperbox.pe.kr/</link>
						<item>
							<title>본문 이미지만 있는 글</title>
							<link>https://diary.paperbox.pe.kr/posts/4</link>
							<pubDate>2026-02-01T00:00:00+09:00</pubDate>
						</item>
					</channel></rss>
			`)
			)
			.mockResolvedValueOnce(
				makeResponse(`
					<html><head><meta property="og:title" content="제목"></head>
						<body><img src="https://diary.paperbox.pe.kr/fallback.png"></body></html>
					</html>
				`)
			);

		const result = await fetchRssNewsFeed({
			rssUrl: 'https://diary.paperbox.pe.kr/feed',
			maxPosts: 1,
			maxOpenGraphLookups: 1
		});

		expect(result.posts[0].thumbnail).toBe('');
	});
});
