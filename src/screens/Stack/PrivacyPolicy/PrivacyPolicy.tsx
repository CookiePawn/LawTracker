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
          국회 추적기는 SNS 로그인을 통해 다음과 같은 개인정보를 수집합니다:{'\n\n'}
          - 이메일 주소 (사용자 식별용){'\n'}
          - 전화번호 (사용자 식별용){'\n'}
          - 닉네임 (사용자 식별용){'\n'}
          - 프로필 사진 (사용자 식별용){'\n'}
          - 성별 (통계용){'\n'}
          - 연령대 (통계용){'\n\n'}
          수집된 정보는 Firebase Firestore에 안전하게 저장되며, 사용자 식별과 서비스 통계 목적으로만 사용됩니다.{'\n'}
        </Text>

        <Text style={styles.title}>2. 개인정보의 수집 및 이용목적</Text>
        <Text style={styles.text}>
          1. 사용자 식별을 위한 정보 (이메일, 전화번호, 닉네임, 프로필 사진){'\n'}
             - 서비스 이용자 식별{'\n'}
             - 계정 관리{'\n'}
             - 서비스 이용 기록 관리{'\n\n'}
          2. 통계용 정보 (성별, 연령대){'\n'}
             - 서비스 이용 통계 분석{'\n'}
             - 맞춤형 서비스 제공{'\n'}
             - 서비스 개선을 위한 데이터 분석{'\n'}
        </Text>

        <Text style={styles.title}>3. 개인정보의 보유 및 이용기간</Text>
        <Text style={styles.text}>
          수집된 개인정보는 회원 탈퇴 시까지 보관되며, 회원 탈퇴 시 즉시 삭제됩니다. 단, 통계용 데이터는 익명화 처리 후 통계 목적으로만 보관될 수 있습니다.{'\n'}
        </Text>

        <Text style={styles.title}>4. Google AdMob 개인정보 처리</Text>
        <Text style={styles.text}>
          본 앱은 Google AdMob을 통해 광고를 제공하고 있습니다. Google AdMob은 다음과 같은 정보를 수집할 수 있습니다:{'\n\n'}
          - 기기 정보 (기기 ID, 운영체제 버전, 하드웨어 모델 등){'\n'}
          - 네트워크 정보 (IP 주소, 네트워크 연결 유형 등){'\n'}
          - 광고 식별자 (Google 광고 ID){'\n'}
          - 앱 사용 데이터 (앱 사용 시간, 앱 내 상호작용 등){'\n\n'}
          이러한 정보는 Google의 개인정보 처리방침에 따라 처리되며, 맞춤형 광고 제공 및 광고 성과 측정에 사용됩니다. Google의 개인정보 처리방침은 다음 링크에서 확인하실 수 있습니다:{'\n'}
          https://policies.google.com/privacy{'\n\n'}
          사용자는 기기의 설정을 통해 광고 식별자를 재설정하거나 맞춤형 광고를 비활성화할 수 있습니다.
        </Text>

        <Text style={styles.title}>5. Firebase 서비스 이용</Text>
        <Text style={styles.text}>
          본 서비스는 Firebase 서비스를 이용하여 다음과 같은 기능을 제공합니다:{'\n\n'}
          - Firebase Authentication: SNS 로그인 처리{'\n'}
          - Firebase Firestore: 사용자 정보 및 법안 데이터 저장{'\n'}
          - Firebase Analytics: 서비스 이용 통계{'\n\n'}
          Firebase 서비스 이용에 따른 개인정보 처리에 대한 자세한 내용은 다음 링크에서 확인하실 수 있습니다:{'\n'}
          https://firebase.google.com/support/privacy{'\n'}
        </Text>

        <Text style={styles.title}>6. 개인정보 처리방침 변경</Text>
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
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
});

export default PrivacyPolicy; 