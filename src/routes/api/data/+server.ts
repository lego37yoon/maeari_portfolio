import { initializeServerApp } from 'firebase/app';
import { getFirestore, collection, getDocs, type Firestore } from 'firebase/firestore/lite';
import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

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

const timestampToDate = (rawData: Record<string, { toDate: () => Date }>, key: string): string => {
	const date = rawData[key].toDate();
	return `${date.getFullYear()}.${date.getMonth() + 1}`;
};

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');
	if (!ensureStoreReady(store)) {
		return; // unreachable, keeps types narrow for TypeScript
	}

	switch (type) {
		case 'teaser':
		case 'contact': {
			const teaserData = await getDocs(collection(store, type));
			const objectDataList: Record<string, unknown> = {};
			teaserData.forEach((doc) => {
				objectDataList[doc.id] = doc.data();
			});

			return json(objectDataList);
		}
		case 'project':
		case 'certification':
		case 'contribution':
		case 'education':
		case 'activity': {
			const activityData = await getDocs(collection(store, type));
			const arrayDataList: Array<{ id: string; data: Record<string, unknown> }> = [];
			activityData.forEach((doc) => {
				arrayDataList.push({ id: doc.id, data: doc.data() as Record<string, unknown> });
			});

			arrayDataList.forEach((item) => {
				const data = item.data as Record<string, { toDate: () => Date }>;

				if ('start-year' in data) {
					data['start-year'] = timestampToDate(data, 'start-year');
				}

				if ('end-year' in data) {
					data['end-year'] = timestampToDate(data, 'end-year');
				}
				if ('date' in data) {
					data['date'] = timestampToDate(data, 'date');
				}
			});

			return json(arrayDataList);
		}
		default:
			error(400, '데이터 종류 설정이 잘못되었습니다. 관리자에게 문의하세요.');
	}
};
