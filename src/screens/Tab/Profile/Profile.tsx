import { ChevronLeftIcon } from '@/assets';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigate';
import { colors, STORAGE_KEY } from '@/constants';
import { useSetAlert, useUser } from '@/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NaverLogin from '@react-native-seoul/naver-login';
import { withdrawUser } from '@/services/firebase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useUser();
  const setAlert = useSetAlert();

  const logout = () => {
    AsyncStorage.removeItem(STORAGE_KEY.USER_ID);
    setUser(null);
    NaverLogin.logout();
    navigation.navigate('SignIn');
  };

  const withdraw = async () => {
    if (!user?.id) return;
    await withdrawUser(user?.id);
    await AsyncStorage.removeItem(STORAGE_KEY.USER_ID);
    await AsyncStorage.removeItem(STORAGE_KEY.TUTORIAL);
    setUser(null);
    NaverLogin.logout();
    navigation.navigate('SignIn');
  }

  const showWithdrawAlert = () => {
    setAlert({
      visible: true,
      title: '회원탈퇴',
      message: '회원탈퇴 하시겠습니까?',
      buttons: [
        { text: '예', onPress: withdraw, style: 'default' },
        { text: '아니요', style: 'cancel' },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />
            </View>
            <Text style={styles.profileHeaderText}>{user?.nickname}</Text>
            <Text style={styles.profileHeaderSubText}>{user?.email}</Text>
            <Text style={styles.profileHeaderSubText}>{user?.SNS === 'naver' ? '네이버 로그인' : '카카오 로그인'}</Text>
            <Text style={styles.profileHeaderSubText}>나이: {user?.age}</Text>
            <Text style={styles.profileHeaderSubText}>성별: {user?.gender === 'M' ? '남자' : '여자'}</Text>
            <Text style={styles.profileHeaderSubText}>가입일: {user?.createdAt}</Text>
          </View>
        </View>
        {/* 계정 관리 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정 관리</Text>
          <TouchableOpacity style={styles.termsItem} onPress={logout}>
            <Text style={styles.termsText}>로그아웃</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.termsItem} onPress={showWithdrawAlert}>
            <Text style={styles.termsText}>회원탈퇴</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>
        {/* 약관 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>약관</Text>
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.termsItem}
              onPress={() => navigation.navigate('Terms')}
            >
              <Text style={styles.termsText}>이용약관</Text>
              <ChevronLeftIcon style={styles.arrow} width={20} height={20} color='#333' />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.termsItem}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <Text style={styles.termsText}>개인정보 처리방침</Text>
              <ChevronLeftIcon style={styles.arrow} width={20} height={20} color='#333' />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.termsItem}
              onPress={() => navigation.navigate('ApiPolicy')}
            >
              <Text style={styles.termsText}>API 이용 정책</Text>
              <ChevronLeftIcon style={styles.arrow} width={20} height={20} color='#333' />
            </TouchableOpacity>
            <View style={styles.divider} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileSection: {
    paddingVertical: 20,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderColor: colors.gray100,
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  profileHeaderSubText: {
    fontSize: 14,
    color: colors.gray500,
  },
  profileHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray700,
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  userInfoContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  termsContainer: {
    backgroundColor: '#fff',
  },
  termsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  termsText: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    transform: [{ rotate: '180deg' }],
  },
});

export default Profile;
