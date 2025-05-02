import { LAW_API_KEY } from '@env';

// 의안정보 목록조회 API 예시
const API_KEY = LAW_API_KEY;
const BASE_URL = 'https://open.assembly.go.kr/portal/openapi';

// 법안 목록 조회
export const fetchBills = async () => {
  const response = await fetch(
    `${BASE_URL}/nzmimeepazxkubdpn?Key=${API_KEY}&Type=json&pSize=100`
  );
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
  return data;
};