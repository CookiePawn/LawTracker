import { getKakaoUser } from './kakao';
import { getNaverUser } from './naver';

export * from './kakao';
export * from './naver';


export const signInWithSNS = async (sns: string) => {
    switch (sns) {
        case 'kakao':
            return await getKakaoUser();
        case 'naver':
            return await getNaverUser();
    }
}