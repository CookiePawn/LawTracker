import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigate';
import { colors } from '@/constants';
import { useUser } from '@/lib';
import { SettingsIcon } from '@/assets';
import { Typography } from '@/components';
import { TabViewComponent } from './components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user] = useUser();
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.headerText}>프로필</Typography>
        <TouchableOpacity onPress={() => navigation.navigate('Setting')} style={styles.headerIcon}>
          <SettingsIcon width={18} height={18} color={colors.gray700} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />
          <View style={styles.profileNameContainer}>
            <Typography style={styles.profileName}>{user?.nickname}</Typography>
            <Typography style={styles.profilePhone}>@{user?.phone}</Typography>
            <Typography style={styles.profileSNS}>{user?.SNS === 'naver' ? '네이버' : '카카오'} 로그인</Typography>
          </View>
        </View>
      </View>
      <TabViewComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gray700,
  },
  headerIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  profileContainer: {
    padding: 20,
  },
  profileImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  profileNameContainer: {
    marginLeft: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profilePhone: {
    fontSize: 12,
    color: colors.gray400,
    marginTop: 3,
  },
  profileSNS: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 5,
  },
});

export default Profile;
