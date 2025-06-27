import { db } from ".";
import { COLLECTIONS } from "@/constants";
import { CommunityPost } from "@/models";
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, query, orderBy, limit, startAfter } from '@react-native-firebase/firestore';

// 커뮤니티 게시글 조회
export const getCommunityPosts = async (
    userUid?: string, 
    postUid?: string, 
    pageSize: number = 10, 
    lastDoc?: any,
    orderByField: 'createdAt' | 'likes' = 'createdAt'
) => {
    const postsRef = collection(db, COLLECTIONS.COMMUNITY);
    
    if (userUid) {
        // 특정 사용자의 게시글 조회
        const snapshot = await getDocs(postsRef);
        const posts = snapshot.docs.map((doc) => doc.data()) as CommunityPost[];
        return posts.filter((post) => post.userUid === userUid);
    }
    
    if (postUid) {
        // 특정 게시글 조회
        const snapshot = await getDocs(postsRef);
        const posts = snapshot.docs.map((doc) => doc.data()) as CommunityPost[];
        return posts.find((post) => post.uid === postUid);
    }
    
    // 정렬 기준에 따른 쿼리 구성
    let q = query(postsRef);
    
    if (orderByField === 'createdAt') {
        q = query(postsRef, orderBy('createdAt', 'desc'));
    } else if (orderByField === 'likes') {
        // likeCount 필드로 정렬 (없으면 0으로 처리)
        q = query(postsRef, orderBy('likeCount', 'desc'));
    }
    
    // 페이지네이션 적용
    if (lastDoc) {
        q = query(q, startAfter(lastDoc), limit(pageSize));
    } else {
        q = query(q, limit(pageSize));
    }
    
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map((doc) => doc.data()) as CommunityPost[];
    
    return {
        posts,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === pageSize
    };
}

// 커뮤니티 게시글 작성
export const createCommunityPost = async (post: CommunityPost) => {
    try {
        const postRef = doc(db, COLLECTIONS.COMMUNITY, post.uid);
        await setDoc(postRef, post);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// 커뮤니티 투표 업데이트
export const updateCommunityPostVote = async (postUid: string, voteCount: string[]) => {
    try {
        const postRef = doc(db, COLLECTIONS.COMMUNITY, postUid);
        await updateDoc(postRef, {
            'vote.count': voteCount
        });
        return true;
    } catch (error) {
        console.error('투표 업데이트 오류:', error);
        return false;
    }
}

// 커뮤니티 좋아요 업데이트
export const updateCommunityPostLike = async (postUid: string, likes: string[]) => {
    try {
        const postRef = doc(db, COLLECTIONS.COMMUNITY, postUid);
        await updateDoc(postRef, {
            'likes': likes,
            'likeCount': likes.length
        });
        return true;
    } catch (error) {
        console.error('좋아요 업데이트 오류:', error);
        return false;
    }
}

// TODO: 댓글 좋아요 추가 및 삭제
// 댓글 좋아요
export const likeComment = async (postUid: string, commentUid: string, userUid: string, isLiked: boolean) => {
    const postRef = doc(db, COLLECTIONS.COMMUNITY, postUid);
    
    // 현재 문서 가져오기
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) {
        throw new Error('게시글을 찾을 수 없습니다.');
    }
    
    const postData = postDoc.data();
    const comments = postData?.comments || {};
    
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

// 기존 게시글들의 likeCount 필드 마이그레이션
export const migrateLikeCount = async () => {
    try {
        const postsRef = collection(db, COLLECTIONS.COMMUNITY);
        const snapshot = await getDocs(postsRef);
        
        const batch = db.batch();
        
        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const likeCount = data.likes?.length || 0;
            
            if (data.likeCount === undefined) {
                batch.update(doc.ref, { likeCount });
            }
        });
        
        await batch.commit();
        console.log('likeCount 마이그레이션 완료');
        return true;
    } catch (error) {
        console.error('likeCount 마이그레이션 오류:', error);
        return false;
    }
}
