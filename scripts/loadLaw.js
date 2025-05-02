const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BASE_URL = 'https://open.assembly.go.kr/portal/openapi';
const LAW_API_KEY = process.env.LAW_API_KEY;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function fetchBillsByMeeting() {
  try {
    // 기존 bills.json 파일 읽기
    const billsPath = path.join(__dirname, '../src/components/bills.json');
    let existingBills = [];
    
    try {
      if (fs.existsSync(billsPath)) {
        const fileContent = fs.readFileSync(billsPath, 'utf8');
        existingBills = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('기존 bills.json 파일 읽기 실패:', error);
    }
    
    const existingBillIds = new Set(existingBills.map(bill => bill.BILL_ID));
    console.log(`기존 법안 수: ${existingBillIds.size}개`);
    console.log('기존 BILL_ID 샘플:', Array.from(existingBillIds).slice(0, 3));
    
    const response = await api.get('/VCONFBILLLIST', {
      params: {
        Key: LAW_API_KEY,
        Type: 'json',
        pSize: 100,
      },
    });
    
    const bills = response.data.VCONFBILLLIST[1].row;
    console.log(`API에서 받은 법안 수: ${bills.length}개`);
    
    // CONF_ID 수집 및 중복 제거
    const confIds = [...new Set(bills.map(bill => bill.CONF_ID))];
    
    // CONF_ID를 JSON 파일로 저장
    const confIdPath = path.join(__dirname, '../src/components/billConfID.json');
    fs.writeFileSync(confIdPath, JSON.stringify(confIds, null, 2));
    console.log(`CONF_ID가 ${confIdPath}에 저장되었습니다.`);
    console.log(`총 ${confIds.length}개의 고유한 CONF_ID가 저장되었습니다.`);
    
    // 새로운 법안만 필터링
    const newBills = bills.filter(bill => !existingBillIds.has(bill.BILL_ID));
    console.log(`새로운 법안 ${newBills.length}개 발견`);
    
    if (newBills.length === 0) {
      return {
        newDetails: [],
        existingBills: existingBills
      };
    }
    
    // 새로운 법안의 상세 정보만 병렬로 가져오기
    const newBillDetails = await Promise.all(
      newBills.map(bill => fetchMeetingDetail(bill.BILL_ID))
    );
    
    // 상세 정보를 하나의 배열로 평탄화
    return {
      newDetails: newBillDetails.flat().filter(detail => detail !== null),
      existingBills: existingBills
    };
  } catch (error) {
    console.error('법안 데이터 가져오기 실패:', error);
    throw error;
  }
}

async function fetchMeetingDetail(billId) {
  try {
    const response = await api.get('/BILLINFODETAIL', {
      params: {
        Key: LAW_API_KEY,
        Type: 'json',
        BILL_ID: billId,
        pSize: 100,
      },
    });
    return response.data.BILLINFODETAIL[1].row;
  } catch (error) {
    console.error(`법안 상세 정보 가져오기 실패 (${billId}):`, error);
    return null;
  }
}

async function main() {
  try {
    console.log('법안 데이터를 가져오는 중...');
    const { newDetails, existingBills } = await fetchBillsByMeeting();
    
    // 새로운 법안 데이터와 기존 데이터 병합
    const updatedBills = [...existingBills, ...newDetails];
    
    // 업데이트된 데이터 저장
    const outputPath = path.join(__dirname, '../src/components/bills.json');
    fs.writeFileSync(outputPath, JSON.stringify(updatedBills, null, 2));
    
    console.log('\n법안 데이터 업데이트 결과:');
    console.log(`- 기존 법안: ${existingBills.length}개`);
    console.log(`- 새로운 법안 발견: ${newDetails.length}개`);
    console.log(`- 총 ${newDetails.length}개의 법안 데이터 추가`);
    console.log(`- 최종 법안 수: ${updatedBills.length}개`);
  } catch (error) {
    console.error('스크립트 실행 중 오류 발생:', error);
    process.exit(1);
  }
}

main();
