import NaverLogin from "@react-native-seoul/naver-login";
import { Alert } from "react-native";
import Config from "react-native-config";
import { createUid } from "@/utils";
import { User } from "@/models";


export const getNaverUser = async () => {
    if (!Config.NAVER_CLIENT_ID || !Config.NAVER_CLIENT_SECRET || !Config.NAVER_APP_NAME) {
        console.error('네이버 로그인 환경 변수가 설정되지 않았습니다.');
        return;
    }

    try {
        const token = await NaverLogin.login();
        const response = await getUserProfile(token.successResponse?.accessToken ?? '');

        return response;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const getUserProfile = async (accessToken: string) => {
    const profileResult = await NaverLogin.getProfile(accessToken);
    if (profileResult.resultcode === "024") {
        Alert.alert("로그인 실패", profileResult.message);
        return;
    }

    // 새로운 사용자인 경우
    const userId = `userUid_${createUid()}`;

    const user: User = {
        id: userId,
        nickname: profileResult.response.nickname ?? '사용자',
        email: profileResult.response.email ?? '',
        age: profileResult.response.age?.slice(0, 2) ?? '',
        gender: profileResult.response.gender ?? '',
        profileImage: profileResult.response.profile_image ?? '',
        createdAt: new Date().toISOString(),
        SNS: 'naver',
        phone: profileResult.response.mobile ?? '',
    }

    return user;
};