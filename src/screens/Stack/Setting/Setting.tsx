import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { colors, STORAGE_KEY } from '@/constants';
import { ChevronLeftIcon, SettingsIcon } from '@/assets';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useSetAlert, useUser } from '@/lib';
import NaverLogin from '@react-native-seoul/naver-login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withdrawUser } from '@/services/firebase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Setting = () => {
    const navigation = useNavigation<NavigationProp>();
    const [user, setUser] = useUser();
    const setAlert = useSetAlert();

    const logout = () => {
        AsyncStorage.removeItem(STORAGE_KEY.USER_ID);
        setUser(null);
        NaverLogin.logout();
        navigation.navigate('SignIn');
    };

    const withdraw = async () => {
        if (!user?.id) return;
        await withdrawUser(user?.id);
        await AsyncStorage.removeItem(STORAGE_KEY.USER_ID);
        await AsyncStorage.removeItem(STORAGE_KEY.TUTORIAL);
        setUser(null);
        NaverLogin.logout();
        navigation.navigate('SignIn');
    }

    const showWithdrawAlert = () => {
        setAlert({
            visible: true,
            title: '회원탈퇴',
            message: '회원탈퇴 하시겠습니까?',
            buttons: [
                { text: '예', onPress: withdraw, style: 'default' },
                { text: '아니요', style: 'cancel' },
            ],
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>설정</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <ChevronLeftIcon width={24} height={24} color={colors.gray700} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {/* 계정 관리 섹션 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>계정 관리</Text>
                    <TouchableOpacity style={styles.termsItem} onPress={logout}>
                        <Text style={styles.termsText}>로그아웃</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.termsItem} onPress={showWithdrawAlert}>
                        <Text style={styles.termsText}>회원탈퇴</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
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
                            <ChevronLeftIcon style={styles.arrow} width={20} height={20} color='#333' />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            style={styles.termsItem}
                            onPress={() => navigation.navigate('PrivacyPolicy')}
                        >
                            <Text style={styles.termsText}>개인정보 처리방침</Text>
                            <ChevronLeftIcon style={styles.arrow} width={20} height={20} color='#333' />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            style={styles.termsItem}
                            onPress={() => navigation.navigate('ApiPolicy')}
                        >
                            <Text style={styles.termsText}>API 이용 정책</Text>
                            <ChevronLeftIcon style={styles.arrow} width={20} height={20} color='#333' />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
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
        left: 0,
        top: 0,
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

export default Setting;