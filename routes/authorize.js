const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  const authorization = req.headers.authorization;
  let token = null;
  console.log("Authorization: ", authorization);

  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1]; // 공백 제거 후 토큰 값만 가져옴
    console.log("Token: ", token);
  } else {
    return res.status(401).json({
      error: true,
      message: "No authorization token",
    });
  }

  try {
    const secretKey = process.env.SECRET_KEY; // 환경 변수에서 secretKey 로드
    const decoded = jwt.verify(token, secretKey);

    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      console.log("Token has expired");
      return res
        .status(401)
        .json({ error: true, message: "Token has expired" });
    }

    req.userId = decoded.userId; // 사용자 ID 설정
    next();
  } catch (e) {
    console.error("Token verification failed:", e);
    return res.status(401).json({ error: true, message: "Token is not valid" });
  }
};

module.exports = authorize;
