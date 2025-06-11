import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigate';
import { colors } from '@/constants';
import { useUser } from '@/lib';
import { SettingsIcon } from '@/assets';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user] = useUser();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>프로필</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Setting')} style={styles.headerIcon}>
          <SettingsIcon width={18} height={18} color={colors.gray700} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />
            </View>
            <Text style={styles.profileHeaderText}>{user?.nickname}</Text>
            <Text style={styles.profileHeaderSubText}>{user?.email}</Text>
            <Text style={styles.profileHeaderSubText}>{user?.SNS === 'naver' ? '네이버 로그인' : '카카오 로그인'}</Text>
            {user?.age && user?.age !== '' && (
              <Text style={styles.profileHeaderSubText}>나이: {user?.age}</Text>
            )}
            {user?.gender && user?.gender !== '' && (
              <Text style={styles.profileHeaderSubText}>성별: {user?.gender === 'M' ? '남자' : '여자'}</Text>
            )}
            {user?.phone && user?.phone !== '' && (
              <Text style={styles.profileHeaderSubText}>전화번호: {user?.phone}</Text>
            )}
            <Text style={styles.profileHeaderSubText}>가입일: {user?.createdAt}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray700,
  },
  headerIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
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
});

export default Profile;
