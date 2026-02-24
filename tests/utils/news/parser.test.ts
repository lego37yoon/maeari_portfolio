import { describe, expect, it } from 'vitest';
import { applyCustomDomain, buildNewsPosts, filterRecentNewsPosts, limitPosts, parseRssFeed } from '../../../src/utils/news/parser';

describe('parseRssFeed', () => {
	it('extracts RSS posts and normalizes pubDate', () => {
		const xml = `
			<rss><channel>
				<link>https://diary.paperbox.pe.kr/</link>
				<item>
					<title>첫 번째</title>
					<link>https://diary.paperbox.pe.kr/posts/1</link>
					<pubDate>2025-01-01T00:00:00+09:00</pubDate>
				</item>
			</channel></rss>`;

		const parsed = parseRssFeed(xml);
		const feed = buildNewsPosts(parsed);

		expect(parsed.rss?.channel?.link).toBe('https://diary.paperbox.pe.kr/');
		expect(feed.posts).toHaveLength(1);
		expect(feed.posts[0].title).toBe('첫 번째');
		expect(feed.posts[0].link).toBe('https://diary.paperbox.pe.kr/posts/1');
		expect(feed.posts[0].pubDate).toBeTruthy();
	});
});

describe('news feed utilities', () => {
	it('replaces custom domain and limits post count', () => {
		const feed = {
			url: 'https://diary.paperbox.pe.kr/',
			posts: [
				{ title: 'a', link: 'https://diary.paperbox.pe.kr/posts/1', pubDate: 'a', category: 'cat' },
				{ title: 'b', link: 'https://diary.paperbox.pe.kr/posts/2', pubDate: 'a', category: 'cat' }
			]
		};

		const replaced = applyCustomDomain(feed, 'https://example.com/');
		const limited = limitPosts(replaced, 1);

		expect(limited.posts).toHaveLength(1);
		expect(limited.posts[0].link).toBe('https://example.com/posts/1');
	});

	it('builds preview text and extracts thumbnail from media thumbnail', () => {
		const xml = `
			<rss><channel>
				<link>https://diary.paperbox.pe.kr/</link>
				<item>
					<title>썸네일 테스트</title>
					<link>https://diary.paperbox.pe.kr/posts/3</link>
					<media:thumbnail url="https://example.com/thumb.png" />
					<pubDate>2025-10-01T00:00:00+09:00</pubDate>
					<description><p><img src="https://example.com/thumb.png" />내용입니다.</p></description>
				</item>
			</channel></rss>`;

		const parsed = parseRssFeed(xml);
		const feed = buildNewsPosts(parsed);

		expect(feed.posts).toHaveLength(1);
		expect(feed.posts[0].thumbnail).toBe('https://example.com/thumb.png');
		expect(feed.posts[0].description).toBe('내용입니다.');
	});

	it('does not use description HTML as thumbnail when no real thumbnail node exists', () => {
		const xml = `
			<rss><channel>
				<link>https://diary.paperbox.pe.kr/</link>
				<item>
					<title>썸네일 없음</title>
					<link>https://diary.paperbox.pe.kr/posts/4</link>
					<pubDate>2025-10-01T00:00:00+09:00</pubDate>
					<description><![CDATA[<p>이미지 없는 본문입니다.</p>]]></description>
				</item>
			</channel></rss>`;

		const parsed = parseRssFeed(xml);
		const feed = buildNewsPosts(parsed);

		expect(feed.posts[0].thumbnail).toBe('');
	});

	it('filters posts within recent months and limits count', () => {
		const now = new Date('2026-02-19T12:00:00.000Z');
		const posts = [
			{
				title: 'old',
				link: 'https://example.com/1',
				pubDate: '2025-08-01T00:00:00+09:00',
				pubDateTimestamp: new Date('2025-08-01T00:00:00+09:00').getTime()
			},
			{
				title: 'new1',
				link: 'https://example.com/2',
				pubDate: '2026-02-01T00:00:00+09:00',
				pubDateTimestamp: new Date('2026-02-01T00:00:00+09:00').getTime()
			},
			{
				title: 'new2',
				link: 'https://example.com/3',
				pubDate: '2026-01-10T00:00:00+09:00',
				pubDateTimestamp: new Date('2026-01-10T00:00:00+09:00').getTime()
			},
			{
				title: 'new3',
				link: 'https://example.com/4',
				pubDate: '2026-01-20T00:00:00+09:00',
				pubDateTimestamp: new Date('2026-01-20T00:00:00+09:00').getTime()
			},
			{
				title: 'new4',
				link: 'https://example.com/5',
				pubDate: '2026-01-22T00:00:00+09:00',
				pubDateTimestamp: new Date('2026-01-22T00:00:00+09:00').getTime()
			}
		];

		const filtered = filterRecentNewsPosts(posts, now, 3, 3);
		const titles = filtered.map((post) => post.title);

		expect(filtered).toHaveLength(3);
		expect(titles[0]).toBe('new1');
		expect(titles[1]).toBe('new4');
		expect(titles[2]).toBe('new3');
	});
});
