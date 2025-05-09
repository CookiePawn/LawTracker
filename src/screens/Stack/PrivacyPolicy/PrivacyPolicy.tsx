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
          현재 국회 추적기는 직접적인 개인정보를 수집하지 않습니다. 서비스 이용을 위한 회원가입이나 개인정보 수집이 필요하지 않습니다.{'\n'}
        </Text>

        <Text style={styles.title}>2. Google AdMob 개인정보 처리</Text>
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

        <Text style={styles.title}>3. 향후 개인정보 수집 및 이용에 관한 안내</Text>
        <Text style={styles.text}>
          향후 서비스 개선 및 확장에 따라 추가적인 개인정보 수집이 필요할 수 있습니다. 이 경우, 본 개인정보 처리방침을 개정하여 변경사항을 사전에 공지할 예정입니다.{'\n\n'}
          개인정보 수집이 필요한 경우, 다음과 같은 사항을 포함하여 개정될 예정입니다:{'\n'}
          - 수집하는 개인정보의 항목{'\n'}
          - 개인정보의 수집 및 이용목적{'\n'}
          - 개인정보의 보유 및 이용기간{'\n'}
          - 개인정보의 제3자 제공 여부{'\n'}
          - 이용자의 권리와 행사방법{'\n'}
        </Text>

        <Text style={styles.title}>4. 개인정보 처리방침 변경</Text>
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