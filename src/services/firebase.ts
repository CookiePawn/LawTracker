// Import the functions you need from the SDKs you need
import { COLLECTIONS } from "@/constants";
import { Law } from "@/models";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, limit, orderBy, query, where, doc, getDoc } from "firebase/firestore";
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID } from '@env';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// 달력 법안 유무 표시 로드
export const loadCalendarLaws = async () => {
    const dataRef = collection(db, COLLECTIONS.CALENDAR);
    const docRef = doc(dataRef, 'isActive');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        console.log(docSnap.data());
        return docSnap.data().DATE as string[];
    }
    return [];
};

// 날짜에 따라 의안 데이터 로드
export const loadLaws = async (date?: string) => {
    const dataRef = collection(db, COLLECTIONS.LAWS);
    const queryRef = date ? query(dataRef, where('DATE', '==', date)) : dataRef;
    const snapshot = await getDocs(queryRef);
    const laws = snapshot.docs.map((doc) => doc.data());
    return laws as Law[];
};

// 최신 의안 로드
export const loadLatestLaws = async (limitCount: number = 2) => {
    const dataRef = collection(db, COLLECTIONS.LAWS);
    const queryRef = query(dataRef, orderBy('DATE', 'desc'), limit(limitCount));
    const snapshot = await getDocs(queryRef);
    const laws = snapshot.docs.map((doc) => doc.data());
    return laws as Law[];
};

// 의안 검색 및 필터링
export const searchLaws = async (params: {
    searchQuery?: string;
    dateRange?: { start?: string; end?: string };
    billType?: string;
    status?: string;
    sortBy?: '최신순' | '조회순';
}) => {
    const dataRef = collection(db, COLLECTIONS.LAWS);
    let queryConstraints = [];

    // 검색어 필터링
    if (params.searchQuery) {
        const searchLower = params.searchQuery.toLowerCase();
        queryConstraints.push(
            where('TITLE_LOWER', '>=', searchLower),
            where('TITLE_LOWER', '<=', searchLower + '\uf8ff')
        );
    }

    // 날짜 범위 필터링
    if (params.dateRange?.start) {
        queryConstraints.push(where('DATE', '>=', params.dateRange.start));
    }
    if (params.dateRange?.end) {
        queryConstraints.push(where('DATE', '<=', params.dateRange.end));
    }

    // 의안 구분 필터링
    if (params.billType && params.billType !== '전체') {
        queryConstraints.push(where('TAG', '==', params.billType));
    }

    // 상태 필터링
    if (params.status && params.status !== '전체') {
        queryConstraints.push(where('ACT_STATUS', '==', params.status));
    }

    // 정렬
    if (params.sortBy === '최신순') {
        queryConstraints.push(orderBy('DATE', 'desc'));
    }

    const queryRef = query(dataRef, ...queryConstraints);
    const snapshot = await getDocs(queryRef);
    const laws = snapshot.docs.map((doc) => doc.data());
    return laws as Law[];
};