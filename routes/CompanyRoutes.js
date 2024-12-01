const express = require("express");
const router = express.Router();
const {
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    createCompany,
} = require("../controllers/CompanyController");

/**
 * @swagger
 * /company:
 *   get:
 *     tags:
 *       - "Company"
 *     summary: "모든 회사 조회"
 *     description: "모든 회사 리스트를 조회하고 필터링할 수 있습니다."
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: "회사 이름으로 필터링"
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: "회사 유형으로 필터링"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "페이지 번호"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "한 페이지에 보여줄 항목 수"
 *     responses:
 *       200:
 *         description: "회사 목록 반환"
 *       500:
 *         description: "서버 오류"
 */
router.route("/").get(getAllCompanies); // 회사 리스트 조회 및 필터링

/**
 * @swagger
 * /company:
 *   post:
 *     tags:
 *       - "Company"
 *     summary: "회사 정보 추가"
 *     description: "새로운 회사 정보를 등록합니다."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: "회사 추가 성공"
 *       400:
 *         description: "잘못된 요청"
 */
router.route("/").post(createCompany); // 회사 정보 추가

/**
 * @swagger
 * /company/{id}:
 *   get:
 *     tags:
 *       - "Company"
 *     summary: "특정 회사 조회"
 *     description: "회사 ID로 특정 회사의 정보를 조회합니다."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "회사 ID"
 *     responses:
 *       200:
 *         description: "회사 정보 반환"
 *       404:
 *         description: "회사 찾을 수 없음"
 *       500:
 *         description: "서버 오류"
 */
router.route("/:id").get(getCompanyById); // 특정 회사 조회

/**
 * @swagger
 * /company/{id}:
 *   put:
 *     tags:
 *       - "Company"
 *     summary: "회사 정보 업데이트"
 *     description: "회사 ID로 특정 회사의 정보를 업데이트합니다."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "회사 ID"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: "회사 정보 업데이트 성공"
 *       404:
 *         description: "회사 찾을 수 없음"
 *       500:
 *         description: "서버 오류"
 */
router.route("/:id").put(updateCompany); // 회사 정보 업데이트

/**
 * @swagger
 * /company/{id}:
 *   delete:
 *     tags:
 *       - "Company"
 *     summary: "회사 삭제"
 *     description: "회사 ID로 특정 회사를 삭제합니다."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "회사 ID"
 *     responses:
 *       204:
 *         description: "회사 삭제 성공"
 *       404:
 *         description: "회사 찾을 수 없음"
 *       500:
 *         description: "서버 오류"
 */
router.route("/:id").delete(deleteCompany); // 회사 삭제

module.exports = router;
