import { ArrowLeftIcon } from '@/assets';
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { Typography } from '@/components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ApiPolicy = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleApiLink = () => {
    Linking.openURL('https://open.assembly.go.kr/portal/openapi/openApiNaListPage.do');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>  
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={20} height={20} color='#333'/>
        </TouchableOpacity>
        <Typography style={styles.title}>API 이용 정책</Typography>
      </View>
      <ScrollView style={styles.content}>
        <Typography style={styles.title}>1. 데이터 출처</Typography>
        <Typography style={styles.text}>
          본 앱은 대한민국 국회에서 제공하는 열린국회정보 Open API를 활용하여 제작되었습니다. 모든 법률 정보는 국회에서 공식적으로 제공하는 데이터를 기반으로 합니다.{'\n'}
        </Typography>

        <Typography style={styles.title}>2. 면책 조항</Typography>
        <Typography style={styles.text}>
          본 앱은 대한민국 국회의 공식 앱이 아니며, 국회를 대표하지 않습니다. 제공되는 정보는 열린국회정보 Open API를 통해 수집된 데이터를 기반으로 하며, 최신 정보와 차이가 있을 수 있습니다.{'\n\n'}
          정확한 법률 정보는 국회 홈페이지 또는 관련 공식 채널을 통해 확인하시기 바랍니다.{'\n'}
        </Typography>

        <Typography style={styles.title}>3. API 이용 정책</Typography>
        <Typography style={styles.text}>
          본 앱은 열린국회정보 Open API의 이용약관을 준수하며, 다음과 같은 정책을 따릅니다:{'\n\n'}
          - API 호출 횟수 제한 준수{'\n'}
          - 데이터 출처 명시{'\n'}
          - 저작권 보호{'\n'}
          - 데이터 정확성 유지{'\n'}
        </Typography>

        <TouchableOpacity onPress={handleApiLink}>
          <Typography style={styles.apiLinkText}>
            열린국회정보 Open API 바로가기
          </Typography>
        </TouchableOpacity>
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
  apiLinkText: {
    color: '#5046E6',
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
});

export default ApiPolicy; 