const axios = require('axios');
const fs = require('fs').promises;
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

// 날짜 범위를 생성하는 함수
function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

async function fetchBillsByMeeting() {
    try {
        const outputPath = path.join(__dirname, '..', 'src', 'components', 'nqfvrbsdafrmuzixe.json');
        
        // 기존 JSON 파일 읽기
        let existingBills = [];
        try {
            const existingData = await fs.readFile(outputPath, 'utf8');
            existingBills = JSON.parse(existingData);
            console.log('기존 JSON 파일의 법안 수:', existingBills.length);
        } catch (error) {
            console.log('기존 JSON 파일이 없거나 읽을 수 없습니다. 새로 생성합니다.');
        }

        const startDate = '2024-07-01';
        const endDate = '2025-05-05';
        const dates = getDatesInRange(startDate, endDate);
        
        let newBills = [];
        
        for (const date of dates) {
            console.log(`Fetching bills for date: ${date}`);
            const response = await api.get(`/nqfvrbsdafrmuzixe?AGE=22&DT=${date}`, {
                params: {
                    Key: LAW_API_KEY,
                    Type: 'json',
                    pSize: 100,
                },
            });

            if (response.data && response.data.nqfvrbsdafrmuzixe && response.data.nqfvrbsdafrmuzixe[1] && response.data.nqfvrbsdafrmuzixe[1].row) {
                newBills = newBills.concat(response.data.nqfvrbsdafrmuzixe[1].row);
            }
        }

        console.log('API에서 새로 가져온 법안 수:', newBills.length);

        // 중복 체크
        const existingSeqs = new Set(existingBills.map(bill => bill.SEQ));
        const duplicates = newBills.filter(bill => existingSeqs.has(bill.SEQ));
        console.log('중복된 법안 수:', duplicates.length);

        // 중복 제거 후 새로운 법안만 추가
        const uniqueNewBills = newBills.filter(bill => !existingSeqs.has(bill.SEQ));
        console.log('추가될 새로운 법안 수:', uniqueNewBills.length);

        // 기존 데이터와 새로운 데이터 합치기
        const updatedBills = [...existingBills, ...uniqueNewBills];

        // JSON 파일로 저장
        await fs.writeFile(outputPath, JSON.stringify(updatedBills, null, 2), 'utf8');
        console.log(`업데이트된 데이터가 ${outputPath}에 저장되었습니다.`);
        console.log('최종 법안 수:', updatedBills.length);

    } catch (error) {
        console.error('법안 데이터 가져오기 실패:', error);
        throw error;
    }
}

async function main() {
    try {
      await fetchBillsByMeeting();
    } catch (error) {
      console.error('스크립트 실행 중 오류 발생:', error);
      process.exit(1);
    }
  }
  
  main();