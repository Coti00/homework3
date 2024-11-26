const JobApplicationStats = require("../models/ApplicationStatsModel");

// 지원 내역 통계 조회 (GET /application-stats/:jobId)
const getApplicationStats = async (req, res) => {
    const { jobId } = req.params;

    try {
        const stats = await JobApplicationStats.findOne({ jobId });
        if (!stats) {
            return res.status(404).json({
                status: "error",
                message: "채용 공고에 대한 지원 통계를 찾을 수 없습니다.",
                code: "STATS_NOT_FOUND"
            });
        }

        res.status(200).json({
            status: "success",
            data: { stats }
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

// 지원 내역 통계 업데이트 (POST /application-stats/:jobId)
const updateApplicationStats = async (req, res) => {
    const { jobId } = req.params;
    const { accepted, rejected, pending } = req.body;

    try {
        // 채용 공고에 대한 기존 통계 찾기
        let stats = await JobApplicationStats.findOne({ jobId });

        // 통계가 없다면 새로 생성
        if (!stats) {
            stats = new JobApplicationStats({ jobId, accepted, rejected, pending });
        } else {
            // 기존 통계 업데이트
            stats.accepted = accepted !== undefined ? accepted : stats.accepted;
            stats.rejected = rejected !== undefined ? rejected : stats.rejected;
            stats.pending = pending !== undefined ? pending : stats.pending;
        }

        await stats.save();
        res.status(200).json({
            status: "success",
            data: {
                message: "지원 내역 통계가 업데이트되었습니다.",
                stats
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
    getApplicationStats,
    updateApplicationStats,
};
