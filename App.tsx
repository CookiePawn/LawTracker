import React from 'react';
import AppNavigator from './src/navigation/StackNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { loadCalendarLaws } from './src/services';  
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from './src/constants';
import { Provider } from 'jotai';
import { useAlert } from './src/lib/jotai';
import CustomAlert from './src/components/CustomAlert';

const AppContent = () => {
  const [alert] = useAlert();

  useEffect(() => {
    const loadIsActive = async () => {
      const laws = await loadCalendarLaws();
      await AsyncStorage.setItem(STORAGE_KEY.CALENDAR, JSON.stringify(laws));
    };
    loadIsActive();
  }, []);

  return (
    <>
      <AppNavigator />
      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        buttons={alert.buttons}
      />
    </>
  );
};

export default function App() {
  return (
    <Provider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppContent />
      </GestureHandlerRootView>
    </Provider>
  );
}