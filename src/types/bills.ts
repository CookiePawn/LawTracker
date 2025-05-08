export interface Bill {
    BILL_ID: string; // 의안 ID
    BILL_NO: string; // 의안 번호
    BILL_NM: string; // 의안 명
    PPSR_KIND: string; // 제안자 구분
    PPSR: string; // 제안자
    PPSL_DT: string; // 제안일
    PPSL_SESS: string; // 제안 회기
    JRCMIT_NM: string | null; // 소관 위원회 명
    JRCMIT_CMMT_DT: string | null; // 소관 위원회 회부일
    JRCMIT_PRSNT_DT: string | null; // 소관 위원회 상정일
    JRCMIT_PROC_DT: string | null; // 소관 위원회 처리일
    JRCMIT_PROC_RSLT: string | null; // 소관 위원회 처리 결과
    LAW_CMMT_DT: string | null; // 법사위 체계자구심사 회부일
    LAW_PRSNT_DT: string | null; // 법사위 체계자구심사 상정일
    LAW_PROC_DT: string | null; // 법사위 체계자구심사 처리일
    LAW_PROC_RSLT: string | null; // 법사위 체계자구심사 처리 결과
    RGS_PRSNT_DT: string | null; // 본회의 심의 상정일
    RGS_RSLN_DT: string | null; // 본회의 심의 의결일
    RGS_CONF_NM: string | null; // 본회의 회의 명
    RGS_CONF_RSLT: string | null; // 본회의 심의 결과
    GVRN_TRSF_DT: string | null; // 정부 이송일
    PROM_LAW_NM: string | null; // 공포 법률명
    PROM_DT: string | null; // 공포일
    PROM_NO: string | null; // 공포 번호
}


export interface Nqfvrbsdafrmuzixe {
    SEQ: number; // 순번
    DT: string; //일자
    BILL_KIND: string; // 의안구분
    AGE: string; //대수
    BILL_NO: string; // 의안번호
    BILL_NM: string; // 의안명
    STAGE: string; // 단계
    DTL_STAGE: string; // 세부단계
    COMMITTEE: string; // 소관위원회
    ACT_STATUS: BillStatus; // 활동상태
    BILL_ID: string; // 의안ID
    LINK_URL: string; // 링크URL
    COMMITTEE_ID: string | null; // 소관위원회ID
}

export enum BillStatus {
    INTRODUCTION = '발의', //1   
    SUBMISSION = '제출', //2
    GOVERNMENT_TRANSFER = '정부이송', //3
    COMMITTEE_REVIEW = '회부', //4
    COMMITTEE_MEETING = '본회의 부의', //5
    MEETING = '회의', //6
    APPROVAL = '상정', //7
    PROCESSING = '처리', //8
    VOTE = '의결', //9
    PROMULGATION = '공포', //10
}
