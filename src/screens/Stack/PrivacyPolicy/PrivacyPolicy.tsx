import { ArrowLeftIcon } from '@/assets';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigate';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PrivacyPolicy = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>  
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={20} height={20} color='#333'/>
        </TouchableOpacity>
        <Text style={styles.title}>개인정보 처리방침</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>1. 개인정보 수집 현황</Text>
        <Text style={styles.text}>
          현재 국회 추적기는 개인정보를 수집하지 않습니다. 서비스 이용을 위한 회원가입이나 개인정보 수집이 필요하지 않습니다.{'\n'}
        </Text>

        <Text style={styles.title}>2. 향후 개인정보 수집 및 이용에 관한 안내</Text>
        <Text style={styles.text}>
          향후 서비스 개선 및 확장에 따라 개인정보 수집이 필요할 수 있습니다. 이 경우, 본 개인정보 처리방침을 개정하여 변경사항을 사전에 공지할 예정입니다.{'\n\n'}
          개인정보 수집이 필요한 경우, 다음과 같은 사항을 포함하여 개정될 예정입니다:{'\n'}
          - 수집하는 개인정보의 항목{'\n'}
          - 개인정보의 수집 및 이용목적{'\n'}
          - 개인정보의 보유 및 이용기간{'\n'}
          - 개인정보의 제3자 제공 여부{'\n'}
          - 이용자의 권리와 행사방법{'\n'}
        </Text>

        <Text style={styles.title}>3. 개인정보 처리방침 변경</Text>
        <Text style={styles.text}>
          본 개인정보 처리방침은 법률 및 서비스의 변경사항을 반영하기 위해 수정될 수 있습니다. 개인정보 처리방침이 변경되는 경우, 변경사항을 서비스 내 공지사항을 통해 고지할 것입니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 70,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default PrivacyPolicy; 