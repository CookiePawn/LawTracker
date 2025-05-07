import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import { Notification, Terms, PrivacyPolicy, Tutorial, ApiPolicy } from '@/screens';
import { STORAGE_KEY } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isTutorialCompleted, setIsTutorialCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkTutorial = async () => {
      try {
        const isCompleted = await AsyncStorage.getItem(STORAGE_KEY.TUTORIAL);
        setIsTutorialCompleted(isCompleted === 'true');
      } catch (error) {
        setIsTutorialCompleted(false);
      }
    };
    checkTutorial();
  }, []);

  if (isTutorialCompleted === null) {
    return null; // 로딩 중
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isTutorialCompleted ? 'Tab' : 'Tutorial'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Tutorial" component={Tutorial} />
        <Stack.Screen name="Tab" component={TabNavigator} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="ApiPolicy" component={ApiPolicy} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


