import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '@/constants/storage';

const VIEW_COUNT_KEY = STORAGE_KEY.VIEW_COUNT;

interface ViewCounts {
    [billId: string]: number;
}

export const getViewCount = async (billId: string): Promise<number> => {
    try {
        const viewCountsJson = await AsyncStorage.getItem(VIEW_COUNT_KEY);
        if (!viewCountsJson) return 0;
        
        const viewCounts: ViewCounts = JSON.parse(viewCountsJson);
        return viewCounts[billId] || 0;
    } catch (error) {
        console.error('Error getting view count:', error);
        return 0;
    }
};

export const incrementViewCount = async (billId: string): Promise<number> => {
    try {
        const viewCountsJson = await AsyncStorage.getItem(VIEW_COUNT_KEY);
        const viewCounts: ViewCounts = viewCountsJson ? JSON.parse(viewCountsJson) : {};
        
        viewCounts[billId] = (viewCounts[billId] || 0) + 1;
        await AsyncStorage.setItem(VIEW_COUNT_KEY, JSON.stringify(viewCounts));
        
        return viewCounts[billId];
    } catch (error) {
        console.error('Error incrementing view count:', error);
        return 0;
    }
}; 