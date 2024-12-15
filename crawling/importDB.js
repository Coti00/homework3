const mongoose = require('mongoose');
const fs = require('fs');
const dbConnect = require('../config/dbConnect'); // DB 연결 설정 파일
const Job = require('../models/JobModel'); // Job Mongoose 모델
const Company = require('../models/CompanyModel'); // Company Mongoose 모델

const importNewData = async () => {
    await dbConnect(); // DB 연결

    try {
        // 모든 Job 데이터 삭제
        // await Job.deleteMany({});
        // console.log("모든 Job 데이터가 삭제되었습니다.");

        // // 모든 Company 데이터 삭제
        // await Company.deleteMany({});
        // console.log("모든 Company 데이터가 삭제되었습니다.");

        // Job JSON 파일 읽기
        const jobData = fs.readFileSync('./job_data.json', 'utf8'); // Job JSON 파일 경로
        const jobs = JSON.parse(jobData); // Job JSON 데이터 파싱

        // Company JSON 파일 읽기
        const companyData = fs.readFileSync('./company_info.json', 'utf8'); // Company JSON 파일 경로
        const companies = JSON.parse(companyData); // Company JSON 데이터 파싱

        // 각 Job 데이터를 MongoDB에 저장
        for (const job of jobs) {
            const newJob = new Job(job);
            await newJob.save(); // Job 정보 저장
        }
        console.log("새로운 Job 정보가 성공적으로 추가되었습니다.");

        // 각 Company 데이터를 MongoDB에 저장
        for (const company of companies) {
            const newCompany = new Company(company);
            await newCompany.save(); // Company 정보 저장
        }
        console.log("새로운 Company 정보가 성공적으로 추가되었습니다.");
    } catch (error) {
        console.error("데이터 처리 중 오류 발생:", error);
    } finally {
        mongoose.connection.close(); // DB 연결 종료
        console.log("MongoDB 연결이 종료되었습니다.");
    }
};

importNewData();
