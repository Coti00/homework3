const express = require("express");
const router = express.Router();
const {
    getApplicationStats,
    updateApplicationStats
} = require("../controllers/ApplicationStatsController");

/**
 * @swagger
 * /applications/application-stats/{jobId}:
 *   get:
 *     tags:
 *       - "Application Stats"
 *     summary: "채용 공고 지원 통계 조회"
 *     description: "특정 채용 공고에 대한 지원 내역 통계를 조회합니다."
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: "채용 공고의 ID"
 *         example: "672c8ea05a4e5098b667e2af"
 *     responses:
 *       200:
 *         description: "지원 통계 반환"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   $ref: '#/components/schemas/ApplicationStats'
 *       404:
 *         description: "채용 공고에 대한 지원 통계를 찾을 수 없음"
 *       500:
 *         description: "서버 오류"
 */
router.get("/application-stats/:jobId", getApplicationStats);

/**
 * @swagger
 * /applications/application-stats/{jobId}:
 *   post:
 *     tags:
 *       - "Application Stats"
 *     summary: "지원 내역 통계 업데이트"
 *     description: "특정 채용 공고에 대한 지원 내역 통계를 업데이트합니다."
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: "채용 공고의 ID"
 *         example: "672c8ea05a4e5098b667e2af"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accepted:
 *                 type: integer
 *                 description: "승인된 지원자 수"
 *                 example: 10
 *               rejected:
 *                 type: integer
 *                 description: "거부된 지원자 수"
 *                 example: 3
 *               pending:
 *                 type: integer
 *                 description: "대기 중인 지원자 수"
 *                 example: 5
 *     responses:
 *       200:
 *         description: "지원 내역 통계가 업데이트되었습니다."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApplicationStats'
 *       404:
 *         description: "채용 공고를 찾을 수 없음"
 *       500:
 *         description: "서버 오류"
 */
router.post("/application-stats/:jobId", updateApplicationStats);


module.exports = router;
