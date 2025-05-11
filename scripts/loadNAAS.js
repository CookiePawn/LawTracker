const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const BASE_URL = 'https://open.assembly.go.kr/portal/openapi';
const API_KEY = process.env.LAW_API_KEY;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

async function fetchAllAssemblyMembers() {
    try {
        const outputPath = path.join(__dirname, '..', 'src', 'constants', 'assemblyMembers.json');
        
        // 기존 JSON 파일 읽기
        let existingMembers = [];
        try {
            const existingData = await fs.readFile(outputPath, 'utf8');
            existingMembers = JSON.parse(existingData);
            console.log('기존 JSON 파일의 국회의원 수:', existingMembers.length);
        } catch (error) {
            console.log('기존 JSON 파일이 없거나 읽을 수 없습니다. 새로 생성합니다.');
        }

        let allMembers = [];
        let pageIndex = 1;
        const pageSize = 100; // 한 번에 가져올 데이터 수

        while (true) {
            console.log(`Fetching page ${pageIndex}...`);
            const response = await api.get('/ALLNAMEMBER', {
                params: {
                    Key: API_KEY,
                    Type: 'json',
                    pIndex: pageIndex,
                    pSize: pageSize
                },
            });

            if (!response.data || !response.data.ALLNAMEMBER || !response.data.ALLNAMEMBER[1] || !response.data.ALLNAMEMBER[1].row) {
                console.log('No more data available');
                break;
            }

            const members = response.data.ALLNAMEMBER[1].row;
            if (members.length === 0) {
                console.log('Empty page received');
                break;
            }

            allMembers = allMembers.concat(members);
            console.log(`Retrieved ${members.length} members from page ${pageIndex}`);

            if (members.length < pageSize) {
                console.log('Last page reached');
                break;
            }

            pageIndex++;
        }

        console.log('총 가져온 국회의원 수:', allMembers.length);

        // JSON 파일로 저장
        await fs.writeFile(outputPath, JSON.stringify(allMembers, null, 2), 'utf8');
        console.log(`국회의원 데이터가 ${outputPath}에 저장되었습니다.`);

    } catch (error) {
        console.error('국회의원 데이터 가져오기 실패:', error);
        if (error.response) {
            console.error('API 응답:', error.response.data);
        }
        throw error;
    }
}

async function main() {
    try {
        await fetchAllAssemblyMembers();
    } catch (error) {
        console.error('스크립트 실행 중 오류 발생:', error);
        process.exit(1);
    }
}

main();
