import { error } from '@sveltejs/kit';
import { collection, getDocs, getFirestore, type Firestore } from 'firebase/firestore/lite';
import { initializeServerApp } from 'firebase/app';
import { env } from '$env/dynamic/private';
import type {
	PortfolioArrayPayload,
	PortfolioDataResult,
	PortfolioDataStore,
	PortfolioDataType,
	PortfolioObjectPayload
} from './types';
import { isPortfolioObjectType, isPortfolioDataType } from './types';
import { normalizeDateFields } from './normalize';

type RawRecord = {
	id: string;
	data: Record<string, unknown>;
};

const firebaseConfig = {
	apiKey: env.FIREBASE_API_KEY,
	authDomain: env.FIREBASE_AUTH_DOMAIN,
	projectId: env.FIREBASE_PROJECT_ID,
	appId: env.FIREBASE_APP_ID
};

const firebaseSettings = {
	automaticDataCollectionEnabled: false
};

const hasFirebaseConfig = Boolean(
	env.FIREBASE_API_KEY &&
	env.FIREBASE_AUTH_DOMAIN &&
	env.FIREBASE_PROJECT_ID &&
	env.FIREBASE_APP_ID
);

const fireApp = hasFirebaseConfig ? initializeServerApp(firebaseConfig, firebaseSettings) : null;
const store: Firestore | null = fireApp ? getFirestore(fireApp) : null;

const ensureStoreReady = (firestore: Firestore | null): firestore is Firestore => {
	if (!firestore) {
		error(500, 'Firebase 설정이 누락되었습니다. 관리자에게 문의하세요.');
	}

	return true;
};

const buildObjectPayload = (documentData: RawRecord[]): PortfolioObjectPayload => {
	const objectData: PortfolioObjectPayload = {};
	for (const item of documentData) {
		objectData[item.id] = normalizeDateFields(item.data);
	}

	return objectData;
};

const buildArrayPayload = (documentData: RawRecord[]): PortfolioArrayPayload => {
	return documentData.map((item) => ({
		id: item.id,
		data: normalizeDateFields(item.data)
	}));
};

export function createFirebasePortfolioDataStore(): PortfolioDataStore {
	return {
		fetch: async (type: PortfolioDataType): Promise<PortfolioDataResult> => {
			if (!ensureStoreReady(store)) {
				error(500, 'Firebase 설정이 누락되었습니다. 관리자에게 문의하세요.');
			}

			if (!isPortfolioDataType(type)) {
				error(400, '데이터 종류 설정이 잘못되었습니다. 관리자에게 문의하세요.');
			}

			const collectionData = await getDocs(collection(store, type));
			const docs: RawRecord[] = [];

			collectionData.forEach((document) => {
				docs.push({
					id: document.id,
					data: document.data() as Record<string, unknown>
				});
			});

			if (isPortfolioObjectType(type)) {
				return {
					mode: 'object',
					data: buildObjectPayload(docs)
				};
			}

			return {
				mode: 'array',
				data: buildArrayPayload(docs)
			};
		}
	};
}
