import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore/lite";
import { error, json, text } from '@sveltejs/kit';

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
    const purpose = url.searchParams.get("purpose");
    const account = url.searchParams.get("account");
    const provider = url.searchParams.get("provider");
    
    if (!purpose) {
        error(404, "일치하는 데이터가 없어 불러올 수 없습니다.");
    }
    const defaultData = await getDoc(doc(store, type, purpose));

    switch (type) {
        case "resume":
        case "entry":
            return json(defaultData.data());
        case "contact":
            switch(purpose) {
                case "dev": {
                    const profile = defaultData.data().git.find(profile => (
                        profile.type === account && profile.provider === provider
                    ));

                    return json({
                        handle: profile.handle,
                        url: profile.url
                    });
                }
                case "email": {
                    const profile = defaultData.data()[account].find(profile => (
                        profile.provider === provider
                    ));
                    return text(profile.address);
                }
                default:
                    error(404, "찾고자 하는 관련 데이터가 없습니다.");
            }
        default:
            error(400, "잘못된 데이터를 수신했습니다. 증상이 지속될 경우 관리자에게 문의하세요");
    }
}