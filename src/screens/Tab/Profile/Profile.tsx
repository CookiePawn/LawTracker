import { ChevronLeftIcon, UserIcon } from '@/assets';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigate';
import { colors } from '@/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <UserIcon width={100} height={100} color={colors.gray400}/>
            </View>
            <Text style={styles.profileHeaderText}>프로필</Text>
          </View>
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
              <ChevronLeftIcon style={styles.arrow} width={20} height={20} color='#333'/>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.termsItem}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <Text style={styles.termsText}>개인정보 처리방침</Text>
              <ChevronLeftIcon style={styles.arrow} width={20} height={20} color='#333'/>
            </TouchableOpacity>   
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.termsItem}
              onPress={() => navigation.navigate('ApiPolicy')}
            >
              <Text style={styles.termsText}>API 이용 정책</Text>
              <ChevronLeftIcon style={styles.arrow} width={20} height={20} color='#333'/>
            </TouchableOpacity>
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
