const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    updateUserProfile,
    getUserProfile,
    deleteUser,
    refreshToken,
    toggleBookmark, // 북마크 제거 함수
    getBookmarks, // 북마크 목록 조회 함수
    logoutUser,
    getUserLogs
} = require("../controllers/UserController");
const {
    applyJob,
    getApplications,
    cancelApplication,
    updateApplicationStatus
} = require("../controllers/ApplicationController");

const authMiddleware = require("../middleware/authMiddleware"); // 인증 미들웨어

// 회원 가입
/**
 * @swagger
 * /auth/register:
 *  post:
 *      tags:
 *        - "User"
 *      summary: 회원 가입
 *      description: 이메일과 비밀번호로 회원 가입
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: user@example.com
 *                          password:
 *                              type: string
 *                              example: password123
 *                          name:
 *                              type: string
 *                              example: John Doe
 *      responses:
 *          201:
 *              description: 회원 가입 성공
 *          400:
 *              description: 유효하지 않은 이메일 형식이나 비밀번호 미제공 등의 오류
 *          500:
 *              description: 서버 오류
 */
router.post("/register", registerUser);

// 로그인
/**
 * @swagger
 * /auth/login:
 *  post:
 *      tags:
 *        - "User"
 *      summary: 로그인
 *      description: 이메일과 비밀번호로 로그인하여 JWT 토큰을 반환
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: user@example.com
 *                          password:
 *                              type: string
 *                              example: password123
 *      responses:
 *          200:
 *              description: 로그인 성공
 *          401:
 *              description: 로그인 실패 (비밀번호 오류 또는 이메일 미존재)
 *          500:
 *              description: 서버 오류
 */
router.post("/login", loginUser);

// 로그아웃
/**
 * @swagger
 * /auth/logout:
 *  post:
 *      tags:
 *        - "User"
 *      summary: 로그아웃
 *      description: 사용자가 로그아웃하여 로그아웃 활동 기록을 남깁니다.
 *      security:
 *        - BearerAuth: []
 *      responses:
 *          200:
 *              description: 로그아웃 성공
 *          500:
 *              description: 서버 오류
 */
router.post("/logout",authMiddleware, logoutUser);

// 토큰 갱신
/**
 * @swagger
 * /auth/refresh:
 *  post:
 *      tags:
 *        - "User"
 *      summary: 토큰 갱신
 *      description: 만료된 토큰을 갱신하여 새로운 accessToken을 반환
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          refreshToken:
 *                              type: string
 *                              example: refresh-token-string
 *      responses:
 *          200:
 *              description: 새로운 accessToken 반환
 *          403:
 *              description: 유효하지 않은 refreshToken
 *          500:
 *              description: 서버 오류
 */
router.post("/refresh", refreshToken);

/**
 * @swagger
 * /auth/logs:
 *  get:
 *      tags:
 *        - "User"
 *      summary: 사용자 활동 기록 조회
 *      description: 로그인 및 로그아웃 활동을 포함한 사용자의 활동 기록을 조회합니다.
 *      security:
 *        - BearerAuth: []
 *      responses:
 *          200:
 *              description: 활동 기록 목록 반환
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              logs:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          userId:
 *                                              type: string
 *                                              example: 60c72b2f9b1d8b3e4f6e63e5
 *                                          activityType:
 *                                              type: string
 *                                              enum: [login, logout]
 *                                              example: login
 *                                          description:
 *                                              type: string
 *                                              example: '사용자가 로그인했습니다.'
 *                                          timestamp:
 *                                              type: string
 *                                              format: date-time
 *                                              example: '2024-05-01T12:00:00Z'
 *          404:
 *              description: 활동 기록이 없습니다.
 *          500:
 *              description: 서버 오류
 */
router.get("/logs", authMiddleware, getUserLogs);

// 회원 정보 수정
/**
 * @swagger
 * /auth/profile:
 *  put:
 *      tags:
 *        - "User"
 *      summary: 회원 정보 수정
 *      description: 사용자의 이름 또는 비밀번호를 수정
 *      security:
 *        - BearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Hong
 *      responses:
 *          200:
 *              description: 사용자 프로필 수정 성공
 *          500:
 *              description: 서버 오류
 */
router.put("/profile", authMiddleware, updateUserProfile);

// 회원 정보 조회
/**
 * @swagger
 * /auth/profile:
 *  get:
 *      tags:
 *        - "User"
 *      summary: 회원 정보 조회
 *      description: 로그인한 사용자의 정보를 조회
 *      security:
 *        - BearerAuth: []  
 *      responses:
 *          200:
 *              description: 사용자 프로필 정보 반환
 *          500:
 *              description: 서버 오류
 */
