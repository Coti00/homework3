const mongoose = require('mongoose');

const companyReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 리뷰를 작성한 사용자
        required: true,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', // 리뷰 대상 회사
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true, // 평점 (1-5)
    },
    reviewText: {
        type: String,
        required: true, // 리뷰 내용
    },
    createdAt: {
        type: Date,
        default: Date.now, // 리뷰 작성 시간
    },
});

const CompanyReview = mongoose.model('CompanyReview', companyReviewSchema);
module.exports = CompanyReview;
