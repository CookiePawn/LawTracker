import { db } from ".";
import { arrayRemove, arrayUnion, collection, doc, getDocs, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { COLLECTIONS } from "@/constants";
import { CommunityPost } from "@/models";

// 커뮤니티 게시글 조회
export const getCommunityPosts = async (userUid?: string, postUid?: string) => {
    const postsRef = collection(db, COLLECTIONS.COMMUNITY);
    const snapshot = await getDocs(postsRef);
    const posts = snapshot.docs.map((doc) => doc.data()) as CommunityPost[];
    if (userUid) {
        return posts.filter((post) => post.userUid === userUid);
    }
    if (postUid) {
        return posts.find((post) => post.uid === postUid);
    }
    return posts;
}


// 댓글 좋아요
export const likeComment = async (postUid: string, commentUid: string, userUid: string, isLiked: boolean) => {
    const postRef = doc(db, COLLECTIONS.COMMUNITY, postUid);
    
    // 현재 문서 가져오기
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) {
        throw new Error('게시글을 찾을 수 없습니다.');
    }
    
    const postData = postDoc.data();
    const comments = postData.comments || {};
    
    // 해당 댓글의 좋아요 배열 업데이트
    if (!comments[commentUid]) {
        comments[commentUid] = {};
    }
    
    if (!comments[commentUid].likes) {
        comments[commentUid].likes = [];
    }
    
    if (isLiked) {
        // 좋아요 취소
        comments[commentUid].likes = comments[commentUid].likes.filter((id: string) => id !== userUid);
    } else {
        // 좋아요 추가
        if (!comments[commentUid].likes.includes(userUid)) {
            comments[commentUid].likes.push(userUid);
        }
    }
    
    // 전체 문서 업데이트
    await setDoc(postRef, { ...postData, comments }, { merge: true });
}
