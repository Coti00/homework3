const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // 사용자 모델 참조
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Job' // 채용 공고 모델 참조
    },
    resume: {
        type: String, // 이력서 URL
        required: false
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "cancelled"], // 지원 상태
        default: "pending" // 기본 상태는 '대기'
    },
    createdAt: {
        type: Date,
        default: Date.now // 지원 날짜
    }
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
