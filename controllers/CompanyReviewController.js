const CompanyReview = require("../models/CompanyReviewModel");

// 리뷰 작성 (POST /reviews)
const createCompanyReview = async (req, res) => {
    const { companyId, rating, reviewText } = req.body;
    const userId = req.user.userId; // 인증된 사용자 ID

    try {
        // 중복 리뷰 확인
        const existingReview = await CompanyReview.findOne({ userId, companyId });
        if (existingReview) {
            return res.status(400).json({
                status: "error",
                message: "이미 해당 회사에 대한 리뷰를 작성하셨습니다.",
                code: "DUPLICATE_REVIEW"
            });
        }

        // 새로운 리뷰 생성
        const newReview = new CompanyReview({
            userId,
            companyId,
            rating,
            reviewText,
        });

        await newReview.save();
        res.status(201).json({
            status: "success",
            data: {
                message: "회사 리뷰가 작성되었습니다.",
                review: newReview,
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

// 특정 회사의 리뷰 조회 (GET /reviews/:companyId)
const getCompanyReviews = async (req, res) => {
    const { companyId } = req.params;

    try {
        const reviews = await CompanyReview.find({ companyId }).populate("userId", "email profile"); // 작성자 정보도 함께 조회
        if (reviews.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "해당 회사에 대한 리뷰가 없습니다.",
                code: "REVIEWS_NOT_FOUND"
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                reviews,
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

// 특정 리뷰 삭제 (DELETE /reviews/:id)
const deleteCompanyReview = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await CompanyReview.findById(id);
        if (!review) {
            return res.status(404).json({
                status: "error",
                message: "리뷰를 찾을 수 없습니다.",
                code: "REVIEW_NOT_FOUND"
            });
        }

        await CompanyReview.findByIdAndDelete(id);
        res.status(200).json({
            status: "success",
            data: {
                message: "리뷰가 삭제되었습니다."
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
    createCompanyReview,
    getCompanyReviews,
    deleteCompanyReview,
};
