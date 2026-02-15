declare global {
	namespace App {
		interface Platform {
			env: {
				DB: {
					exec: (query: string) => Promise<unknown>;
					prepare: (query: string) => {
						bind: (...values: unknown[]) => {
							all: <T = unknown>() => Promise<{ results: T[] }>;
						};
					};
				};
				ASSETS_BUCKET: unknown;
				RSS_URL?: string;
				RSS_CUSTOM_URL?: string;
			};
		}
	}
}

export {};
