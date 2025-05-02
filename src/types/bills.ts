export interface Bill {
    BILL_ID: string; // 의안 ID
    BILL_NO: string; // 의안 번호
    BILL_NM: string; // 의안 명
    PPSR_KIND: string; // 제안자 구분
    PPSR: string; // 제안자
    PPSL_DT: string; // 제안일
    PPSL_SESS: string; // 제안 회기
    JRCMIT_NM: string; // 소관 위원회 명
    JRCMIT_CMMT_DT: string; // 소관 위원회 회부일
    JRCMIT_PRSNT_DT: string; // 소관 위원회 상정일
    JRCMIT_PROC_DT: string; // 소관 위원회 처리일
    JRCMIT_PROC_RSLT: string; // 소관 위원회 처리 결과
    LAW_CMMT_DT: string; // 법사위 체계자구심사 회부일
    LAW_PRSNT_DT: string; // 법사위 체계자구심사 상정일
    LAW_PROC_DT: string; // 법사위 체계자구심사 처리일
    LAW_PROC_RSLT: string; // 법사위 체계자구심사 처리 결과
    RGS_PRSNT_DT: string; // 본회의 심의 상정일
    RGS_RSLN_DT: string; // 본회의 심의 의결일
    RGS_CONF_NM: string; // 본회의 회의 명
    RGS_CONF_RSLT: string; // 본회의 심의 결과
    GVRN_TRSF_DT: string; // 정부 이송일
    PROM_LAW_NM: string; // 공포 법률명
    PROM_DT: string; // 공포일
    PROM_NO: string; // 공포 번호
}