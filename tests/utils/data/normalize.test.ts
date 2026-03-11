import { describe, expect, it } from 'vitest';
import { normalizeDateFields } from '../../../src/utils/data/normalize';

describe('normalizeDateFields', () => {
	it('converts recognized date timestamps to year.month string', () => {
		const input = {
			'a': 'v',
			'start-year': {
				toDate: () => new Date('2026-01-02T00:00:00.000Z')
			},
			'end-year': {
				toDate: () => new Date('2027-06-10T00:00:00.000Z')
			}
		};

		const normalized = normalizeDateFields(input);

		expect(normalized['start-year']).toBe('2026.1');
		expect(normalized['end-year']).toBe('2027.6');
		expect(normalized['a']).toBe('v');
	});

	it('keeps values untouched when timestamp key is absent', () => {
		const input = {
			'title': 'demo'
		};

		const normalized = normalizeDateFields(input, ['date']);
		expect(normalized).toEqual({ title: 'demo' });
	});
});
