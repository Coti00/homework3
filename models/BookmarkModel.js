const mongoose = require("mongoose");
const Job = require('./JobModel'); // JobModel 경로를 올바르게 지정하세요.
const User = require('./UserModel'); 

// Bookmark 스키마 정의
const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // 사용자 모델 참조
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Job" // 채용 공고 모델 참조
    },
    createdAt: {
        type: Date,
        default: Date.now // 북마크 생성 날짜 기본값
    }
});

// Bookmark 모델 생성
const Bookmark = mongoose.model("bookmark", bookmarkSchema);
module.exports = Bookmark;
