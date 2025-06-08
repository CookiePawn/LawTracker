import { colors } from '@/constants';
import NaverLogin, { NaverLoginResponse } from '@react-native-seoul/naver-login';
import React, { ReactElement, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Button, Alert } from 'react-native';
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_APP_NAME } from '@env';

const SignIn = (): ReactElement => {
    const [naverToken, setNaverToken] = useState<NaverLoginResponse | null>(null);

    useEffect(() => {
        if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET || !NAVER_APP_NAME) {
            console.error('네이버 로그인 환경 변수가 설정되지 않았습니다.');
            return;
        }

        NaverLogin.initialize({
            consumerKey: NAVER_CLIENT_ID,
            consumerSecret: NAVER_CLIENT_SECRET,
            appName: NAVER_APP_NAME
        });
    }, []);

    const naverLogin = async () => {
        if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET || !NAVER_APP_NAME) {
            console.error('네이버 로그인 환경 변수가 설정되지 않았습니다.');
            return;
        }

        try {
            const token = await NaverLogin.login();
            console.log(`\n\n  Token is fetched  :: ${JSON.stringify(token, null, 2)} \n\n`);
            setNaverToken(token);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const naverLogout = () => {
        NaverLogin.logout();
        setNaverToken(null);
    };

    const getUserProfile = async () => {
        const profileResult = await NaverLogin.getProfile(naverToken?.successResponse?.accessToken ?? '');
        if (profileResult.resultcode === "024") {
            Alert.alert("로그인 실패", profileResult.message);
            return;
        }
        console.log(JSON.stringify(profileResult, null, 2));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={naverLogin}>
                <Text>네이버 로그인</Text>
            </TouchableOpacity>

            {!!naverToken && <Button title="로그아웃하기" onPress={naverLogout} />}

            {!!naverToken && (
                <Button title="회원정보 가져오기" onPress={getUserProfile} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default SignIn;