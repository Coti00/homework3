const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Bookmark = require('../models/BookmarkModel');
const UserLog = require("../models/Userlog");


const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // 이메일 형식 검증
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).send({
                status: "error",
                message: "유효하지 않은 이메일 형식입니다.",
                code: "INVALID_EMAIL_FORMAT"
            });
        }

        // 비밀번호가 빈 문자열인지 확인
        if (!password || password.trim() === "") {
            return res.status(400).send({
                status: "error",
                message: "비밀번호는 필수 항목입니다.",
                code: "PASSWORD_REQUIRED"
            });
        }

        // 중복 회원 검사
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                status: "error",
                message: "이미 존재하는 이메일입니다.",
                code: "EMAIL_ALREADY_EXISTS"
            });
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 정보 저장
        const newUser = new User({
            email,
            password: hashedPassword,
            profile: { name },
        });
        await newUser.save();

        res.status(201).send({
            status: "success",
            data: {
                message: "회원 가입 성공!",
            }
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 로그인
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 사용자 인증
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({
                status: "error",
                message: "사용자를 찾을 수 없습니다.",
                code: "USER_NOT_FOUND"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                status: "error",
                message: "비밀번호가 일치하지 않습니다.",
                code: "INVALID_PASSWORD"
            });
        }

        // JWT 토큰 발급
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const loginLog = new UserLog({
            userId: user._id,
            activityType: 'login',
            description: '사용자가 로그인했습니다.',
        });
        await loginLog.save();

        res.status(200).send({
            status: "success",
            data: {
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 로그아웃
const logoutUser = async (req, res) => {
    try {
        const userId = req.user.userId; // 인증된 사용자 ID

        // 로그아웃 활동 기록
        const logoutLog = new UserLog({
            userId: userId,
            activityType: 'logout',
            description: '사용자가 로그아웃했습니다.',
        });
        await logoutLog.save();

        // 로그아웃 처리 (세션/토큰 제거 등)
        // 예: JWT를 블랙리스트에 추가하거나 세션을 종료하는 작업을 추가할 수 있습니다.
        
        res.status(200).json({ 
            status: "success",
            message: "로그아웃 성공!"
         });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};


// 회원 정보 수정
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // 인증된 사용자 ID
        const updates = req.body;

        // 비밀번호 변경 시 해싱
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        // profile 업데이트가 포함된 경우
        if (updates.name) {
            updates.profile = { name: updates.name };
            delete updates.name;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).send({
                status: "error",
                message: "회사를 찾을 수 없습니다.",
                code: "USER_NOT_FOUND"
            });
        }

        res.status(200).send({
            status: "success",
            data: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 회원 정보 조회
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // 인증된 사용자 ID
        const user = await User.findById(userId).select("-password");
        res.status(200).send({
            status: "success",
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 회원 탈퇴
const deleteUser = async (req, res) => {
    try {
        const userId = req.user.userId; // 인증된 사용자 ID
        await User.findByIdAndDelete(userId);
        res.status(200).send({
            status: "success",
            message:"회원탈퇴가 성공적으로 이루어졌습니다."
        }); // 삭제 성공
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

// 토큰 갱신
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body; // 요청 본문에서 Refresh 토큰 가져오기

        // Refresh 토큰 검증
        if (!refreshToken) {
            return res.status(403).send({
                status: "error",
                message: "Refresh token이 필요합니다.",
                code: "REFRESH_TOKEN_REQUIRED"
            });
        }

        // Refresh 토큰을 검증
        jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).send({
                    status: "error",
                    message: "유효하지 않은 Refresh token입니다.",
                    code: "INVALID_REFRESH_TOKEN"
                });
            }

            // 유효한 경우 새 Access 토큰 발급
            const userId = decoded.userId;
            const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).send({
                status: "success",
                data: {
                    accessToken: newAccessToken
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            message: "서버 오류가 발생했습니다.",
            code: "SERVER_ERROR"
        });
    }
};

const toggleBookmark = async (req, res) => {
    const { jobId } = req.body;
    const userId = req.user.userId;

    if (!jobId) {
        return res.status(400).json({ status: "error", message: "jobId가 필요합니다." });
    }

    try {
        // jobId가 null인 레코드 삭제
        await Bookmark.deleteMany({ userId, jobId: null });
        const deleteResult = await Bookmark.deleteMany({ userId, jobId: null });
        const existingBookmark = await Bookmark.findOne({ userId, jobId });
        if (existingBookmark) {
            // 북마크가 이미 존재하는 경우 삭제
            await Bookmark.findOneAndDelete({ userId, jobId });
            return res.status(200).json({ status: "success", message: "북마크가 제거되었습니다." });
        } else {
            // 북마크가 존재하지 않는 경우 추가
            const newBookmark = new Bookmark({ userId, jobId });
            await newBookmark.save();
            return res.status(201).json({
                status: "success",
                message: "북마크가 추가되었습니다.",
                data: newBookmark,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "서버 오류가 발생했습니다." });
    }
};



// 북마크 목록 조회
const getBookmarks = async (req, res) => {
    const userId = req.user.userId; // 인증된 사용자 ID 가져오기
    const { page = 1, limit = 5 } = req.query;

    try {
        const bookmarks = await Bookmark.find({ userId })
            .populate('jobId') // 채용 공고 정보 추가
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 }); // 최신순 정렬
        const totalBookmarks = await Bookmark.countDocuments({ userId });
        res.status(200).json({
            status: "success",
            data: bookmarks,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalBookmarks / limit),
                totalItems: totalBookmarks
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "서버 오류가 발생했습니다." });
    }
};

// 사용자 활동 기록 조회
// 사용자 활동 기록 조회
const getUserLogs = async (req, res) => {
    const userId = req.user.userId; // 인증된 사용자 ID
    const { page = 1, limit = 5 } = req.query; // 페이지네이션: 기본 페이지 1, 페이지당 항목 5개

    try {
        const logs = await UserLog.find({ userId })
            .sort({ timestamp: -1 }) // 최신 로그부터 정렬
            .skip((page - 1) * limit)
            .limit(Number(limit)); // 페이지당 항목 제한

        const totalLogs = await UserLog.countDocuments({ userId });
        res.status(200).json({
            status: "success",
            data: logs,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalLogs / limit),
                totalItems: totalLogs
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "서버 오류가 발생했습니다." });
    }
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    refreshToken,
    getUserLogs,
    toggleBookmark,
    getBookmarks
};
