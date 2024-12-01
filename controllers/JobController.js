const Job = require('../models/JobModel');

// 채용 공고 목록 조회
const getJobs = async (req, res) => {
    try {
        const { page = 1, limit = 20, sort = 'date', filter } = req.query;
        const query = {};

        // 필터링 로직 구현
        if (filter) {
            const filters = JSON.parse(filter); // filter를 JSON 형식으로 파싱

            if (filters.location) {
                query.location = { $regex: filters.location, $options: 'i' }; // 대소문자 구분 없이 검색
            }

            if (filters.experience) {
                query.career = { $regex: filters.experience, $options: 'i' };
            }

            if (filters.salary) {
                query.salary = { $gte: filters.salary }; // salary 필터링 예시 (예: 최소 급여)
            }

            if (filters.technology) {
                query.job_sector = { $regex: filters.technology, $options: 'i' };
            }
        }

        const jobs = await Job.find(query)
            .sort(sort === 'salary' ? { salary: -1 } : { createdAt: -1 }) // 정렬 기준
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalJobs = await Job.countDocuments(query);
        res.status(200).json({
            status: "success",
            data: jobs,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalJobs / limit),
                totalItems: totalJobs
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 채용 공고 등록
const createJob = async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json({
            status: "success",
            data: newJob
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            status: "error",
            message: "채용 공고 등록에 실패했습니다.",
            code: "JOB_CREATION_FAILED"
        });
    }
};

// 채용 공고 수정
const updateJob = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedJob) {
            return res.status(404).json({
                status: "error",
                message: "채용 공고를 찾을 수 없습니다.",
                code: "JOB_NOT_FOUND"
            });
        }
        res.status(200).json({
            status: "success",
            data: updatedJob
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 채용 공고 삭제
const deleteJob = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedJob = await Job.findByIdAndDelete(id);
        if (!deletedJob) {
            return res.status(404).json({
                status: "error",
                message: "채용 공고를 찾을 수 없습니다.",
                code: "JOB_NOT_FOUND"
            });
        }
        res.status(204).send({
            status: "success",
            message: "채용 공고가 삭제되었습니다."
        }); // 삭제 성공
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 채용 공고 검색
const searchJobs = async (req, res) => {
    const { keyword, company_name, position } = req.query;
    try {
        const query = {};
        if (keyword) {
            query.title = { $regex: keyword, $options: 'i' }; // 대소문자 구분하지 않음
        }
        if (company_name) {
            query.company = { $regex: company_name, $options: 'i' };
        }
        if (position) {
            query.job_sector = { $regex: position, $options: 'i' };
        }

        const jobs = await Job.find(query);
        res.status(200).json({
            status: "success",
            data: jobs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 채용 공고 상세 조회
const getJobById = async (req, res) => {
    const { id } = req.params;
    try {
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({
                status: "error",
                message: "채용 공고를 찾을 수 없습니다.",
                code: "JOB_NOT_FOUND"
            });
        }
        res.status(200).json({
            status: "success",
            data: job
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 조회수 증가
const incrementJobViews = async (req, res) => {
    const { id } = req.params;
    try {
        await Job.findByIdAndUpdate(id, { $inc: { views: 1 } });
        res.status(204).send({
            status:"success",
            message:"조회수가 증가하였습니다."
        }); // 조회수 증가 성공
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 관련 공고 추천
const recommendRelatedJobs = async (req, res) => {
    const { id } = req.params;
    try {
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({
                status: "error",
                message: "채용 공고를 찾을 수 없습니다.",
                code: "JOB_NOT_FOUND"
            });
        }

        const relatedJobs = await Job.find({
            job_sector: { $in: job.job_sector },
            _id: { $ne: id }  // 현재 공고는 제외
        }).limit(5); // 관련 공고 5개 추천

        if (relatedJobs.length === 0) {
            return res.status(200).json({
                status: "success",
                message: "관련 공고가 없습니다.",
                data: []
            });
        }

        res.status(200).json({
            status: "success",
            data: relatedJobs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 모듈 내보내기
module.exports = {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    searchJobs,
    getJobById,
    incrementJobViews,
    recommendRelatedJobs
};
