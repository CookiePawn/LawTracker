import { COLLECTIONS } from "@/constants";
import { Law } from "@/models";
import { db } from ".";
import { collection, doc, getDoc, getDocs, query, where, updateDoc, orderBy, startAfter, limit, increment, arrayUnion, arrayRemove } from '@react-native-firebase/firestore';

// 달력 법안 유무 표시 로드
export const loadCalendarLaws = async () => {
    const dataRef = collection(db, COLLECTIONS.CALENDAR);
    const docRef = doc(dataRef, 'isActive');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data()?.DATE as string[];
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

// 특정 의안 로드
export const loadLawById = async (billId: string) => {
    const dataRef = collection(db, COLLECTIONS.LAWS);
    const docRef = doc(dataRef, billId);
    const docSnap = await getDoc(docRef);
    return docSnap.data() as Law;
};

// 최신 의안 로드
export const loadLatestLaws = async (limitCount: number = 10, lastDoc?: any) => {
    const dataRef = collection(db, COLLECTIONS.LAWS);
    let queryRef;
    
    if (lastDoc) {
        queryRef = query(
            dataRef,
            orderBy('DATE', 'desc'),
            startAfter(lastDoc),
            limit(limitCount)
        );
    } else {
        queryRef = query(
            dataRef,
            orderBy('DATE', 'desc'),
            limit(limitCount)
        );
    }
    
    const snapshot = await getDocs(queryRef);
    const laws = snapshot.docs.map((doc) => doc.data());
    return {
        laws: laws as Law[],
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
    };
};

// 조회순 의안 로드
export const loadViewLaws = async (limitCount: number = 10, lastDoc?: any) => {
    const dataRef = collection(db, COLLECTIONS.LAWS);
    let queryRef;
    
    if (lastDoc) {
        queryRef = query(
            dataRef,
            orderBy('VIEW_COUNT', 'desc'),
            startAfter(lastDoc),
            limit(limitCount)
        );
    } else {
        queryRef = query(
            dataRef,
            orderBy('VIEW_COUNT', 'desc'),
            limit(limitCount)
        );
    }
    
    const snapshot = await getDocs(queryRef);
    const laws = snapshot.docs.map((doc) => doc.data());
    return {
        laws: laws as Law[],
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
    };
};

// 조회수 증가
export const increaseViewCount = async (billId: string) => {
    const dataRef = collection(db, COLLECTIONS.LAWS);
    const docRef = doc(dataRef, billId);
    await updateDoc(docRef, { VIEW_COUNT: increment(1) });
};

// 의안 검색 및 필터링
export const searchLaws = async (params: {
    searchQuery?: string;
}) => {
    const dataRef = collection(db, COLLECTIONS.LAWS);

    if (params.searchQuery === '') {
        return [];
    }

    // 검색어 필터링
    if (params.searchQuery) {
        const searchLower = params.searchQuery.toLowerCase();
        const queryRef = query(
            dataRef,
            where('TITLE', '>=', searchLower),
            where('TITLE', '<=', searchLower + '\uf8ff')
        );
        const snapshot = await getDocs(queryRef);
        const laws = snapshot.docs.map((doc) => doc.data());
        return laws as Law[];
    }

    const snapshot = await getDocs(dataRef);
    const laws = snapshot.docs.map((doc) => doc.data());
    return laws as Law[];
};

// 법안 즐겨찾기 토글 (추가/삭제)
export const toggleFavoriteLaw = async (userId: string, billId: string) => {
    const dataRef = collection(db, COLLECTIONS.USERS);
    const docRef = doc(dataRef, userId);
    const userDoc = await getDoc(docRef);
    const userData = userDoc.data();

    if (userData?.FAVORITE_LAWS?.includes(billId)) {
        // 이미 있으면 삭제
        await updateDoc(docRef, { FAVORITE_LAWS: arrayRemove(billId) });
    } else {
        // 없으면 추가
        await updateDoc(docRef, { FAVORITE_LAWS: arrayUnion(billId) });
    }
};