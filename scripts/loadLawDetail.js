const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const BASE_URL = 'https://apis.data.go.kr/9710000/BillInfoService2';
const API_KEY = process.env.DECODE_BILL_API_KEY;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

async function fetchBillDetails() {
    try {
        const outputPath = path.join(__dirname, '..', 'src', 'constants', 'lawDetails.json');
        
        // 기존 JSON 파일 읽기
        let existingBills = [];
        try {
            const existingData = await fs.readFile(outputPath, 'utf8');
            existingBills = JSON.parse(existingData);
            console.log('기존 JSON 파일의 의안 수:', existingBills.length);
        } catch (error) {
            console.log('기존 JSON 파일이 없거나 읽을 수 없습니다. 새로 생성합니다.');
        }

        let allBills = [];
        let pageIndex = 1;
        const pageSize = 100; // 한 번에 가져올 데이터 수

        while (true) {
            console.log(`Fetching page ${pageIndex}...`);
            const response = await api.get('/getBillInfoList?ord=22', {
                params: {
                    serviceKey: API_KEY,
                    pageNo: pageIndex,
                    numOfRows: pageSize,
                    resultType: 'json',
                },
            });

            console.log('Response structure:', {
                hasData: !!response.data,
                hasResponse: !!(response.data && response.data.response),
                hasBody: !!(response.data && response.data.response && response.data.response.body),
                hasItems: !!(response.data && response.data.response && response.data.response.body && response.data.response.body.items)
            });

            if (!response.data || !response.data.response || !response.data.response.body || !response.data.response.body.items) {
                console.log('No more data available');
                break;
            }

            // items가 객체인 경우 배열로 변환
            const items = response.data.response.body.items;
            const bills = Array.isArray(items) ? items : [items];
            
            if (bills.length === 0) {
                console.log('Empty page received');
                break;
            }

            // 모든 의안 데이터 추출
            const extractedBills = bills.map(bill => bill.item).flat();
            
            // 중복 체크
            const newBills = extractedBills.filter(newBill => 
                !existingBills.some(existingBill => existingBill.billId === newBill.billId)
            );

            // 중복된 의안이 있는 경우 로그 출력
            if (newBills.length < extractedBills.length) {
                console.log(`중복된 의안 ${extractedBills.length - newBills.length}개 발견`);
            }

            // 모든 의안이 중복인 경우에만 종료
            if (newBills.length === 0) {
                console.log('이 페이지의 모든 의안이 중복입니다. 스크립트를 종료합니다.');
                process.exit(0);
            }

            // 중복되지 않은 데이터 저장
            allBills = allBills.concat(newBills);
            console.log(`페이지 ${pageIndex}: ${newBills.length}개의 새로운 의안 데이터 불러옴`);

            // 현재까지의 데이터를 JSON 파일에 저장
            try {
                await fs.writeFile(outputPath, JSON.stringify(allBills, null, 2), 'utf8');
                console.log(`현재까지의 데이터가 ${outputPath}에 저장되었습니다.`);
            } catch (error) {
                console.error('JSON 파일 저장 중 오류 발생:', error);
            }

            // 전체 페이지 수 확인
            const totalCount = response.data.response.body.totalCount;
            const totalPages = Math.ceil(totalCount / pageSize);
            const remainingPages = totalPages - pageIndex;
            console.log(`전체 의안 수: ${totalCount}, 현재까지 불러온 수: ${allBills.length}`);
            console.log(`남은 페이지 수: ${remainingPages} (전체 ${totalPages}페이지 중 ${pageIndex}페이지 완료)`);
            
            if (pageIndex * pageSize >= totalCount) {
                console.log('마지막 페이지 도달');
                break;
            }

            pageIndex++;
        }

        console.log('총 불러온 의안 수:', allBills.length);
        // 최종 저장은 이미 각 페이지마다 했으므로 여기서는 하지 않음

    } catch (error) {
        console.error('의안 상세 데이터 가져오기 실패:', error);
        if (error.response) {
            console.error('API 응답:', error.response.data);
        }
        throw error;
    }
}

async function main() {
    try {
        await fetchBillDetails();
    } catch (error) {
        console.error('스크립트 실행 중 오류 발생:', error);
        process.exit(1);
    }
}

main();
