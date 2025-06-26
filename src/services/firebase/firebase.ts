import { getApp } from '@react-native-firebase/app';
import { getAnalytics } from '@react-native-firebase/analytics';
import { getFirestore } from '@react-native-firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// google-services.json 파일을 사용하여 자동으로 Firebase 초기화
const app = getApp();
export const db = getFirestore(app);       
export const analytics = getAnalytics(app);