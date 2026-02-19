import type { TeaserNoticeItem } from './types';

export type TeaserMetaCategory = '공지' | '블로그';

export function getTeaserSourceLabel(source?: TeaserNoticeItem['source']): TeaserMetaCategory {
	return source === 'news' ? '블로그' : '공지';
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function pickNumericField(record: Record<string, unknown>, keys: Array<string>): number | null {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === 'number') {
			if (Number.isFinite(value)) {
				return value;
			}
			continue;
		}

		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed) {
				continue;
			}
			const parsed = Number(trimmed);
			if (Number.isFinite(parsed)) {
				return parsed;
			}
		}
	}

	return null;
}

function parseDateFromText(rawDate: string): Date | null {
	const trimmed = rawDate.trim();
	if (!trimmed) {
		return null;
	}

	const parsed = Date.parse(trimmed);
	if (Number.isNaN(parsed)) {
		const normalizedPeriodDate = trimmed.replace(/^(\d{4})\.(\d{1,2})\.(\d{1,2})(?=[Tt]|$)/, '$1-$2-$3');
		const normalizedParsed = Date.parse(normalizedPeriodDate);
		if (Number.isNaN(normalizedParsed)) {
			return null;
		}
		return new Date(normalizedParsed);
	}

	return new Date(parsed);
}

function toDate(value: unknown): Date | null {
	if (value instanceof Date) {
		const time = value.getTime();
		return Number.isNaN(time) ? null : value;
	}

	if (typeof value === 'number') {
		if (!Number.isFinite(value)) {
			return null;
		}
		const parsed = new Date(value);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	}

	if (typeof value === 'bigint') {
		const parsed = new Date(Number(value));
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	}

	if (typeof value === 'string') {
		return parseDateFromText(value);
	}

	if (!isRecord(value)) {
		return null;
	}

	const candidate = value as Record<string, unknown>;
	const toDateValue = candidate.toDate;
	if (typeof toDateValue === 'function') {
		const converted = toDateValue.call(candidate);
		return converted instanceof Date && !Number.isNaN(converted.getTime()) ? converted : null;
	}

	const seconds = pickNumericField(candidate, ['seconds', '_seconds']);
	if (seconds !== null) {
		const nanos = pickNumericField(candidate, ['nanoseconds', '_nanoseconds']) ?? 0;
		const date = new Date(seconds * 1000 + Math.floor(nanos / 1_000_000));
		return Number.isNaN(date.getTime()) ? null : date;
	}

	try {
		return parseDateFromText(String(value));
	} catch {
		return null;
	}
}

export function formatKoreanDateLabel(value?: unknown): string {
	const normalizedDate = toDate(value);
	const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	if (!normalizedDate) {
		return '';
	}
	return dateFormatter.format(normalizedDate);
}

export function buildTeaserMetaLabel(notice: Pick<TeaserNoticeItem, 'source' | 'date'>): string {
	const sourceLabel = getTeaserSourceLabel(notice.source);
	const dateLabel = formatKoreanDateLabel(notice.date);
	return sourceLabel + (dateLabel ? ' · ' + dateLabel : '');
}
