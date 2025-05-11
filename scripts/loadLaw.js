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

// API 응답 데이터를 원하는 형식으로 변환하는 함수
function transformBillData(bill) {
    return {
        DATE: bill.DT,
        TAG: bill.BILL_KIND,
        TITLE: bill.BILL_NM.split('(')[0],
        AGENT: bill.BILL_NM.split('(')[1]?.replace(')', '') || '-',
        COMMITTEE: bill.COMMITTEE,
        ACT_STATUS: bill.ACT_STATUS,
        BILL_ID: bill.BILL_ID
    };
}

// 미래 법안 데이터를 원하는 형식으로 변환하는 함수
function transformFutureBillData(bill) {
    // TAG 결정 로직
    let tag = '기타';
    if (bill.BILL_NAME && bill.BILL_NAME.includes('법률안')) {
        tag = '법률안';
    } else if (bill.BILL_NAME && bill.BILL_NAME.includes('예산안')) {
        tag = '예산안';
    }

    return {
        DATE: bill.NOTI_ED_DT,
        TAG: tag,
        TITLE: bill.BILL_NAME,
        AGENT: bill.PROPOSER,
        COMMITTEE: bill.CURR_COMMITTEE,
        ACT_STATUS: "본회의 부의",
        BILL_ID: bill.BILL_ID
    };
}

// 기존 데이터와 새로운 데이터를 병합하는 함수
function mergeBills(existingBills, newBills) {
    const billMap = new Map();
    
    // 기존 데이터를 Map에 추가
    existingBills.forEach(bill => {
        billMap.set(bill.BILL_ID, bill);
    });
    
    // 새로운 데이터로 업데이트 또는 추가
    newBills.forEach(newBill => {
        const existingBill = billMap.get(newBill.BILL_ID);
        if (!existingBill || new Date(newBill.DATE) > new Date(existingBill.DATE)) {
            billMap.set(newBill.BILL_ID, newBill);
        }
    });
    
    return Array.from(billMap.values());
}

async function fetchBillsByMeeting() {
    try {
        const outputPath = path.join(__dirname, '..', 'src', 'constants', 'beforeLaws.json');
        
        // 기존 JSON 파일 읽기
        let existingBills = [];
        try {
            const existingData = await fs.readFile(outputPath, 'utf8');
            existingBills = JSON.parse(existingData);
            console.log('기존 JSON 파일의 법안 수:', existingBills.length);
        } catch (error) {
            console.log('기존 JSON 파일이 없거나 읽을 수 없습니다. 새로 생성합니다.');
        }

        // 마지막 날짜 찾기
        let lastDate = '2024-05-30'; // 기본값
        if (existingBills.length > 0) {
            const sortedBills = existingBills.sort((a, b) => new Date(b.DATE) - new Date(a.DATE));
            lastDate = sortedBills[0].DATE;
        }
        
        const startDate = lastDate;
        const endDate = new Date().toISOString().split('T')[0];
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
                const transformedBills = response.data.nqfvrbsdafrmuzixe[1].row.map(transformBillData);
                newBills = newBills.concat(transformedBills);
            }
        }

        console.log('API에서 새로 가져온 법안 수:', newBills.length);

        // 기존 데이터와 새로운 데이터 병합
        const updatedBills = mergeBills(existingBills, newBills);
        
        console.log('업데이트 후 최종 법안 수:', updatedBills.length);

        // JSON 파일로 저장
        await fs.writeFile(outputPath, JSON.stringify(updatedBills, null, 2), 'utf8');
        console.log(`업데이트된 데이터가 ${outputPath}에 저장되었습니다.`);

    } catch (error) {
        console.error('법안 데이터 가져오기 실패:', error);
        throw error;
    }
}

async function fetchFutureBills() {
    try {
        const outputPath = path.join(__dirname, '..', 'src', 'constants', 'afterLaws.json');
        
        // 기존 JSON 파일 읽기
        let existingBills = [];
        try {
            const existingData = await fs.readFile(outputPath, 'utf8');
            existingBills = JSON.parse(existingData);
            console.log('기존 JSON 파일의 법안 수:', existingBills.length);
        } catch (error) {
            console.log('기존 JSON 파일이 없거나 읽을 수 없습니다. 새로 생성합니다.');
        }

        // 오늘 날짜 이전의 데이터 제거
        const today = new Date().toISOString().split('T')[0];
        existingBills = existingBills.filter(bill => bill.DATE >= today);
        console.log('오늘 이후의 기존 법안 수:', existingBills.length);

        // 시작 날짜는 기존 데이터의 마지막 날짜
        let startDate = today;
        if (existingBills.length > 0) {
            const sortedBills = existingBills.sort((a, b) => new Date(b.DATE) - new Date(a.DATE));
            startDate = sortedBills[0].DATE;
        }
        
        // 종료 날짜는 오늘로부터 한달 뒤
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        const endDateStr = endDate.toISOString().split('T')[0];
        
        // 시작 날짜가 종료 날짜보다 늦으면 시작 날짜를 오늘로 설정
        if (startDate > endDateStr) {
            startDate = today;
        }
        
        console.log(`데이터 가져오기 기간: ${startDate} ~ ${endDateStr}`);
        const dates = getDatesInRange(startDate, endDateStr);
        
        let newBills = [];
        
        for (const date of dates) {
            console.log(`Fetching future bills for date: ${date}`);
            const response = await api.get(`/nknalejkafmvgzmpt?NOTI_ED_DT=${date}`, {
                params: {
                    Key: LAW_API_KEY,
                    Type: 'json',
                    pSize: 100,
                },
            });

            if (response.data && response.data.nknalejkafmvgzmpt && response.data.nknalejkafmvgzmpt[1] && response.data.nknalejkafmvgzmpt[1].row) {
                const transformedBills = response.data.nknalejkafmvgzmpt[1].row.map(transformFutureBillData);
                newBills = newBills.concat(transformedBills);
            }
        }

        console.log('API에서 새로 가져온 법안 수:', newBills.length);

        // 기존 데이터와 새로운 데이터 병합
        const updatedBills = mergeBills(existingBills, newBills);
        
        console.log('업데이트 후 최종 법안 수:', updatedBills.length);

        // JSON 파일로 저장
        await fs.writeFile(outputPath, JSON.stringify(updatedBills, null, 2), 'utf8');
        console.log(`업데이트된 데이터가 ${outputPath}에 저장되었습니다.`);

    } catch (error) {
        console.error('미래 법안 데이터 가져오기 실패:', error);
        throw error;
    }
}

async function main() {
    try {
        await fetchBillsByMeeting();
        await fetchFutureBills();
    } catch (error) {
        console.error('스크립트 실행 중 오류 발생:', error);
        process.exit(1);
    }
}
  
main();