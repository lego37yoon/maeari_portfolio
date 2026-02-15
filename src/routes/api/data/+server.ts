import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const OBJECT_TYPES = new Set(['teaser', 'contact']);
const ARRAY_TYPES = new Set(['project', 'certification', 'contribution', 'education', 'activity']);
const DATE_FIELDS = ['start-year', 'end-year', 'date'];
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS portfolio_entries (
	id TEXT NOT NULL,
	type TEXT NOT NULL,
	payload TEXT NOT NULL,
	sort_order INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	PRIMARY KEY (type, id)
);

CREATE INDEX IF NOT EXISTS portfolio_entries_type_sort_idx
ON portfolio_entries (type, sort_order, id);
`;

type DataType = 'teaser' | 'contact' | 'project' | 'certification' | 'contribution' | 'education' | 'activity';
type D1QueryResult<T> = { results: T[] };
type D1Row = { id: string; payload: string };

interface D1Statement {
	bind(...values: unknown[]): {
		all<T = unknown>(): Promise<D1QueryResult<T>>;
	};
}

interface D1Binding {
	prepare(query: string): D1Statement;
	exec(query: string): Promise<unknown>;
}

const isD1Binding = (value: unknown): value is D1Binding => {
	return Boolean(value) && typeof value === 'object' && 'prepare' in value && 'exec' in value && typeof (value as D1Binding).prepare === 'function' && typeof (value as D1Binding).exec === 'function';
};

let schemaInitPromise: Promise<void> | null = null;

const ensureSchemaReady = async (db: D1Binding) => {
	if (!schemaInitPromise) {
		schemaInitPromise = db.exec(SCHEMA_SQL).then(() => undefined);
	}

	try {
		await schemaInitPromise;
	} catch (e) {
		schemaInitPromise = null;
		throw e;
	}
};

const parsePayload = (payload: string): Record<string, unknown> => {
	try {
		const parsed = JSON.parse(payload);
		if (parsed && typeof parsed === 'object') {
			return parsed as Record<string, unknown>;
		}
		return {};
	} catch {
		return {};
	}
};

const dateFromUnknown = (value: unknown): Date | null => {
	if (value instanceof Date && !Number.isNaN(value.valueOf())) {
		return value;
	}

	if (typeof value === 'string') {
		if (/^\d{4}\.\d{1,2}$/.test(value.trim())) {
			const [year, month] = value.trim().split('.');
			const d = new Date(Number(year), Number(month) - 1, 1);
			return Number.isNaN(d.valueOf()) ? null : d;
		}

		const parsed = Date.parse(value);
		return Number.isNaN(parsed) ? null : new Date(parsed);
	}

	if (typeof value === 'number') {
		const byMs = new Date(value);
		if (!Number.isNaN(byMs.valueOf())) {
			return byMs;
		}
	}

	if (value && typeof value === 'object') {
		if ('seconds' in value && typeof value.seconds === 'number') {
			const bySeconds = new Date(value.seconds * 1000);
			return Number.isNaN(bySeconds.valueOf()) ? null : bySeconds;
		}
	}

	return null;
};

const toYearMonth = (value: unknown): string => {
	const date = dateFromUnknown(value);
	if (!date) {
		return typeof value === 'string' ? value : '';
	}
	return `${date.getFullYear()}.${date.getMonth() + 1}`;
};

const normalizeDateFields = (record: Record<string, unknown>) => {
	for (const field of DATE_FIELDS) {
		if (field in record) {
			record[field] = toYearMonth(record[field]);
		}
	}
};

export const GET: RequestHandler = async ({ url, platform }) => {
	const type = url.searchParams.get('type');

	const db = platform?.env?.DB;
	if (!isD1Binding(db)) {
		error(500, 'D1 연결이 구성되지 않았습니다. 관리자에게 문의하세요.');
	}
	try {
		await ensureSchemaReady(db);
	} catch {
		error(500, 'D1 초기화 중 문제가 발생했습니다. 관리자에게 문의하세요.');
	}

	if (!type || (!OBJECT_TYPES.has(type) && !ARRAY_TYPES.has(type))) {
		error(400, '데이터 종류 설정이 잘못되었습니다. 관리자에게 문의하세요.');
	}

	const query = await db
		.prepare(
			`SELECT id, payload
			 FROM portfolio_entries
			 WHERE type = ?
			 ORDER BY sort_order ASC, id ASC`
		)
		.bind(type)
		.all<D1Row>();

	if (OBJECT_TYPES.has(type)) {
		const objectDataList: Record<string, unknown> = {};
		for (const row of query.results) {
			objectDataList[row.id] = parsePayload(row.payload);
		}
		return json(objectDataList);
	}

	const arrayDataList = query.results.map((row) => {
		const data = parsePayload(row.payload);
		normalizeDateFields(data);
		return { id: row.id, data };
	});

	return json(arrayDataList);
};
	}
};
