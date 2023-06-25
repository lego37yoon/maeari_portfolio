import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc } from "firebase/firestore/lite";
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
    const originData = await getDocs(collection(store, type));

    switch (type) {
        case "teaser":
        case "contact":
            const objectDataList = {};
            originData.forEach((doc) => {
                objectDataList[doc.id] = doc.data();
            });

            return new json(objectDataList);
        case "project":
        case "certification":
        case "contribution":
        case "education":
        case "activity":
            const arrayDataList = [];
            originData.forEach((doc) => {
                arrayDataList.push({
                    id: doc.id,
                    data: doc.data()
                })
            });

            arrayDataList.forEach((data) => {
                data.data["start-year"] ? 
                    data.data["start-year"] = timestampToDate(data, "start-year") : "";                
                data.data["end-year"] ?
                    data.data["end-year"] = timestampToDate(data, "end-year") : "";
                data.data["date"] ?
                    data.data["date"] = timestampToDate(data, "date") : "";
            })

            return new json(arrayDataList);
        default:
            throw error(400, "데이터 종류 설정이 잘못되었습니다. 관리자에게 문의하세요.");
    }
}

function timestampToDate(db, data) {
    const date = db.data[data].toDate();
    return `${date.getFullYear()}.${date.getMonth() + 1}`;
}