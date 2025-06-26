import { analytics } from './firebase'
import { setAnalyticsCollectionEnabled } from '@react-native-firebase/analytics';

// 앱 시작 시 Analytics 자동 수집 활성화 (React Native용)
export const initializeAnalytics = async () => {
    try {
        // Analytics 수집 활성화 (기본 자동 수집 시작)
        await setAnalyticsCollectionEnabled(analytics, true);
        
        console.log('Analytics auto-collection enabled');
        
    } catch (error) {
        console.error('Failed to initialize analytics:', error);
    }
};