import { colors, STORAGE_KEY } from '@/constants';
import NaverLogin from '@react-native-seoul/naver-login';
import React, { ReactElement, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ToastAndroid, BackHandler } from 'react-native';
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_APP_NAME } from '@env';
import { SplashLogoIcon } from '@/assets';
import { signIn } from '@/services';
import { User } from '@/models';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSetUser, useSetAlert } from '@/lib';
import RNExitApp from 'react-native-exit-app';
import { login, KakaoOAuthToken, KakaoProfile, getProfile } from '@react-native-seoul/kakao-login';
import { Typography } from '@/components';


const SignIn = (): ReactElement => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const setUser = useSetUser();
    const backPressedTime = useRef(0);
    const setAlert = useSetAlert();
    
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

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                const currentTime = new Date().getTime();
                const timeDiff = currentTime - backPressedTime.current;

                if (timeDiff < 2000) { // 2초 이내에 두 번 누른 경우
                    RNExitApp.exitApp();
                    return true;
                }

                backPressedTime.current = currentTime;
                ToastAndroid.show('한번 더 누르면 종료됩니다', ToastAndroid.SHORT);
                return true;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

            return () => {
                backHandler.remove();
            };
        }, [])
    );

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
            age: profileResult.response.age?.slice(0, 2) ?? '',
            gender: profileResult.response.gender ?? '',
            profileImage: profileResult.response.profile_image ?? '',
            createdAt: new Date().toISOString(),
            SNS: 'naver',
            phone: profileResult.response.mobile ?? '',
        }
        try {
            const result = await signIn(user);

            if (result === -2) {
                setAlert({
                    visible: true,
                    title: "알림",
                    message: "이미 다른 SNS로 가입된 계정입니다.",
                    buttons: [
                        { text: '확인', style: 'default' },
                    ],
                });
                return;
            }

            setAlert({
                visible: true,
                title: result === 0 ? "회원가입" : "로그인",
                message: result === 0 ? "회원가입이 완료되었습니다." : "로그인이 완료되었습니다.",
                buttons: [
                    { text: '확인', style: 'default' },
                ],
            });
            setUser(user);
            navigation.navigate('Tab', {
                screen: 'Home',
            });
        } catch {
            Alert.alert("로그인 실패", "다시 시도해주세요.");
        }
    };

    const signInWithKakao = async (): Promise<void> => {
        try {
            const token: KakaoOAuthToken = await login();
            if (token.accessToken) {
                const profile: KakaoProfile = await getProfile();
                const user: User = {
                    id: profile.id.toString(),
                    nickname: profile.nickname ?? '사용자',
                    email: profile.email ?? '',
                    profileImage: profile.profileImageUrl ?? '',
                    createdAt: new Date().toISOString(),
                    age: profile.ageRange.slice(4, 6) ?? '',
                    gender: profile.gender === 'MALE' ? 'M' : 'F',
                    phone: profile.phoneNumber.replace(/^(\+82 |0)/g, '0') ?? '',
                    SNS: 'kakao',
                }
                try {
                    const result = await signIn(user);
                    setAlert({
                        visible: true,
                        title: result === 0 ? "회원가입" : "로그인",
                        message: result === 0 ? "회원가입이 완료되었습니다." : "로그인이 완료되었습니다.",
                        buttons: [
                            { text: '확인', style: 'default' },
                        ],
                    });
                    await AsyncStorage.setItem(STORAGE_KEY.USER_ID, user.id);
                    setUser(user);
                    navigation.navigate('Tab', {
                        screen: 'Home',
                    });
                } catch {
                    Alert.alert("로그인 실패", "다시 시도해주세요.");
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <SplashLogoIcon width={200} height={200} color={colors.primary} />
            </View>

            <View style={styles.loginContainer}>
                <TouchableOpacity onPress={naverLogin} style={styles.naverLoginButton}>
                    <Typography style={styles.naverLoginButtonText}>네이버 로그인</Typography>
                </TouchableOpacity>
                {__DEV__ &&
                    <TouchableOpacity onPress={signInWithKakao} style={styles.kakaoLoginButton}>
                        <Typography style={styles.kakaoLoginButtonText}>카카오 로그인</Typography>
                    </TouchableOpacity>
                }
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
        borderRadius: 16,
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
        borderRadius: 16,
        backgroundColor: colors.kakao,
    },
    kakaoLoginButtonText: {
        color: colors.gray600,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignIn;