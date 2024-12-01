const express = require("express");
const router = express.Router();
const {
    createCompanyReview,
    getCompanyReviews,
    deleteCompanyReview,
} = require("../controllers/CompanyReviewController");

const authMiddleware = require("../middleware/authMiddleware"); // 인증 미들웨어

/**
 * @swagger
 * /review:
 *   post:
 *     tags:
 *       - "Company Review"
 *     summary: "회사 리뷰 작성"
 *     description: "회사의 리뷰를 작성합니다. 사용자 인증이 필요합니다."
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: "리뷰를 작성할 회사의 ID"
 *                 example: "672c801100efb1288b6d65d5"
 *               rating:
 *                 type: integer
 *                 description: "회사의 평점 (1-5)"
 *                 example: 4
 *               reviewText:
 *                 type: string
 *                 description: "리뷰 내용"
 *                 example: "Great place to work!"
 *     responses:
 *       201:
 *         description: "회사 리뷰가 작성되었습니다."
 *       500:
 *         description: "서버 오류"
 */
router.post("/", authMiddleware, createCompanyReview);

/**
 * @swagger
 * /review/{companyId}:
 *   get:
 *     tags:
 *       - "Company Review"
 *     summary: "특정 회사의 리뷰 조회"
 *     description: "회사의 ID를 통해 해당 회사에 대한 모든 리뷰를 조회합니다."
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: "리뷰를 조회할 회사의 ID"
 *         example: "회사 ID"
 *     responses:
 *       200:
 *         description: "리뷰 목록 반환"
 *       404:
 *         description: "해당 회사에 대한 리뷰가 없습니다."
 *       500:
 *         description: "서버 오류"
 */
router.get("/:companyId", getCompanyReviews);

/**
 * @swagger
 * /review/{id}:
 *   delete:
 *     tags:
 *       - "Company Review"
 *     summary: "특정 리뷰 삭제"
 *     description: "리뷰 ID를 통해 특정 리뷰를 삭제합니다. 사용자 인증이 필요합니다."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "삭제할 리뷰의 ID"
 *     responses:
 *       200:
 *         description: "리뷰 삭제 성공"
 *       404:
 *         description: "리뷰를 찾을 수 없습니다."
 *       500:
 *         description: "서버 오류"
 */
router.delete("/:id", authMiddleware, deleteCompanyReview);

module.exports = router;
