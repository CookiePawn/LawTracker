import { db } from ".";
import { collection, getDocs } from "firebase/firestore";
import { COLLECTIONS } from "@/constants";
import { CommunityPost } from "@/models";

// 커뮤니티 게시글 조회
export const getCommunityPosts = async (userUid?: string) => {
    const postsRef = collection(db, COLLECTIONS.COMMUNITY);
    const snapshot = await getDocs(postsRef);
    const posts = snapshot.docs.map((doc) => doc.data()) as CommunityPost[];
    if (userUid) {
        return posts.filter((post) => post.userUid === userUid);
    }
    return posts;
}
