import { BillStatus } from "@/models";

// 의안 통합합 리스트 - 열린 국회(사용 중지)
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

// 의안 리스트 - 열린 국회(사용 중지)
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

// 의안 정보 - 열린 국회 데이터 파싱싱(사용)
export interface Law {
    DATE: string;
    TAG: string;
    TITLE: string;
    AGENT: string;
    COMMITTEE: string;
    ACT_STATUS: string;
    BILL_ID: string;
    ACT_INTRODUCTION_DATE?: string;
    ACT_SUBMISSION_DATE?: string;
    ACT_COMMITTEE_REVIEW_DATE?: string;
    ACT_COMMITTEE_MEETING_DATE?: string;
    ACT_MEETING_DATE?: string;
    ACT_APPROVAL_DATE?: string;
    ACT_VOTE_DATE?: string;
    ACT_GOVERNMENT_TRANSFER_DATE?: string;
    ACT_PROCESSING_DATE?: string;
    ACT_PROMULGATION_DATE?: string;
}

// 의원 정보 - 열린 국회(사용)
export interface AssemblyMember {
    NAAS_CD: string;
    NAAS_NM: string;
    NAAS_CH_NM: string;
    NAAS_EN_NM: string;
    BIRDY_DIV_CD: string;
    BIRDY_DT: string;
    DTY_NM: string;
    PLPT_NM: string;
    ELECD_NM: string;
    ELECD_DIV_NM: string;
    CMIT_NM: string;
    BLNG_CMIT_NM: string;
    RLCT_DIV_NM: string;
    GTELT_ERACO: string;
    NTR_DIV: string;
    NAAS_TEL_NO: string;
    NAAS_EMAIL_ADDR: string;
    NAAS_HP_URL: string;
    AIDE_NM: string;
    CHF_SCRT_NM: string;
    SCRT_NM: string;
    BRF_HST: string;
    OFFM_RNUM_NO: string;
    NAAS_PIC: string;
}

// 의안 상세 정보 - 공공데이터포탈(사용)
export interface LawDetail {
    billId: string;
    billName: string;
    billNo: number;
    passGubn: string;
    procStageCd: string;
    proposeDt: string;
    proposerKind: string;
    summary: string;
}
