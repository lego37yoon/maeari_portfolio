import type { TeaserBuildInput, TeaserBuildResult, TeaserIntro, TeaserNotice, TeaserNoticeItem } from './types';
import type { NewsPost } from '../news';
import { formatKoreanDateLabel } from './meta';

const DEFAULT_TEASER_INTRO: TeaserIntro = {
	title: '안녕하세요,',
	desc: '포트폴리오 사이트에 오신 것을 환영합니다'
};

const DEFAULT_TEASER_NOTICE: TeaserNotice = {
	data: [
		{
			background: 'linear-gradient(45deg, cadetblue, cornflowerblue)',
			enabled: true,
			text: '공지사항을 확인하고 있어요.',
			desc: '5초 이상 공지 확인에서 넘어가지 않는 경우, 네트워크 문제가 있거나 코드가 잘못 작성되었을 수 있습니다.',
			link: 'https://github.com/lego37yoon/maeari_portfolio',
			'link-title': '계속 오류가 확인된다면 이슈트래커에 남겨주세요.'
		}
	]
};

function toBackgroundStyle(thumbnail?: string): string {
	if (!thumbnail) {
		return 'linear-gradient(180deg, cadetblue, cornflowerblue)';
	}
	return `url("${thumbnail}")`;
}

export function buildTeaserPayload(input: TeaserBuildInput = {}): TeaserBuildResult {
	const { intro = DEFAULT_TEASER_INTRO, notice, newsPosts } = input;

	const defaultNotice = DEFAULT_TEASER_NOTICE.data.map((item) => ({ ...item }));
	const finalNotice: TeaserNotice = {
		data: Array.isArray(notice?.data) ? notice.data : []
	};

	if (finalNotice.data.length === 0) {
		finalNotice.data = defaultNotice;
	}

	const newsNoticeItems: TeaserNoticeItem[] = [];
	if (Array.isArray(newsPosts)) {
		for (const post of newsPosts) {
			if (!post.title || !post.link) {
				continue;
			}

			newsNoticeItems.push({
				background: toBackgroundStyle(post.thumbnail),
				text: post.title,
				desc: post.description ?? '',
				link: post.link,
				source: 'news',
				date: post.pubDate?.trim(),
				'link-title': '더 읽어보기',
				enabled: true
			});
		}
	}

	finalNotice.data = [...finalNotice.data, ...newsNoticeItems];

	return {
		intro,
		notice: finalNotice
	};
}
