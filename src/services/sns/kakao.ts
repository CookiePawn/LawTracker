import { createUid } from "@/utils";
import { getProfile, KakaoOAuthToken, KakaoProfile, login } from "@react-native-seoul/kakao-login";
import { User } from "@/models";
import { Alert } from "react-native";
import { signIn } from "@/services";

export const signInWithKakao = async (): Promise<{ result: number, userId: string }> => {
    try {
        const token: KakaoOAuthToken = await login();
        if (token.accessToken) {
            const profile: KakaoProfile = await getProfile();

            // 새로운 사용자인 경우
            const userId = `userUid_${createUid()}`;

            const user: User = {
                id: userId,
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

                return {
                    result: result.result,
                    userId: result.userId ?? '',
                };
            } catch {
                Alert.alert("로그인 실패", "다시 시도해주세요.");
            }
        }
    } catch (error) {
        console.error(error);
    }
    
    return { result: -1, userId: '' };
};


export const getKakaoUser = async (): Promise<User | null> => {
    try {
        const token: KakaoOAuthToken = await login();
        if (token.accessToken) {
            const profile: KakaoProfile = await getProfile();

            // 새로운 사용자인 경우
            const userId = `userUid_${createUid()}`;

            const user: User = {
                id: userId,
                nickname: profile.nickname ?? '사용자',
                email: profile.email ?? '',
                profileImage: profile.profileImageUrl ?? '',
                createdAt: new Date().toISOString(),
                age: profile.ageRange.slice(4, 6) ?? '',
                gender: profile.gender === 'MALE' ? 'M' : 'F',
                phone: profile.phoneNumber.replace(/^(\+82 |0)/g, '0') ?? '',
                SNS: 'kakao',
            }

            return user;
        }
    } catch (error) {
        console.error(error);
    }

    return null;
};