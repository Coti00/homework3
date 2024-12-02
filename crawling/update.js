const mongoose = require('mongoose');
const fs = require('fs');
const dbConnect = require('../config/dbConnect'); // DB 연결 설정 파일
const Company = require('../models/CompanyModel'); // Mongoose 모델

const importAndUpdateData = async () => {
    await dbConnect(); // DB 연결

    try {
        // 모든 데이터 삭제
        await Company.deleteMany({});
        console.log("모든 데이터가 삭제되었습니다.");

        // JSON 파일 읽기
        const data = fs.readFileSync('./crawling/company_info.json', 'utf8'); // JSON 파일 경로
        const companys = JSON.parse(data); // JSON 데이터 파싱

        // 데이터 저장
        for (const companydata of companys) {
            const company = new Company(companydata);
            await company.save(); // 회사 정보 저장
        }
        console.log("새로운 회사 정보가 성공적으로 추가되었습니다.");

        // bulkUpdateSalaries: salary 필드를 숫자로 변환
        const companies = await Company.find();
        const updates = companies.map(company => ({
            updateOne: {
                filter: { _id: company._id },
                update: {
                    $set: {
                        salary: parseFloat(company.salary.replace(/,/g, "")) // 쉼표 제거 후 숫자로 변환
                    }
                }
            }
        }));

        if (updates.length > 0) {
            await Company.bulkWrite(updates);
            console.log("모든 salary 필드가 숫자로 변환되었습니다.");
        } else {
            console.log("변환할 데이터가 없습니다.");
        }

    } catch (error) {
        console.error("데이터 처리 중 오류 발생:", error);
    } finally {
        mongoose.connection.close(); // DB 연결 종료
    }
};

importAndUpdateData();
