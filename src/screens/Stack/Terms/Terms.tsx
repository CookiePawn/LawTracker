import { ArrowLeftIcon } from '@/assets';
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { Typography } from '@/components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Terms = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleApiLink = () => {
    Linking.openURL('https://open.assembly.go.kr/portal/openapi/openApiNaListPage.do');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>  
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={20} height={20} color='#333'/>
        </TouchableOpacity>
        <Typography style={styles.title}>이용약관</Typography>
      </View> 
      <ScrollView style={styles.content}>
        <Typography style={styles.title}>제1조 (목적)</Typography>
        <Typography style={styles.text}>
          이 약관은 국회 추적기(이하 "서비스")가 제공하는 서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.{'\n'}
        </Typography>

        <Typography style={styles.title}>제2조 (정의)</Typography>
        <Typography style={styles.text}>
          1. "서비스"란 본 서비스가 제공하는 모든 서비스를 의미합니다.{'\n'}
          2. "회원"이란 본 서비스 이용계약을 체결한 자를 말합니다.{'\n'}
          3. "SNS 로그인"이란 카카오, 네이버 등 소셜 네트워크 서비스를 통한 회원가입 및 로그인을 의미합니다.{'\n'}
        </Typography>

        <Typography style={styles.title}>제3조 (서비스의 제공)</Typography>
        <Typography style={styles.text}>
          본 서비스는 다음과 같은 서비스를 제공합니다:{'\n'}
          1. 법률 정보 제공 서비스{'\n'}
          2. 사용자 맞춤형 법안 추천 서비스{'\n'}
          3. 법안 관련 통계 및 분석 서비스{'\n'}
        </Typography>

        <Typography style={styles.title}>제4조 (데이터 출처 및 저장)</Typography>
        <Typography style={styles.text}>
          본 서비스는 다음과 같은 데이터를 활용하여 제작되었습니다:{'\n'}
          1. 대한민국 국회에서 제공하는 열린국회정보 Open API{'\n'}
          2. 공공데이터포털(data.go.kr)에서 제공하는 국회 국회사무처_의안 정보 API{'\n'}
          3. Firebase Firestore를 통한 법안 및 의안 데이터 저장{'\n\n'}
          모든 법률 정보는 국회와 공공데이터포털에서 공식적으로 제공하는 데이터를 기반으로 하며, Firebase Firestore에 저장되어 제공됩니다.{'\n'}
        </Typography>

        <Typography style={styles.title}>제5조 (회원가입 및 개인정보)</Typography>
        <Typography style={styles.text}>
          1. 회원가입은 SNS 로그인을 통해 이루어집니다.{'\n'}
          2. 서비스 이용을 위해 다음 정보가 수집됩니다:{'\n'}
             - 이메일 주소 (사용자 식별용){'\n'}
             - 전화번호 (사용자 식별용){'\n'}
             - 닉네임 (사용자 식별용){'\n'}
             - 프로필 사진 (사용자 식별용){'\n'}
             - 성별 (통계용){'\n'}
             - 연령대 (통계용){'\n'}
          3. 수집된 정보는 Firebase Firestore에 안전하게 저장됩니다.{'\n'}
        </Typography>

        <Typography style={styles.text}>
          본 서비스는 대한민국 국회의 공식 서비스가 아니며, 국회를 대표하지 않습니다. 제공되는 정보는 열린국회정보 Open API와 공공데이터포털 API를 통해 수집된 데이터를 기반으로 하며, 최신 정보와 차이가 있을 수 있습니다.{'\n\n'}
          정확한 법률 정보는 국회 홈페이지, 공공데이터포털 또는 관련 공식 채널을 통해 확인하시기 바랍니다.{'\n'}
        </Typography>

        <TouchableOpacity onPress={handleApiLink}>
          <Typography style={styles.apiLinkText}>
            열린국회정보 Open API 바로가기
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Linking.openURL('https://www.data.go.kr/data/3037286/openapi.do')}>
          <Typography style={styles.apiLinkText}>
            공공데이터포털 의안 정보 API 바로가기
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  apiLinkText: {
    color: '#5046E6',
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
});

export default Terms; 