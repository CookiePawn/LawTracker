// Import the functions you need from the SDKs you need
import { COLLECTIONS } from "@/constants";
import { Law, User } from "@/models";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, limit, orderBy, query, where, doc, getDoc, updateDoc, increment, setDoc, arrayUnion, arrayRemove, deleteDoc, startAfter } from "firebase/firestore";
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID } from '@env';
import CryptoJS from 'react-native-crypto-js';
import { DATA_SECRET_KEY } from '@env';

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

// 의안 찬/반 투표 체크 후 증가
export const increaseVoteCount = async (userUid: string, billId: string, voteType: 'VOTE_TRUE' | 'VOTE_FALSE') => {
    try {
        // 사용자 문서 참조
        const userRef = doc(db, COLLECTIONS.USERS, userUid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            return '404';
        }

        const userData = userDoc.data();

        // 사용자의 투표 기록 확인
        if (userData?.voteList?.some((vote: string) => vote.includes(billId))) {
            const voteIndex = userData.voteList.findIndex((vote: string) => vote.includes(billId));
            const vote = userData.voteList[voteIndex];
            const voteType = vote.split('-')[1];
            if (voteType === '1') {
                return '411';
            } else if (voteType === '0') {
                return '410';
            }
        }

        // 법안 문서 참조
        const lawRef = doc(db, COLLECTIONS.LAWS, billId);
        const lawDoc = await getDoc(lawRef);

        if (!lawDoc.exists()) {
            return '404';
        }

        // 사용자의 투표 기록에 추가
        await updateDoc(userRef, {
            voteList: arrayUnion(`${billId}-${voteType === 'VOTE_TRUE' ? '1' : '0'}`)
        });

        // 법안의 투표 수 증가
        await updateDoc(lawRef, {
            [voteType]: increment(1)
        });

        return '200';

    } catch (error) {
        return '404';
    }
};

// 의안 찬/반 바꾸기
export const toggleVoteLaw = async (userUid: string, billId: string, voteType: 'VOTE_TRUE' | 'VOTE_FALSE') => {
    const lawRef = doc(db, COLLECTIONS.LAWS, billId);
    // 사용자 문서 참조
    const userRef = doc(db, COLLECTIONS.USERS, userUid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        throw new Error('사용자를 찾을 수 없습니다.');
    }

    const userData = userDoc.data();
    const voteList = userData.voteList || [];
    
    // 기존 투표 데이터 변환
    const newVoteList = voteList.map((vote: string) => {
        if (vote.startsWith(billId)) {
            // 해당 의안의 투표를 새로운 투표 타입으로 변경
            return `${billId}-${voteType === 'VOTE_TRUE' ? '1' : '0'}`;
        }
        return vote;
    });

    // 사용자의 투표 기록 업데이트
    await updateDoc(userRef, {
        voteList: newVoteList
    });

    await updateDoc(lawRef, {
        [voteType]: increment(1),
        [voteType === 'VOTE_TRUE' ? 'VOTE_FALSE' : 'VOTE_TRUE']: increment(-1)
    });
};

// 의안 검색 및 필터링
export const searchLaws = async (params: {
    searchQuery?: string;
}) => {
    const dataRef = collection(db, COLLECTIONS.LAWS);
    let queryConstraints = [];

    if (params.searchQuery === '') {
        return [];
    }

    // 검색어 필터링
    if (params.searchQuery) {
        const searchLower = params.searchQuery.toLowerCase();
        queryConstraints.push(
            where('TITLE', '>=', searchLower),
            where('TITLE', '<=', searchLower + '\uf8ff')
        );
    }

    const queryRef = query(dataRef, ...queryConstraints);
    const snapshot = await getDocs(queryRef);
    const laws = snapshot.docs.map((doc) => doc.data());
    return laws as Law[];
};

// SNS 로그인 회원 정보 저장
export const signIn = async (user: User) => {
    const dataRef = collection(db, COLLECTIONS.USERS);
    const docRef = doc(dataRef, user.id);
    const docSnap = await getDoc(docRef);
    
    // 민감한 정보 암호화
    const encryptedUser = {
        ...user,
        email: user.email ? CryptoJS.AES.encrypt(user.email, DATA_SECRET_KEY).toString() : '',
        phone: user.phone ? CryptoJS.AES.encrypt(user.phone, DATA_SECRET_KEY).toString() : '',
        age: user.age ? CryptoJS.AES.encrypt(user.age, DATA_SECRET_KEY).toString() : '',
        gender: user.gender ? CryptoJS.AES.encrypt(user.gender, DATA_SECRET_KEY).toString() : '',
    };
    
    if (!docSnap.exists()) {
        await setDoc(docRef, encryptedUser, { merge: true });
        return 0; // 회원가입 완료
    }
    
    await setDoc(docRef, encryptedUser, { merge: true });
    return 1; // 로그인 완료
};

// 회원 탈퇴
export const withdrawUser = async (userId: string) => {
    const dataRef = collection(db, COLLECTIONS.USERS);
    const docRef = doc(dataRef, userId);
    await deleteDoc(docRef);
};

// 회원 정보 로드
export const loadUser = async (userId: string) => {
    const dataRef = collection(db, COLLECTIONS.USERS);
    const docRef = doc(dataRef, userId);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.data() as User;
    
    if (!userData) return null;
    
    // 암호화된 정보 복호화
    return {
        ...userData,
        email: userData.email ? CryptoJS.AES.decrypt(userData.email, DATA_SECRET_KEY).toString(CryptoJS.enc.Utf8) : '',
        phone: userData.phone ? CryptoJS.AES.decrypt(userData.phone, DATA_SECRET_KEY).toString(CryptoJS.enc.Utf8) : '',
        age: userData.age ? CryptoJS.AES.decrypt(userData.age, DATA_SECRET_KEY).toString(CryptoJS.enc.Utf8) : '',
        gender: userData.gender ? CryptoJS.AES.decrypt(userData.gender, DATA_SECRET_KEY).toString(CryptoJS.enc.Utf8) : '',
    };
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
