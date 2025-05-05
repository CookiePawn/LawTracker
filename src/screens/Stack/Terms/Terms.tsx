import { ArrowLeftIcon } from '@/assets';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigate';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Terms = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>  
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={20} height={20} color='#333'/>
        </TouchableOpacity>
        <Text style={styles.title}>이용약관</Text>
      </View> 
      <ScrollView style={styles.content}>
        <Text style={styles.title}>제1조 (목적)</Text>
        <Text style={styles.text}>
          이 약관은 법률 트래커(이하 "회사")가 제공하는 서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </Text>

        <Text style={styles.title}>제2조 (정의)</Text>
        <Text style={styles.text}>
          1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.{'\n'}
          2. "회원"이란 회사와 서비스 이용계약을 체결한 자를 말합니다.
        </Text>

        <Text style={styles.title}>제3조 (서비스의 제공)</Text>
        <Text style={styles.text}>
          회사는 다음과 같은 서비스를 제공합니다:{'\n'}
          1. 법률 정보 제공 서비스{'\n'}
          2. 법률 문서 관리 서비스{'\n'}
          3. 기타 회사가 정하는 서비스
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

export default Terms; 