import { applyCustomDomain, buildNewsPosts, limitPosts, parseRssFeed } from './parser';
import type { NewsFeedResult, NewsPost } from './types';

export interface RSSFetchInput {
	rssUrl: string;
	customDomain?: string;
	locale?: string;
	maxPosts?: number;
	maxOpenGraphLookups?: number;
	maxOpenGraphConcurrency?: number;
}

interface OpenGraphFetchTarget {
	post: NewsPost;
	index: number;
}

const OPEN_GRAPH_IMAGE_ATTRIBUTES = [
	'og:image',
	'og:image:url',
	'og:image:secure_url',
	'twitter:image',
	'twitter:image:src',
	'twitter:image:secure_url'
];

const OPEN_GRAPH_LOOKUP_DEFAULT = 3;
const OPEN_GRAPH_CONCURRENCY_DEFAULT = 4;

function toAttributeValue(htmlTag: string, name: string): string {
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const re = new RegExp(`${escaped}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i');
	const match = htmlTag.match(re);
	return match?.[2] ?? match?.[3] ?? '';
}

function normalizeImageUrl(rawImageUrl: string, pageUrl: string): string | undefined {
	const trimmed = rawImageUrl.trim();
	if (!trimmed) {
		return undefined;
	}

	if (!/^https?:\/\//i.test(trimmed)) {
		try {
			return new URL(trimmed, pageUrl).toString();
		} catch {
			return undefined;
		}
	}

	return trimmed;
}

function sanitizeImageUrl(rawImageUrl: string, pageUrl: string): string | undefined {
	const normalized = normalizeImageUrl(rawImageUrl, pageUrl);
	if (!normalized) {
		return undefined;
	}

	if (!/^https?:\/\//i.test(normalized)) {
		return undefined;
	}

	if (normalized.startsWith('data:')) {
		return undefined;
	}

	return normalized;
}

function extractImageFromMeta(html: string, pageUrl: string): string | undefined {
	const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

	for (const tag of metaTags) {
		const property = toAttributeValue(tag, 'property') || toAttributeValue(tag, 'name') || toAttributeValue(tag, 'itemprop');
		if (!property) {
			continue;
		}

		if (!OPEN_GRAPH_IMAGE_ATTRIBUTES.includes(property.toLowerCase())) {
			continue;
		}

		const rawContent = toAttributeValue(tag, 'content') || toAttributeValue(tag, 'value');
		const candidate = sanitizeImageUrl(rawContent, pageUrl);
		if (candidate) {
			return candidate;
		}
	}

	return undefined;
}

function extractOpenGraphImage(html: string, pageUrl: string): string | undefined {
	return extractImageFromMeta(html, pageUrl);
}

async function fetchOpenGraphImage(postUrl: string): Promise<string | undefined> {
	try {
		const response = await fetch(postUrl);
		if (!response.ok) {
			return undefined;
		}
		const html = await response.text();
		return extractOpenGraphImage(html, postUrl);
	} catch {
		return undefined;
	}
}

async function hydrateMissingThumbnails(
	posts: NewsPost[],
	maxLookups: number,
	maxConcurrent: number
): Promise<NewsPost[]> {
	const targets: OpenGraphFetchTarget[] = [];
	const resolvedPosts = posts.map((post) => ({ ...post }));

	for (let index = 0; index < resolvedPosts.length; index++) {
		const post = resolvedPosts[index];
		if (post.thumbnail || !post.link || /^\s*$/.test(post.link)) {
			continue;
		}

		targets.push({ post, index });
	}

	const limitedTargets = targets.slice(0, Math.max(0, maxLookups));

	const batchSize = Math.max(1, maxConcurrent);
	for (let i = 0; i < limitedTargets.length; i += batchSize) {
		const batch = limitedTargets.slice(i, i + batchSize);
		await Promise.all(
			batch.map(async ({ post, index }) => {
				const image = await fetchOpenGraphImage(post.link);
				if (image) {
					resolvedPosts[index] = {
						...resolvedPosts[index],
						thumbnail: image
					};
				}
			})
		);
	}

	return resolvedPosts;
}

export async function fetchRssNewsFeed(input: RSSFetchInput): Promise<NewsFeedResult> {
	const {
		rssUrl,
		customDomain,
		locale = 'ko-KR',
		maxPosts = 5,
		maxOpenGraphLookups = OPEN_GRAPH_LOOKUP_DEFAULT,
		maxOpenGraphConcurrency = OPEN_GRAPH_CONCURRENCY_DEFAULT
	} = input;

	const rawData = await fetch(rssUrl).then((res) => res.text());
	const parsed = parseRssFeed(rawData);
	const newsFeed = buildNewsPosts(parsed, locale);
	const withOptionalDomain = customDomain ? applyCustomDomain(newsFeed, customDomain) : newsFeed;
	const bounded = limitPosts(withOptionalDomain, maxPosts);
	const posts = await hydrateMissingThumbnails(
		bounded.posts,
		maxOpenGraphLookups,
		maxOpenGraphConcurrency
	);

	return {
		url: bounded.url,
		posts
	};
}
