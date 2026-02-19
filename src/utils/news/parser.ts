import { XMLParser } from 'fast-xml-parser';
import { type NewsFeedResult, type NewsPost, type RSSFeed } from './types';

const parser = new XMLParser({ ignoreAttributes: false });

function resolveItems(rawItems: unknown): Array<Record<string, unknown>> {
	if (!rawItems) {
		return [];
	}
	if (Array.isArray(rawItems)) {
		return rawItems as Array<Record<string, unknown>>;
	}
	return [rawItems as Record<string, unknown>];
}

function toStringValue(value: unknown): string {
	return typeof value === 'string' ? value : '';
}

function toRecord(value: unknown): Record<string, unknown> | null {
	return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function sanitizeText(raw: string): string {
	return raw
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, ' ')
		.trim();
}

function buildTextPreview(raw: string, maxLength = 140): string {
	const normalized = sanitizeText(raw);
	if (normalized.length <= maxLength) {
		return normalized;
	}
	return `${normalized.slice(0, maxLength).trim()}…`;
}

function pickFirstString(value: unknown): string {
	for (const candidate of Array.isArray(value) ? value : [value]) {
		if (typeof candidate === 'string') {
			return candidate;
		}
	}
	return '';
}

function pickUrlFromNode(value: unknown): string {
	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (!trimmed) {
			return '';
		}

		// Prevent raw HTML/CDATA text from being treated as an image URL.
		if (trimmed.startsWith('<')) {
			return '';
		}

		if (/^(https?:\/\/|\/|\.\.\/|\.\/)/i.test(trimmed)) {
			return trimmed;
		}

		return '';
	}

	const record = toRecord(value);
	if (!record) {
		return '';
	}

	return (
		toStringValue(record.url) ||
		toStringValue(record.href) ||
		toStringValue(record.src) ||
		toStringValue(record['@_url']) ||
		toStringValue(record['@_href']) ||
		toStringValue(record['@_src']) ||
		''
	);
}

function collectTextContent(value: unknown): string[] {
	if (typeof value === 'string') {
		return [value];
	}
	if (Array.isArray(value)) {
		return value.flatMap(collectTextContent);
	}
	const record = toRecord(value);
	if (!record) {
		return [];
	}

	const results = [];
	for (const [key, nested] of Object.entries(record)) {
		if (key === '#text') {
			const text = toStringValue(nested);
			if (text) {
				results.push(text);
			}
			continue;
		}
		if (key.startsWith('@_')) {
			continue;
		}
		results.push(...collectTextContent(nested));
	}
	return results;
}

function collectImageFromUnknown(value: unknown): string {
	const direct = pickUrlFromNode(value);
	if (direct) {
		return direct;
	}

	if (Array.isArray(value)) {
		for (const nested of value) {
			const nestedUrl = collectImageFromUnknown(nested);
			if (nestedUrl) {
				return nestedUrl;
			}
		}
		return '';
	}

	const record = toRecord(value);
	if (!record) {
		return '';
	}

	for (const nested of Object.values(record)) {
		const nestedUrl = collectImageFromUnknown(nested);
		if (nestedUrl) {
			return nestedUrl;
		}
	}

	return '';
}

function extractThumbnail(rawPost: Record<string, unknown>): string {
	const candidates = [
		rawPost['media:thumbnail'],
		rawPost['media:content'],
		rawPost.enclosure,
		rawPost.image
	];

	for (const candidate of candidates) {
		const url = collectImageFromUnknown(candidate);
		if (url) {
			return url;
		}
	}

	return '';

}

function extractDescription(rawPost: Record<string, unknown>): string {
	const rawDescription =
		pickFirstString([
			rawPost['content:encoded'],
			rawPost['dc:description'],
			rawPost.description
		]) || collectTextContent(rawPost.description).join(' ');
	return buildTextPreview(rawDescription);
}

function parseNewsPostDate(pubDateRaw: string, locale: string): { original: string; timestamp: number | undefined } {
	const date = new Date(Date.parse(pubDateRaw));
	if (!Number.isNaN(date.getTime())) {
		return { original: date.toLocaleString(locale), timestamp: date.getTime() };
	}
	return { original: pubDateRaw, timestamp: undefined };
}

export function parseRssFeed(rawData: string): RSSFeed {
	return parser.parse(rawData) as RSSFeed;
}

export function buildNewsPosts(rawData: RSSFeed, locale = 'ko-KR'): {
	url: string;
	posts: Array<NewsPost>;
} {
	const rawChannel = rawData.rss?.channel;
	const baseUrl = toStringValue(rawChannel?.link);
	const rawItems = resolveItems(rawChannel?.item);

	const posts = rawItems.map((item) => {
		const post = item as Record<string, unknown>;
		const pubDateRaw = toStringValue(post.pubDate);
		const { original: postDate, timestamp: pubDateTimestamp } = parseNewsPostDate(pubDateRaw, locale);
		const categoryRaw = post.category;
		const category = Array.isArray(categoryRaw)
			? categoryRaw[0]
			: typeof categoryRaw === 'string'
				? categoryRaw
				: undefined;
		const description = extractDescription(post);
		const thumbnail = extractThumbnail(post);

		return {
			...(post as NewsPost),
			pubDate: postDate,
			category: category,
			pubDateTimestamp,
			description,
			thumbnail,
			link: toStringValue(post.link)
		};
	});

	return {
		url: baseUrl,
		posts
	};
}

export function applyCustomDomain(posts: NewsFeedResult, domain?: string): NewsFeedResult {
	if (!domain) {
		return posts;
	}

	const normalizedDomain = domain.endsWith('/') ? domain : `${domain}/`;
	return {
		...posts,
		posts: posts.posts.map((post) => ({
			...post,
			link: post.link.replace(posts.url, normalizedDomain)
		}))
	};
}

export function limitPosts(posts: NewsFeedResult, max = 5): NewsFeedResult {
	return {
		...posts,
		posts: posts.posts.slice(0, max)
	};
}

export function filterRecentNewsPosts(
	posts: Array<NewsPost>,
	now: Date = new Date(),
	maxMonths = 3,
	maxPosts = 3
): Array<NewsPost> {
	const cutoff = new Date(now);
	cutoff.setMonth(cutoff.getMonth() - maxMonths);
	const cutoffTime = cutoff.getTime();

	return posts
		.filter((post) => {
			const postTime = typeof post.pubDateTimestamp === 'number' ? post.pubDateTimestamp : Date.parse(post.pubDate);
			return Number.isFinite(postTime) && postTime >= cutoffTime;
		})
		.sort((a, b) => {
			const aTime =
				typeof a.pubDateTimestamp === 'number' ? a.pubDateTimestamp : Date.parse(a.pubDate);
			const bTime =
				typeof b.pubDateTimestamp === 'number' ? b.pubDateTimestamp : Date.parse(b.pubDate);
			if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
				return 0;
			}
			if (Number.isNaN(aTime)) {
				return 1;
			}
			if (Number.isNaN(bTime)) {
				return -1;
			}
			return bTime - aTime;
		})
		.slice(0, maxPosts);
}
