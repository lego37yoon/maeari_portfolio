export const PORTFOLIO_DATA_TYPES = [
	'teaser',
	'contact',
	'project',
	'certification',
	'contribution',
	'education',
	'activity'
] as const;

export type PortfolioDataType = (typeof PORTFOLIO_DATA_TYPES)[number];

export const PORTFOLIO_OBJECT_TYPES = ['teaser', 'contact'] as const;
export const PORTFOLIO_ARRAY_TYPES = ['project', 'certification', 'contribution', 'education', 'activity'] as const;

export type PortfolioObjectType = (typeof PORTFOLIO_OBJECT_TYPES)[number];
export type PortfolioArrayType = (typeof PORTFOLIO_ARRAY_TYPES)[number];

export type PortfolioRecord = Record<string, unknown>;
export interface PortfolioListItem {
	id: string;
	data: PortfolioRecord;
}

export type PortfolioObjectPayload = Record<string, PortfolioRecord>;
export type PortfolioArrayPayload = PortfolioListItem[];
export type PortfolioPayload = PortfolioObjectPayload | PortfolioArrayPayload;

export type PortfolioDataMode = 'object' | 'array';

export interface PortfolioDataResult {
	mode: PortfolioDataMode;
	data: PortfolioPayload;
}

export interface PortfolioDataStore {
	fetch(type: PortfolioDataType): Promise<PortfolioDataResult>;
}

export const isPortfolioDataType = (value: string | null): value is PortfolioDataType => {
	return value !== null && (PORTFOLIO_DATA_TYPES as readonly string[]).includes(value);
};

export const isPortfolioObjectType = (type: PortfolioDataType): type is PortfolioObjectType => {
	return (PORTFOLIO_OBJECT_TYPES as readonly string[]).includes(type);
};
