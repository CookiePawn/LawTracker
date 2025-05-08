import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, BackHandler, ToastAndroid, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LogoHeader, BellIcon, ChevronLeftIcon } from '@/assets';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '@/types';
import RNExitApp from 'react-native-exit-app';
import { colors } from '@/constants/colors';
import { noticeData } from './data';
import { NewsCard, LawList, MyLawCard } from '@/components';

type NavigationProp = BottomTabNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const backPressedTime = useRef(0);
  const [noticeIndex, setNoticeIndex] = useState(0);

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
            <Text style={styles.noticeTitleText}>공지사항</Text>
            <ChevronLeftIcon style={styles.noticeTitleIcon} width={17} height={17} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.noticeContent}>
            <Text style={styles.noticeContentText}>{noticeData[noticeIndex].title}</Text>
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
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