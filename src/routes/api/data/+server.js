import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { error, json } from '@sveltejs/kit';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const fireApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const store = getFirestore(fireApp);

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    const type = url.searchParams.get("type");
    
    switch (type) {
        case "banner": {
            const banner = await getDocs(collection(store, "teaser"));
            const bannerData = {};
            banner.forEach((doc) => {
                bannerData[doc.id] = doc.data();
            });

            return new json(bannerData);
        }
        case "projects": {
            break;
        }
        case "resume": {
            break;
        }
        case "contacts": {
            const contacts = await getDocs(collection(store, "contact"));
            const contactData = {};
            contacts.forEach((doc) => {
                contactData[doc.id] = doc.data();
            });

            return new json(contactData);
        }
        default:
            throw error(400, "데이터 종류 설정이 잘못되었습니다. 관리자에게 문의하세요.");
    }
}