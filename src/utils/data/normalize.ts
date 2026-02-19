import type { PortfolioRecord } from './types';

export const PORTFOLIO_DATE_KEYS = ['start-year', 'end-year', 'date'] as const;

export type TimestampLike = {
	toDate: () => Date;
};

type DateValue = TimestampLike | string | number | boolean | null | undefined;

export function isTimestampLike(value: unknown): value is TimestampLike {
	return (
		typeof value === 'object' &&
		value !== null &&
		'toDate' in value &&
		typeof (value as { toDate?: unknown }).toDate === 'function'
	);
}

export function convertTimestampToYearMonth(value: DateValue): string {
	const date = isTimestampLike(value) ? value.toDate() : null;
	if (!date) {
		return `${value}`;
	}

	return `${date.getFullYear()}.${date.getMonth() + 1}`;
}

export function normalizeDateFields<T extends PortfolioRecord>(data: T, dateKeys: readonly string[] = PORTFOLIO_DATE_KEYS): T {
	const result = { ...data } as T;

	for (const key of dateKeys) {
		const raw = (result as PortfolioRecord)[key];
		if (!isTimestampLike(raw)) {
			continue;
		}

		(result as PortfolioRecord)[key] = convertTimestampToYearMonth(raw);
	}

	return result;
}
