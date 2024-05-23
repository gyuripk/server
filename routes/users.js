var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt"); //bcrypt 추가
const jwt = require("jsonwebtoken"); //jwt 추가
require("dotenv").config(); // .env 파일에서 환경 변수를 로드

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// insomnia에서 post로 요청할때 localhost:3000/users/register로 요청

// 회원가입 API
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed",
    });
  }

  try {
    const users = await req.db
      .from("users")
      .select("email")
      .where("email", "=", email);

    if (users.length > 0) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists!" });
    }

    // user does not exist, insert new user
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    await req.db.from("users").insert({ email, hash });

    return res.status(201).json({ error: false, message: "User created" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//로그인 API
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed",
    });
  }

  try {
    const users = await req.db
      .from("users")
      .select("email", "hash")
      .where("email", "=", email);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ error: true, message: "User does not exist" });
    }

    const user = users[0];
    console.log("User: ", user);
    const match = await bcrypt.compare(password, user.hash);
    console.log("Match: ", match);
    if (!match) {
      return res
        .status(401)
        .json({ error: true, message: "Password does not match" });
    }

    const secretKey = process.env.SECRET_KEY; // 환경 변수에서 secretKey 로드
    const expires_in = 60 * 60 * 24; // 24시간
    const exp = Math.floor(Date.now() / 1000) + expires_in;
    const token = jwt.sign({ email, exp }, secretKey);

    return res.json({ token_type: "Bearer", token, expires_in });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// 인증 미들웨어
const authorize = (req, res, next) => {
  const authorization = req.headers.authorization;
  let token = null;
  console.log("Authorization: ", authorization);

  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1]; // 공백 제거 후 토큰 값만 가져옴
    console.log("Token: ", token);
  } else {
    // error handling
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

    // 특정한 사람만 access할 수 있게 하려면 여기서 email을 확인하면 됨
    req.email = decoded.email;
    next(); // next가 없으면 무한로딩, token이 없으면 무한로딩
  } catch (e) {
    console.error("Token verification failed:", e);
    return res.status(401).json({ error: true, message: "Token is not valid" });
  }
};

// 인증 예제 라우트
router.post("/auth", authorize, (req, res) => {
  res.json({ doSomething: true });
});

module.exports = router;
