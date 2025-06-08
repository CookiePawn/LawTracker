import { colors, STORAGE_KEY } from '@/constants';
import NaverLogin from '@react-native-seoul/naver-login';
import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, Image, ActivityIndicator } from 'react-native';
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_APP_NAME } from '@env';
import { LogoPrimary } from '@/assets';
import { signIn } from '@/services';
import { User } from '@/models';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSetUser } from '@/lib/jotai/user';

const SignIn = (): ReactElement => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const setUser = useSetUser();

    useEffect(() => {
        const initialize = async () => {
            try {
                // 네이버 로그인 초기화
                if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET || !NAVER_APP_NAME) {
                    console.error('네이버 로그인 환경 변수가 설정되지 않았습니다.');
                    return;
                }

                NaverLogin.initialize({
                    consumerKey: NAVER_CLIENT_ID,
                    consumerSecret: NAVER_CLIENT_SECRET,
                    appName: NAVER_APP_NAME
                });
            } catch (error) {
                console.error('초기화 중 오류 발생:', error);
            }
        };

        initialize();
    }, []);

    const naverLogin = async () => {
        if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET || !NAVER_APP_NAME) {
            console.error('네이버 로그인 환경 변수가 설정되지 않았습니다.');
            return;
        }

        try {
            const token = await NaverLogin.login();
            getUserProfile(token.successResponse?.accessToken ?? '');
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const getUserProfile = async (accessToken: string) => {
        const profileResult = await NaverLogin.getProfile(accessToken);
        if (profileResult.resultcode === "024") {
            Alert.alert("로그인 실패", profileResult.message);
            return;
        }
        const user: User = {
            id: profileResult.response.id,
            nickname: profileResult.response.nickname ?? '사용자',
            email: profileResult.response.email ?? '',
            age: profileResult.response.age ?? '',
            gender: profileResult.response.gender ?? '',
            profileImage: profileResult.response.profile_image ?? '',
            createdAt: new Date().toISOString(),
            SNS: 'naver',
        }
        try {
            await signIn(user);
            await AsyncStorage.setItem(STORAGE_KEY.USER_ID, user.id);
            setUser(user);
            navigation.navigate('Tab', {
                screen: 'Home',
            });
        } catch {
            Alert.alert("로그인 실패", "다시 시도해주세요.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={LogoPrimary} style={styles.logo} />
                <Text style={styles.title}>국회 추적기</Text>
            </View>

            <View style={styles.loginContainer}>
                <TouchableOpacity onPress={naverLogin} style={styles.naverLoginButton}>
                    <Text style={styles.naverLoginButtonText}>네이버 로그인</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.kakaoLoginButton}>
                    <Text style={styles.kakaoLoginButtonText}>카카오 로그인</Text>
                </TouchableOpacity> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    logoContainer: {
        position: 'absolute',
        top: 150,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        marginBottom: 20,
        gap: 10
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
    },
    loginContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    naverLoginButton: {
        width: '100%',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.naver,
        padding: 15,
        borderRadius: 5,
    },
    naverLoginButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    kakaoLoginButton: {
        width: '100%',
        alignItems: 'center',
        gap: 10,
        padding: 15,
        borderRadius: 5,
        backgroundColor: colors.kakao,
    },
    kakaoLoginButtonText: {
        color: colors.gray600,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignIn;