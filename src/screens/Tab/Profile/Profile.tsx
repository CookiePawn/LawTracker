import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigate';
import { colors } from '@/constants';
import { useUser } from '@/lib';
import { SettingsIcon } from '@/assets';
import { TabView } from 'react-native-tab-view';
import { Typography } from '@/components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user] = useUser();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  const renderScene = ({ route }: { route: { key: string; title: string } }) => {
    switch (route.key) {
      case 'first':
        return <View style={{ flex: 1, backgroundColor: 'red' }} />;
      case 'second':
        return <View style={{ flex: 1, backgroundColor: 'blue' }} />;
    }
  };

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
            <Typography style={styles.profileSNS}>{user?.SNS === 'NAVER' ? '네이버' : '카카오'} 로그인</Typography>
          </View>
        </View>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
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
  profileContainer: {
    marginTop: 20,
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
