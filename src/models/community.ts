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
    vote?: Vote;
}

export interface Comment {
    uid: string;
    nickname: string;
    profileImage?: string;
    content: string;
    createdAt: string;
    likes?: string[];
}

export interface Vote {
    title: string;
    item1?: string;
    item2?: string;
    item3?: string;
    item4?: string;
    item5?: string;
    count?: string[];
}