import Config from 'react-native-config';
import axios, { AxiosError } from 'axios';

// 의안정보 목록조회 API 예시
const BASE_URL = 'https://open.assembly.go.kr/portal/openapi';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 의안 상세 정보 조회
// https://open.assembly.go.kr/portal/data/service/selectAPIServicePage.do/OOWY4R001216HX11461
export const fetchBillDetail = async (billId: string) => {
  try {
    const response = await api.get('/nzmimeepazxkubdpn', {
      params: {
        Key: Config.LAW_API_KEY,
        Type: 'json',
        BILL_ID: billId,
        pIndex: 1,
        pSize: 1,
      },
    });
    
    console.log('의안 상세 정보:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API 응답 오류:', error.response?.data || error.message);
    } else {
      console.error('의안 상세 정보 조회 중 오류 발생:', error);
    }
    throw error;
  }
};

// 회의별 의안목록
// https://open.assembly.go.kr/portal/data/service/selectAPIServicePage.do/OOWY4R001216HX11525
export const fetchBillsByMeeting = async () => {
  try {
    const response = await api.get('/VCONFBILLLIST', {
      params: {
        Key: Config.LAW_API_KEY,
        Type: 'json',
      },
    });
    return response.data.VCONFBILLLIST[1].row;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API 응답 오류:', error.response?.data || error.message);
    } else {
      console.error('회의별 의안 조회 중 오류 발생:', error);
    }
    throw error;
  }
};

// 회의록별 상세정보
// https://open.assembly.go.kr/portal/data/service/selectAPIServicePage.do/OOWY4R001216HX11520
export const fetchMeetingDetail = async (billId: string) => {
  try {
    const response = await api.get('/BILLINFODETAIL', {
      params: {
        Key: Config.LAW_API_KEY,
        Type: 'json',
        BILL_ID: billId,
      },
    });

    console.log('회의록 상세 정보:', JSON.stringify(response.data.BILLINFODETAIL[1].row, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API 응답 오류:', error.response?.data || error.message);
    } else {
      console.error('회의록 상세 정보 조회 중 오류 발생:', error);
    }
    throw error;
  }
};


// 발의자 및 정당 정보 로드
export const fetchBillInfoPPSR = async (billId: string) => {
  try {
    const response = await api.get('/BILLINFOPPSR', {
      params: {
        Key: Config.LAW_API_KEY,
        Type: 'json',
        BILL_ID: billId,
        pIndex: 1,
        pSize: 1,
      },
    });

    // 응답 데이터 구조 확인 및 안전한 처리
    if (!response.data?.BILLINFOPPSR?.[1]?.row?.[0]) {
      return {
        BILL_ID: billId,
        PPSR_NM: '-',
        PPSR_POLY_NM: '-',
      }
    }
    
    return response.data.BILLINFOPPSR[1].row[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API 응답 오류:', error.response?.data || error.message);
    } else {
      console.error('발의자 및 정당 정보 조회 중 오류 발생:', error);
    }
    throw error;
  }
};

// 공동 발의자 정보 로드
export const fetchBillInfoPPSRAll = async (billId: string) => {
  try {
    const response = await api.get('/nzmimeepazxkubdpn', {
      params: {
        Key: Config.LAW_API_KEY,
        Type: 'json',
        BILL_ID: billId,
        pIndex: 1,
        pSize: 1,
        AGE: 22
      },
    });
    if (!response.data?.nzmimeepazxkubdpn?.[1]?.row?.[0]) {
      return {
        BILL_ID: billId,
        PROPOSER: '-',
        PUBL_PROPOSER: '-',
      }
    }
    return response.data.nzmimeepazxkubdpn[1].row[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API 응답 오류:', error.response?.data || error.message);
    } else {
      console.error('공동 발의자 정보 조회 중 오류 발생:', error);
    }
    throw error;
  }
};