router.get("/profile", authMiddleware, getUserProfile);

// 회원 탈퇴
/**
 * @swagger
 * /auth/profile:
 *  delete:
 *      tags:
 *        - "User"
 *      summary: 회원 탈퇴
 *      description: 사용자가 자신의 계정을 삭제합니다.
 *      security:
 *        - BearerAuth: [] 
 *      responses:
 *          204:
 *              description: 사용자 계정 삭제 성공
 *          500:
 *              description: 서버 오류
 */
router.delete("/profile", authMiddleware, deleteUser);


// 북마크 추가/삭제
/**
 * @swagger
 * /auth/bookmarks:
 *  post:
 *      tags:
 *        - "Bookmark"
 *      summary: 북마크 추가/삭제
 *      description: 특정 채용 공고를 북마크하거나 북마크를 제거합니다.
 *      security:
 *        - BearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          jobId:
 *                              type: string
 *                              example: 672c8ea05a4e5098b667e2af
 *      responses:
 *          200:
 *              description: 북마크가 추가되거나 제거되었습니다.
 *          400:
 *              description: jobId가 제공되지 않은 경우
 *          500:
 *              description: 서버 오류
 */
router.post("/bookmarks", authMiddleware, toggleBookmark); // POST /auth/bookmarks

// 북마크 목록 조회
/**
 * @swagger
 * /auth/bookmarks:
 *  get:
 *      tags:
 *        - "Bookmark"
 *      summary: 북마크 목록 조회
 *      description: 사용자가 북마크한 채용 공고 목록을 조회
 *      security:
 *        - BearerAuth: []
 *      responses:
 *          200:
 *              description: 북마크 목록 반환
 *          500:
 *              description: 서버 오류
 */
router.get("/bookmarks", authMiddleware, getBookmarks); // GET /auth/bookmarks

// 지원하기
/**
 * @swagger
 * /auth/applications:
 *  post:
 *      tags:
 *        - "Application"
 *      summary: 채용 공고에 지원
 *      description: 사용자가 채용 공고에 지원합니다.
 *      security:
 *        - BearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          jobId:
 *                              type: string
 *                              example: 672c8ea05a4e5098b667e2af
 *                          resume:
 *                              type: string
 *                              example: http://example.com/resume.pdf
 *      responses:
 *          201:
 *              description: 지원이 완료되었습니다.
 *          400:
 *              description: jobId가 제공되지 않은 경우
 *          500:
 *              description: 서버 오류
 */
router.post("/applications",authMiddleware,applyJob);

// 지원 내역 조회
/**
 * @swagger
 * /auth/applications:
 *  get:
 *      tags:
 *        - "Application"
 *      summary: 지원 내역 조회
 *      description: 사용자가 지원한 채용 공고의 내역을 조회합니다.
 *      security:
 *        - BearerAuth: []
 *      responses:
 *          200:
 *              description: 지원 내역 반환
 *          500:
 *              description: 서버 오류
 */
router.get("/applications",authMiddleware, getApplications);

// 지원 취소
/**
 * @swagger
 * /auth/applications/{id}:
 *  delete:
 *      tags:
 *        - "Application"
 *      summary: 지원 취소
 *      description: 사용자가 지원한 채용 공고에 대한 지원을 취소합니다.
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: 지원 내역의 ID
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: 지원 취소 완료
 *          404:
 *              description: 지원 내역을 찾을 수 없는 경우
 *          500:
 *              description: 서버 오류
 */
router.delete("/applications/:id", authMiddleware, cancelApplication);

// 지원 상태 업데이트
/**
 * @swagger
 * /auth/applications/{id}/status:
 *  patch:
 *      tags:
 *        - "Application"
 *      summary: 지원 상태 업데이트
 *      description: 사용자가 지원한 채용 공고의 상태를 업데이트합니다.
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: 지원 내역의 ID
 *            schema:
 *              type: string
 *          - in: body
 *            name: status
 *            description: 업데이트할 상태 (accepted, rejected, cancelled)
 *            required: true
 *            schema:
 *              type: string
 *              enum: [accepted, rejected, cancelled]
 *              example: accepted
 *      responses:
 *          200:
 *              description: 지원 상태가 업데이트되었습니다.
 *          400:
 *              description: 잘못된 상태값이 제공된 경우
 *          500:
 *              description: 서버 오류
 */
router.patch("/applications/:id/status", authMiddleware, updateApplicationStatus);

module.exports = router;
