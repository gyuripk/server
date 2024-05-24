const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); //bcrypt 추가
const jwt = require("jsonwebtoken"); //jwt 추가
require("dotenv").config(); // .env 파일에서 환경 변수를 로드
// const authorize = require("./authorize"); // 실제 authorize 미들웨어 경로로 수정

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// insomnia에서 post로 요청할때 localhost:3000/users/register로 요청

// 회원가입 API
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: true,
      message: "Request body incomplete - username and password needed",
    });
  }

  try {
    const users = await req.db
      .from("users")
      .select("username")
      .where("username", "=", username);

    if (users.length > 0) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists!" });
    }

    // user does not exist, insert new user
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    await req.db.from("users").insert({ username, hash });

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
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      error: true,
      message: "Request body incomplete - username and password needed",
    });
  }

  try {
    const users = await req.db
      .from("users")
      .select("id", "username", "hash") //"id" 추가
      .where("username", "=", username);

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
    const userId = user.id; // 추가
    console.log("User ID: ", userId);
    // const token = jwt.sign({ username, exp }, secretKey);
    // const token = jwt.sign({ username, userID: user.id, exp }, secretKey); //userID 추가
    const token = jwt.sign({ username, userId, exp }, secretKey); //userID 추가

    return res.json({ token_type: "Bearer", token, expires_in });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
