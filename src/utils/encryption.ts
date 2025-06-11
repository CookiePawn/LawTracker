import CryptoJS from 'react-native-crypto-js';

const SECRET_KEY = 'your-secret-key-here'; // 실제 프로덕션에서는 환경 변수로 관리해야 합니다

export const encryptData = (data: any): string => {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string): any => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString);
    } catch (error) {
        console.error('복호화 중 오류 발생:', error);
        return null;
    }
}; 