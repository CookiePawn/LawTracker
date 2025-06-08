export interface Law {
    DATE: string;
    TAG: string;
    TITLE: string;
    AGENT: string;
    COMMITTEE: string;
    ACT_STATUS: string;
    BILL_ID: string;
    SUMMARY?: string;
    // 조회수   
    VIEW_COUNT?: number;
    // 찬성 투표수
    VOTE_TRUE?: number;
    // 반대 투표수
    VOTE_FALSE?: number;
}

// 법안 활동 상태
export enum BillStatus {
    INTRODUCTION = '발의', // 1. 의원이 법안을 발의
    SUBMISSION = '제출', // 2. 법안을 국회에 제출
    COMMITTEE_REVIEW = '회부', // 3. 위원회에 회부
    COMMITTEE_MEETING = '본회의 부의', // 4. 위원회에서 심사
    MEETING = '회의', // 5. 위원회 회의 진행
    APPROVAL = '상정', // 6. 본회의에 상정
    VOTE = '의결', // 7. 본회의에서 의결
    GOVERNMENT_TRANSFER = '정부이송', // 8. 정부로 이송
    PROCESSING = '처리', // 9. 정부에서 처리
    PROMULGATION = '공포', // 10. 대통령이 공포
}