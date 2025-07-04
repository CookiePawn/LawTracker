import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, BackHandler, ToastAndroid, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LogoHeader, BellIcon, ChevronLeftIcon } from '@/assets';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '@/types';
import RNExitApp from 'react-native-exit-app';
import { colors, STORAGE_KEY } from '@/constants';
import { noticeData } from './data';
import { NewsCard, LawList, MyLawCard, AdBanner, Typography } from '@/components';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = BottomTabNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const backPressedTime = useRef(0);
  const [noticeIndex, setNoticeIndex] = useState(0);

  useEffect(() => {
    const checkTutorial = async () => {
      const tutorialCompleted = await AsyncStorage.getItem(STORAGE_KEY.TUTORIAL);
      if (tutorialCompleted !== 'true') {
        navigation.navigate('Tutorial');
      }
    };
    checkTutorial();
  }, []);

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

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={LogoHeader} style={styles.logo} />
          <TouchableOpacity style={styles.bellIcon} onPress={() => navigation.navigate('Notification')}>
            <BellIcon width={17} height={17} color={colors.gray600} fill={colors.gray600} />
          </TouchableOpacity>
        </View>
        <View style={styles.noticeSection}>
          <TouchableOpacity style={styles.noticeTitle}>
            <Typography style={styles.noticeTitleText}>공지사항</Typography>
            <ChevronLeftIcon style={styles.noticeTitleIcon} width={17} height={17} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.noticeContent}>
            <Typography style={styles.noticeContentText}>{noticeData[noticeIndex].title}</Typography>
            <View style={styles.noticeContentIcon}>
              <TouchableOpacity disabled={noticeIndex === 0} onPress={() => setNoticeIndex(noticeIndex - 1)}>
                <ChevronLeftIcon style={styles.noticeContentIconUp} color={noticeIndex === 0 ? colors.gray300 : colors.gray500} />
              </TouchableOpacity>
              <TouchableOpacity disabled={noticeIndex === noticeData.length - 1} onPress={() => setNoticeIndex(noticeIndex + 1)}>
                <ChevronLeftIcon style={styles.noticeContentIconDown} color={noticeIndex === noticeData.length - 1 ? colors.gray300 : colors.gray500} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <NewsCard />
        <AdBanner />
        <LawList type='random' />
        <MyLawCard />
        <LawList type='latest' />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    paddingHorizontal: 16,
  },
  logo: {
    width: 140,
    height: 34
  },
  bellIcon: {
    width: 35,
    height: 35,
    backgroundColor: colors.gray100,
    borderRadius: 100,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 7,
    paddingHorizontal: 16,
  },
  noticeTitle: {
    height: '100%',
    backgroundColor: colors.primary,
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTitleText: {
    color: colors.white,
    fontSize: 14,
  },
  noticeTitleIcon: {
    transform: [{ rotate: '180deg' }],
  },
  noticeContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray500,
    paddingVertical: 4,
  },
  noticeContentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.gray600,
  },
  noticeContentIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeContentIconUp: {
    transform: [{ rotate: '90deg' }],
  },
  noticeContentIconDown: {
    transform: [{ rotate: '270deg' }],
  },
});

export default HomeScreen; 