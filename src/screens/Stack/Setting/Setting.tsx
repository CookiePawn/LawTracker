import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { colors, STORAGE_KEY } from '@/constants';
import { ChevronLeftIcon } from '@/assets';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useSetAlert, useUser } from '@/lib';
import NaverLogin from '@react-native-seoul/naver-login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withdrawUser } from '@/services/firebase';
import { Typography } from '@/components';

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
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography style={styles.headerText}>설정</Typography>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <ChevronLeftIcon width={24} height={24} color={colors.gray700} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {/* 계정 관리 섹션 */}
                <View style={styles.section}>
                    <Typography style={styles.sectionTitle}>계정 관리</Typography>
                    <TouchableOpacity style={styles.termsItem} onPress={logout}>
                        <Typography style={styles.termsText}>로그아웃</Typography>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.termsItem} onPress={showWithdrawAlert}>
                        <Typography style={styles.termsText}>회원탈퇴</Typography>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                </View>
                {/* 약관 섹션 */}
                <View style={styles.section}>
                    <Typography style={styles.sectionTitle}>약관</Typography>
                    <View style={styles.termsContainer}>
                        <TouchableOpacity
                            style={styles.termsItem}
                            onPress={() => navigation.navigate('Terms')}
                        >
                            <Typography style={styles.termsText}>이용약관</Typography>
                            <ChevronLeftIcon style={styles.arrow} width={20} height={20} color='#333' />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            style={styles.termsItem}
                            onPress={() => navigation.navigate('PrivacyPolicy')}
                        >
                            <Typography style={styles.termsText}>개인정보 처리방침</Typography>
                            <ChevronLeftIcon style={styles.arrow} width={20} height={20} color='#333' />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            style={styles.termsItem}
                            onPress={() => navigation.navigate('ApiPolicy')}
                        >
                            <Typography style={styles.termsText}>API 이용 정책</Typography>
                            <ChevronLeftIcon style={styles.arrow} width={20} height={20} color='#333' />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                    </View>
                </View>
            </ScrollView>
        </View>
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