import AppNavigator from './src/navigation/StackNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { loadCalendarLaws, loadLaws } from './src/services';  
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from './src/constants';

export default function App() {
  // useEffect(() => {
  //   const loadLawsList = async () => {
  //     const laws = await loadLaws();
  //     await AsyncStorage.setItem(STORAGE_KEY.LAWS, JSON.stringify(laws));
  //   };
  //   loadLawsList();
  // }, []);

  useEffect(() => {
    const loadIsActive = async () => {
      const laws = await loadCalendarLaws();
      await AsyncStorage.setItem(STORAGE_KEY.CALENDAR, JSON.stringify(laws));
    };
    loadIsActive();
  }, []);
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}