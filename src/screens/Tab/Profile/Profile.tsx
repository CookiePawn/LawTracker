import { ChevronLeftIcon } from '@/assets';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigate';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Profile = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
    paddingHorizontal: 20,
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
    padding: 16,
    paddingHorizontal: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
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
