const Application = require("../models/ApplicationModel");
const Job = require("../models/JobModel");  // 채용 공고 모델
const User = require("../models/UserModel"); // 사용자 모델
const JobApplicationStats = require("../models/ApplicationStatsModel"); // JobApplicationStats 모델

// 지원하기 (POST /applications)
const applyJob = async (req, res) => {
    const { jobId, resume } = req.body;
    const userId = req.user.userId; // 인증된 사용자 ID

    // jobId가 제공되지 않은 경우 오류 처리
    if (!jobId) {
        return res.status(400).json({
            status: "error",
            message: "jobId가 필요합니다.",
            code: "JOB_ID_REQUIRED"
        });
    }

    try {
        // 이미 지원한 이력이 있는지 확인
        const existingApplication = await Application.findOne({ userId, jobId });
        if (existingApplication) {
            return res.status(400).json({
                status: "error",
                message: "이미 지원한 공고입니다.",
                code: "ALREADY_APPLIED"
            });
        }

        // 지원 정보 저장
        const newApplication = new Application({
            userId,
            jobId,
            resume: resume || null, // 이력서 첨부 (선택)
            status: "pending", // 기본 상태는 '대기'
        });

        await newApplication.save();

        // 지원 내역 통계 업데이트
        await updateApplicationStats(jobId, "pending"); // 새로운 지원 추가시 pending 상태로 업데이트

        res.status(201).json({
            status: "success",
            data: {
                message: "지원이 완료되었습니다.",
                application: newApplication
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

// 지원 내역 통계 업데이트 (응용)
const updateApplicationStats = async (jobId, status) => {
    try {
        // 채용 공고에 대한 기존 통계 찾기
        let stats = await JobApplicationStats.findOne({ jobId });

        // 통계가 없다면 새로 생성
        if (!stats) {
            stats = new JobApplicationStats({ jobId, totalApplications: 1, pending: status === "pending" ? 1 : 0, accepted: 0, rejected: 0 });
        } else {
            // 기존 통계 업데이트
            stats.totalApplications += 1;
            if (status === "pending") {
                stats.pending += 1;
            } else if (status === "accepted") {
                stats.accepted += 1;
            } else if (status === "rejected") {
                stats.rejected += 1;
            }
        }

        await stats.save();
    } catch (error) {
        console.error("Error updating application stats:", error);
    }
};

// 지원 내역 조회 (GET /applications)
const getApplications = async (req, res) => {
    const userId = req.user.userId; // 인증된 사용자 ID
    const { status, sortByDate = "desc", page = 1, limit = 20 } = req.query;

    try {
        let query = { userId };

        // 상태별 필터링
        if (status) {
            query.status = status;
        }

        const applications = await Application.find(query)
            .populate("jobId") // 채용 공고 정보 추가
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: sortByDate === "asc" ? 1 : -1 }); // 날짜별 정렬

        const totalApplications = await Application.countDocuments(query);
        res.status(200).json({
            status: "success",
            data: {
                totalApplications,
                totalPages: Math.ceil(totalApplications / limit),
                currentPage: Number(page),
                applications,
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

// 지원 취소 (DELETE /applications/:id)
// 지원 취소 (DELETE /applications/:id)
const cancelApplication = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId; // 인증된 사용자 ID

    try {
        // 지원 내역 확인
        const application = await Application.findOne({ _id: id, userId });
        if (!application) {
            return res.status(404).json({
                status: "error",
                message: "지원 내역을 찾을 수 없습니다.",
                code: "APPLICATION_NOT_FOUND"
            });
        }

        // 지원 내역을 DB에서 삭제
        await Application.findByIdAndDelete(id);

        // 지원 내역 통계 업데이트 (삭제된 지원 내역을 제외하고 통계 갱신)
        await updateApplicationStats(application.jobId, "cancelled");

        res.status(200).json({
            status: "success",
            message: "지원이 취소되었습니다."
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


// 지원 상태 업데이트 (PATCH /applications/:id/status)
const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 업데이트할 상태 (accepted, rejected, cancelled)

    // 허용된 상태값만 업데이트하도록 제한
    const validStatuses = ["pending", "accepted", "rejected", "cancelled"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            status: "error",
            message: "잘못된 상태값입니다.",
            code: "INVALID_STATUS"
        });
    }

    try {
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({
                status: "error",
                message: "지원 내역을 찾을 수 없습니다.",
                code: "APPLICATION_NOT_FOUND"
            });
        }

        // 상태 업데이트
        application.status = status;
        await application.save();

        // 상태별 통계 업데이트
        await updateApplicationStats(application.jobId, status);

        res.status(200).json({
            status: "success",
            data: {
                message: "지원 상태가 업데이트되었습니다.",
                application
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

module.exports = {
    applyJob,
    getApplications,
    cancelApplication,
    updateApplicationStatus
};
