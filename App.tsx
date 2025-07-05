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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={{ flex: 1 }}>
      <AppNavigator />
      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        buttons={alert.buttons}
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <Provider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppContent />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}