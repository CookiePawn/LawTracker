import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import { STORAGE_KEY } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '@/types';
import {
  Notification,
  Terms,
  PrivacyPolicy,
  Tutorial,
  ApiPolicy,
  LawDetail,
  SignIn,
  Setting
} from '@/screens';
import { loadUser } from '@/services';
import { useSetUser } from '@/lib';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);
  const setUser = useSetUser();

  useEffect(() => {
    const checkInitialRoute = async () => {
      try {
        const [userId] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY.USER_ID)
        ]);

        if (userId) {
          const user = await loadUser(userId);
          if (user) {
            setUser(user);
            setInitialRoute('Tab');
          } else {
            setInitialRoute('SignIn');
          }
        } else {
          setInitialRoute('SignIn');
        }
      } catch (error) {
        console.error('초기 라우트 확인 중 오류:', error);
        setInitialRoute('SignIn');
      }
    };

    checkInitialRoute();
  }, []);

  if (initialRoute === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Tutorial" component={Tutorial} />
        <Stack.Screen name="Tab" component={TabNavigator} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="ApiPolicy" component={ApiPolicy} />
        <Stack.Screen name="LawDetail" component={LawDetail} />
        <Stack.Screen name="Setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


