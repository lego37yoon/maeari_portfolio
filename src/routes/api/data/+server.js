import { initializeServerApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    appId: env.FIREBASE_APP_ID,
};

const firebaseSettings = {
    automaticDataCollectionEnabled: false
}

const hasFirebaseConfig = Boolean(
    env.FIREBASE_API_KEY &&
    env.FIREBASE_AUTH_DOMAIN &&
    env.FIREBASE_PROJECT_ID &&
    env.FIREBASE_APP_ID
);
const fireApp = hasFirebaseConfig ? initializeServerApp(firebaseConfig, firebaseSettings) : null;
const store = fireApp ? getFirestore(fireApp) : null;

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    const type = url.searchParams.get("type");

    if (!store) {
        error(500, "Firebase 설정이 누락되었습니다. 관리자에게 문의하세요.");
    }

    switch (type) {
        case "teaser":
        case "contact":
            const teaserData = await getDocs(collection(store, type));
            const objectDataList = {};
            teaserData.forEach((doc) => {
                objectDataList[doc.id] = doc.data();
            });

            return new json(objectDataList);
        case "project":
        case "certification":
        case "contribution":
        case "education":
        case "activity":
            const activityData = await getDocs(collection(store, type));
            const arrayDataList = [];
            activityData.forEach((doc) => {
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
            error(400, "데이터 종류 설정이 잘못되었습니다. 관리자에게 문의하세요.");
    }
}

function timestampToDate(db, data) {
    const date = db.data[data].toDate();
    return `${date.getFullYear()}.${date.getMonth() + 1}`;
}
