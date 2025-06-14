export interface User {
    id: string;
    nickname: string;
    email: string;
    age?: string;
    gender?: string;
    phone?: string;
    profileImage: string;
    createdAt: string;
    SNS: string;
    FAVORITE_LAWS?: string[];
    phone_hash?: string;
}