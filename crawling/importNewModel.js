const mongoose = require('mongoose');
const fs = require('fs');
const dbConnect = require('../config/dbConnect'); // DB 연결 설정 파일
const Job = require('../models/JobModel'); // Mongoose 모델

const importNewData = async () => {
    await dbConnect(); // DB 연결

    try {
        // 모든 데이터 삭제
        await Job.deleteMany({});
        console.log("모든 데이터가 삭제되었습니다.");

        // JSON 파일 읽기
        const data = fs.readFileSync('./job_data.json', 'utf8'); // JSON 파일 경로
        const jobs = JSON.parse(data); // JSON 데이터 파싱

        // 각 회사 데이터를 MongoDB에 저장
        for (const jobdata of jobs) {
            const job = new Job(jobdata);
            await job.save(); // 회사 정보 저장
        }

        console.log("새로운 회사 정보가 성공적으로 추가되었습니다.");
    } catch (error) {
        console.error("데이터 처리 중 오류 발생:", error);
    } finally {
        mongoose.connection.close(); // DB 연결 종료
    }
};

importNewData();
