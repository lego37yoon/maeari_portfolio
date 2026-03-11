export interface RSSPost {
	title: string;
	link: string;
	pubDate: string;
	category?: string | string[];
	[key: string]: unknown;
}

export interface RSSChannel {
	link: string;
	item?: RSSPost | RSSPost[];
}

export interface RSSFeed {
	rss?: {
		channel?: RSSChannel;
	};
}

export interface NewsPost {
	title: string;
	link: string;
	pubDate: string;
	pubDateTimestamp?: number;
	description?: string;
	thumbnail?: string;
	category?: string;
	[key: string]: unknown;
}

export interface NewsFeedResult {
	url: string;
	posts: NewsPost[];
}
