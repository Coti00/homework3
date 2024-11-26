const Company = require("../models/CompanyModel");

// 모든 회사 조회
const getAllCompanies = async (req, res) => {
    try {
        const { name, type,salary, page = 1, limit = 10, sort } = req.query;

        // 쿼리 생성
        const query = {};

        // company_name 검색
        if (name) {
            query.company_name = { $regex: name, $options: "i" };
        }

        // company_type 필터링
        if (type) {
            query.company_type = type;
        }

        if (salary){
            query.salary = {$gte: Number(salary)};
        }

        // 정렬 조건 설정
        let sortOrder = { }; // 기본값: 오름차순
        if (sort === 'desc') {
            sortOrder = { revenue: -1 }; // 내림차순
        } else if (sort === 'asc') {
            sortOrder = { revenue: 1 }; // 오름차순
        }

        // 회사 목록 조회
        const companies = await Company.find(query)
            .sort(sortOrder)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalCompanies = await Company.countDocuments(query);

        res.status(200).send({
            status: "success",
            data: companies,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalCompanies / limit),
                totalItems: totalCompanies,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

const createCompany = async (req, res) => {
    try {
        const newCompany = new Company(req.body);
        await newCompany.save();
        res.status(201).send({
            status: "success",
            data: newCompany,
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            status: "error",
            message: "회사 추가 중 오류 발생: " + error.message,
            code: "COMPANY_CREATION_ERROR"
        });
    }
};

// 특정 회사 조회 (ID로)
const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).send({
                status: "error",
                message: "회사를 찾을 수 없습니다.",
                code: "COMPANY_NOT_FOUND"
            });
        }
        res.status(200).send({
            status: "success",
            data: company,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 회사 정보 업데이트
const updateCompany = async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCompany) {
            return res.status(404).send({
                status: "error",
                message: "회사를 찾을 수 없습니다.",
                code: "COMPANY_NOT_FOUND"
            });
        }
        res.status(200).send({
            status: "success",
            data: updatedCompany,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 회사 삭제
const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).send({
                status: "error",
                message: "회사를 찾을 수 없습니다.",
                code: "COMPANY_NOT_FOUND"
            });
        }
        res.status(204).send(); // 삭제 성공
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 모듈 내보내기
module.exports = {
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    createCompany,
};
