const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer 토큰 방식

    if (!token) {
        return res.status(401).send({ message: "인증 토큰이 필요합니다." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "유효하지 않은 토큰입니다." });
        }
        req.user = decoded; // 디코딩된 사용자 정보를 요청 객체에 추가
        next();
    });
};

module.exports = authMiddleware;
