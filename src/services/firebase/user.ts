import { DATA_SECRET_KEY } from "@env";
import { db } from ".";
import CryptoJS from 'react-native-crypto-js';
import { collection, deleteDoc, doc, getDoc, query, where, getDocs, setDoc } from "firebase/firestore";
import { COLLECTIONS } from "@/constants";
import { User } from "@/models";

// 데이터 해시 함수
const hashData = (data: string): string => {
    if (!data) return '';
    const wordArray = CryptoJS.enc.Utf8.parse(data + DATA_SECRET_KEY);
    return CryptoJS.MD5(wordArray).toString();
};

// SNS 로그인 회원 정보 저장
export const signIn = async (user: User) => {
    try {
        if (!user.phone) {
            return -1; // 전화번호 없음
        }

        const dataRef = collection(db, COLLECTIONS.USERS);
        
        // 민감 정보 해시 (검색용)
        const hashedPhone = hashData(user.phone);
        
        // 전화번호로 기존 사용자 검색
        const queryRef = query(dataRef, where('phone_hash', '==', hashedPhone));
        const querySnapshot = await getDocs(queryRef);
        
        let userId: string;
        
        if (!querySnapshot.empty) {
            // 기존 사용자가 있는 경우
            const existingUser = querySnapshot.docs[0].data();
            
            // SNS 타입이 다른 경우
            if (existingUser.SNS !== user.SNS) {
                return -2; // 다른 SNS로 가입된 계정
            }
            
            userId = querySnapshot.docs[0].id;
        } else {
            userId = user.id;
        }
        
        const docRef = doc(dataRef, userId);
        
        // 민감한 정보 저장 (해시값과 암호화된 원본)
        const encryptedUser = {
            ...user,
            id: userId,
            // 해시값 (검색용)
            phone_hash: hashedPhone,
            // 원본 데이터 (AES 암호화)
            phone: user.phone ? CryptoJS.AES.encrypt(user.phone, DATA_SECRET_KEY).toString() : '',
            email: user.email ? CryptoJS.AES.encrypt(user.email, DATA_SECRET_KEY).toString() : '',
            age: user.age ? CryptoJS.AES.encrypt(user.age, DATA_SECRET_KEY).toString() : '',
            gender: user.gender ? CryptoJS.AES.encrypt(user.gender, DATA_SECRET_KEY).toString() : '',
        };
        
        await setDoc(docRef, encryptedUser, { merge: true });
        
        return querySnapshot.empty ? 0 : 1; // 0: 회원가입 완료, 1: 로그인 완료
    } catch (error) {
        console.error('로그인/회원가입 중 에러 발생:', error);
        return -1; // 에러 발생
    }
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