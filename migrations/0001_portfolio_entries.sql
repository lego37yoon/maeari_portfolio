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
