import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, BackHandler, ToastAndroid } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, CalendarIcon } from '@/assets';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '@/types';
import RNExitApp from 'react-native-exit-app';

type NavigationProp = BottomTabNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const backPressedTime = useRef(0);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - backPressedTime.current;
        
        if (timeDiff < 2000) { // 2초 이내에 두 번 누른 경우
          RNExitApp.exitApp();
          return true;
        }
        
        backPressedTime.current = currentTime;
        ToastAndroid.show('한번 더 누르면 종료됩니다', ToastAndroid.SHORT);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        backHandler.remove();
      };
    }, [])
  );

  const openNationalAssembly = () => {
    Linking.openURL('https://www.assembly.go.kr');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>법안 트래커</Text>
        <Text style={styles.headerSubtitle}>국회 법안 현황을 한눈에</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <CalendarIcon />
            <Text style={styles.cardTitle}>오늘의 법안</Text>
          </View>
          <Text style={styles.cardContent}>오늘 심의되는 법안을 확인해보세요</Text>
          <TouchableOpacity 
            style={styles.cardButton}
            onPress={() => navigation.navigate('Tab', { screen: 'LawCalendar' })}
          >
            <Text style={styles.cardButtonText}>캘린더 보기</Text>
            <View style={styles.arrowContainer}>
              <ArrowLeftIcon />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.naButton}
        onPress={openNationalAssembly}
      >
        <Text style={styles.naButtonText}>국회 홈페이지 바로가기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  cardContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#000',
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0064FF',
  },
  naButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0064FF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  naButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  arrowContainer: {
    width: 20,
    height: 20,
    backgroundColor: '#0064FF',
    borderRadius: 10,
    transform: [{ rotate: '180deg' }],
  },
});

export default HomeScreen; 