import type { NewsPost } from '../news';

export interface TeaserNoticeItem {
	enabled?: boolean;
	background: string;
	text: string;
	desc: string;
	source?: "notice" | "news";
	date?: string;
	link?: string;
	'link-title'?: string;
}

export interface TeaserNotice {
	data: TeaserNoticeItem[];
}

export interface TeaserIntro {
	title: string;
	desc: string;
}

export interface TeaserPayload {
	intro?: TeaserIntro;
	notice?: TeaserNotice;
}

export interface TeaserBuildInput extends TeaserPayload {
	newsPosts?: NewsPost[];
}

export interface TeaserBuildResult extends TeaserPayload {
	newsPosts?: NewsPost[];
}
