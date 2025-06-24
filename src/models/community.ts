export interface CommunityPost {
    uid: string;
    userUid: string;
    nickname: string;
    profileImage: string;
    billID: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    viewCount: string[];
    likes: string[];
    comments: Comment[];
}

export interface Comment {
    uid: string;
    nickname: string;
    profileImage?: string;
    content: string;
    createdAt: string;
}