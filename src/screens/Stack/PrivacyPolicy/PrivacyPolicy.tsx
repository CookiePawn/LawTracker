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
        <Text style={styles.title}>1. 개인정보의 수집 및 이용 목적</Text>
        <Text style={styles.text}>
          회사는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.{'\n\n'}
          1. 회원 관리{'\n'}
          - 회원제 서비스 이용에 따른 본인확인{'\n'}
          - 불량회원의 부정이용 방지{'\n'}
          2. 서비스 제공{'\n'}
          - 법률 정보 제공{'\n'}
          - 법률 문서 관리
        </Text>

        <Text style={styles.title}>2. 수집하는 개인정보의 항목</Text>
        <Text style={styles.text}>
          회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.{'\n\n'}
          1. 필수항목: 이메일, 비밀번호, 이름{'\n'}
          2. 선택항목: 전화번호, 주소
        </Text>

        <Text style={styles.title}>3. 개인정보의 보유 및 이용기간</Text>
        <Text style={styles.text}>
          회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
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