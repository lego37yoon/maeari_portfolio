import { describe, expect, it } from 'vitest';
import {
	getTeaserSourceLabel,
	formatKoreanDateLabel,
	buildTeaserMetaLabel
} from '../../../src/utils/teaser/meta';

describe('teaser metadata helpers', () => {
	it('builds notice meta label with formatted date', () => {
		expect(buildTeaserMetaLabel({ source: undefined, date: '2026-01-01' })).toBe('공지 · 2026년 1월 1일');
	});

	it('builds news meta label as 블로그', () => {
		expect(buildTeaserMetaLabel({ source: 'news', date: '2026-03-05' })).toBe('블로그 · 2026년 3월 5일');
	});

	it('accepts RFC 2822 date strings', () => {
		expect(formatKoreanDateLabel('Sun, 11 Jan 2026 05:32:43 +0900')).toBe('2026년 1월 11일');
	});

	it('accepts alternative date formats', () => {
		expect(formatKoreanDateLabel('2026/01/01')).toBe('2026년 1월 1일');
		expect(formatKoreanDateLabel('2026.01.01')).toBe('2026년 1월 1일');
		expect(formatKoreanDateLabel('2026.01.01T12:00:00.000Z')).toBe('2026년 1월 1일');
	});

	it('maps internal source values to display labels', () => {
		expect(getTeaserSourceLabel('notice')).toBe('공지');
		expect(getTeaserSourceLabel('news')).toBe('블로그');
		expect(getTeaserSourceLabel(undefined)).toBe('공지');
	});

	it('parses firebase timestamp-like date objects', () => {
		expect(formatKoreanDateLabel({ seconds: 1760000000, nanoseconds: 0 } as { seconds: number; nanoseconds: number })).toBe('2025년 10월 9일');
		expect(formatKoreanDateLabel({ _seconds: 1760000000, _nanoseconds: 0 } as { _seconds: number; _nanoseconds: number })).toBe('2025년 10월 9일');
	});

	it('handles non-string date values safely', () => {
		expect(formatKoreanDateLabel({ toString: () => '2026-01-01' } as { toString: () => string })).toBe('2026년 1월 1일');
	});
});
