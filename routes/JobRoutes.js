const express = require('express');
const router = express.Router();
const {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    searchJobs,
    getJobById,
    incrementJobViews,
    recommendRelatedJobs
} = require('../controllers/JobController');

// 채용 공고 목록 조회

/**
 * @swagger
 * /jobs:
 *  get:
 *      tags:
 *        - "Job"
 *      summary: 채용 공고 목록 조회
 *      description: 페이지네이션, 필터링, 정렬을 통해 채용 공고 목록을 조회합니다.
 *      parameters:
 *          - in: query
 *            name: page
 *            required: false
 *            schema:
 *              type: integer
 *              example: 1
 *            description: 페이지 번호 (기본값:1)
 *          - in: query
 *            name: limit
 *            required: false
 *            schema:
 *              type: integer
 *              example: 20
 *            description: 페이지당 항목 수 (기본값:20)
 *          - in: query
 *            name: filter
 *            required: false
 *            schema:
 *              type: string
 *              example: '{"location":"세종","experience":"5년","salary":0,"technology":"백엔드"}'
 *            description: 'location : 위치, experience : 경력, salary : 연봉, technology : 직업섹터'
 *      responses:
 *          200:
 *              description: 채용 공고 목록이 성공적으로 조회되었습니다.
 *          500:
 *              description: 서버 오류
 */
router.get("/", getJobs);


// 채용 공고 등록
/**
 * @swagger
 * /jobs:
 *  post:
 *      tags:
 *        - "Job"
 *      summary: 채용 공고 등록
 *      description: 새 채용 공고를 등록합니다.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          company:
 *                              type: string
 *                              example: 'test'
 *                          title:
 *                              type: string
 *                              example: '소프트웨어 개발자 모집'
 *                          link:
 *                              type: string
 *                              example: 'https://abc.com/job/software-engineer'
 *                          location:
 *                              type: string
 *                              example: '서울'
 *                          career:
 *                              type: array
 *                              items:
 *                                  type: string
 *                              example: ['경력','신입']
 *                          education:
 *                              type: string
 *                              example: '4년제'
 *                          job_sector:
 *                              type: array
 *                              items:
 *                                  type: string
 *                              example: ['프런트', '백엔드','데이터분석']
 *                          salary:
 *                              type: Nuber
 *                              example: 50000000
 *      responses:
 *          201:
 *              description: 채용 공고가 성공적으로 등록되었습니다.
 *          400:
 *              description: 요청에 잘못된 형식이 있습니다.
 */
router.post("/", createJob);


// 채용 공고 수정
/**
 * @swagger
 * /jobs/{id}:
 *  put:
 *      tags:
 *        - "Job"
 *      summary: 채용 공고 수정
 *      description: 채용 공고 정보를 수정합니다.
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: 채용 공고 ID
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                              example: '경력직 소프트웨어 개발자 모집'
 *      responses:
 *          200:
 *              description: 채용 공고가 성공적으로 수정되었습니다.
 *          404:
 *              description: 해당 채용 공고를 찾을 수 없습니다.
 */
router.put("/:id", updateJob);


// 채용 공고 삭제
/**
 * @swagger
 * /jobs/{id}:
 *  delete:
 *      tags:
 *        - "Job"
 *      summary: 채용 공고 삭제
 *      description: 채용 공고를 삭제합니다.
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: 채용 공고 ID
 *      responses:
 *          200:
 *              description: 채용 공고가 성공적으로 삭제되었습니다.
 *          404:
 *              description: 해당 채용 공고를 찾을 수 없습니다.
 */
router.delete("/:id", deleteJob);


// 채용 공고 검색
/**
 * @swagger
 * /jobs/search:
 *  get:
 *      tags:
 *        - "Job"
 *      summary: 채용 공고 검색
 *      description: 제공된 키워드, 회사명, 또는 직무 분야로 채용 공고를 검색합니다.
 *      parameters:
 *          - in: query
 *            name: company_name
 *            required: false
 *            schema:
 *              type: string
 *            description: 회사 이름으로 검색
 *      responses:
 *          200:
 *              description: 검색된 채용 공고 목록
 *          500:
 *              description: 서버 오류
 */
router.get('/search', searchJobs);


// 채용 공고 상세 조회
/**
 * @swagger
 * /jobs/{id}:
 *  get:
 *      tags:
 *        - "Job"
 *      summary: 채용 공고 상세 조회
 *      description: 지정된 ID의 채용 공고 상세 정보를 조회합니다.
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: 채용 공고 ID
 *      responses:
 *          200:
 *              description: 채용 공고의 상세 정보가 반환됩니다.
 *          404:
 *              description: 해당 채용 공고를 찾을 수 없습니다.
 */
router.get("/:id", getJobById);


// 조회수 증가
/**
 * @swagger
 * /jobs/{id}/view:
 *  patch:
 *      tags:
 *        - "Job"
 *      summary: 채용 공고 조회수 증가
 *      description: 채용 공고의 조회수를 증가시킵니다.
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *            description: 채용 공고 ID
 *      responses:
 *          204:
 *              description: 조회수가 성공적으로 증가했습니다.
 */
router.patch("/:id/view", incrementJobViews);


// 관련 공고 추천
/**
 * @swagger
 * /jobs/{id}/related:
 *  get:
 *      tags:
 *        - "Job"
 *      summary: 관련 공고 추천
 *      description: 지정된 채용 공고와 관련된 다른 공고들을 추천합니다.
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *              example: '672c8e305a4e5098b667d3dd'
 *            description: 채용 공고 ID
 *      responses:
 *          200:
 *              description: 관련 채용 공고들이 반환됩니다.
 *          404:
 *              description: 해당 채용 공고를 찾을 수 없습니다.
 */
router.get("/:id/related", recommendRelatedJobs);


module.exports = router;
