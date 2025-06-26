import { COLLECTIONS } from "@/constants";
import { db } from ".";
import { doc, getDoc, updateDoc, arrayUnion, increment } from '@react-native-firebase/firestore';

// 의안 찬/반 투표 체크 후 증가
export const increaseVoteCount = async (userUid: string, billId: string, voteType: 'VOTE_TRUE' | 'VOTE_FALSE') => {
    try {
        // 사용자 문서 참조
        const userRef = doc(db, COLLECTIONS.USERS, userUid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            return '404';
        }

        const userData = userDoc.data();

        // 사용자의 투표 기록 확인
        if (userData?.voteList?.some((vote: string) => vote.includes(billId))) {
            const voteIndex = userData.voteList.findIndex((vote: string) => vote.includes(billId));
            const vote = userData.voteList[voteIndex];
            const voteType = vote.split('-')[1];
            if (voteType === '1') {
                return '411';
            } else if (voteType === '0') {
                return '410';
            }
        }

        // 법안 문서 참조
        const lawRef = doc(db, COLLECTIONS.LAWS, billId);
        const lawDoc = await getDoc(lawRef);

        if (!lawDoc.exists()) {
            return '404';
        }

        // 사용자의 투표 기록에 추가
        await updateDoc(userRef, {
            voteList: arrayUnion(`${billId}-${voteType === 'VOTE_TRUE' ? '1' : '0'}`)
        });

        // 법안의 투표 수 증가
        await updateDoc(lawRef, {
            [voteType]: increment(1)
        });

        return '200';

    } catch (error) {
        return '404';
    }
};

// 의안 찬/반 바꾸기
export const toggleVoteLaw = async (userUid: string, billId: string, voteType: 'VOTE_TRUE' | 'VOTE_FALSE') => {
    const lawRef = doc(db, COLLECTIONS.LAWS, billId);
    // 사용자 문서 참조
    const userRef = doc(db, COLLECTIONS.USERS, userUid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        throw new Error('사용자를 찾을 수 없습니다.');
    }

    const userData = userDoc.data();
    const voteList = userData?.voteList || [];
    
    // 기존 투표 데이터 변환
    const newVoteList = voteList.map((vote: string) => {
        if (vote.startsWith(billId)) {
            // 해당 의안의 투표를 새로운 투표 타입으로 변경
            return `${billId}-${voteType === 'VOTE_TRUE' ? '1' : '0'}`;
        }
        return vote;
    });

    // 사용자의 투표 기록 업데이트
    await updateDoc(userRef, {
        voteList: newVoteList
    });

    await updateDoc(lawRef, {
        [voteType]: increment(1),
        [voteType === 'VOTE_TRUE' ? 'VOTE_FALSE' : 'VOTE_TRUE']: increment(-1)
    });
};