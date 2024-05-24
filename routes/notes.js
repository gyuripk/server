const express = require("express");
const router = express.Router();
const authorize = require("./authorize"); // 실제 authorize 미들웨어 경로로 수정

// insomnia에서 post로 요청할때 localhost:3000/notes/register로 요청

// 노트 추가 라우트
router.post("/", authorize, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId; // authorize 미들웨어에서 설정한 사용자 ID
  //   const userId = 3; // 임시로 사용자 ID를 3으로 설정
  if (!title || !content) {
    return res
      .status(400)
      .json({ error: true, message: "Title and content are required" });
  }

  try {
    const [id] = await req.db("notes").insert({
      user_id: userId,
      title,
      content,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json({ id, user_id: userId, title, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Failed to add note" });
  }
});

// 로그인한 사용자의 노트 목록 라우트
router.get("/", authorize, async (req, res) => {
  const userId = req.userId; // authorize 미들웨어에서 설정한 사용자 ID
  //   const userId = 3; // 임시로 사용자 ID를 3으로 설정
  console.log("userId", userId);
  try {
    const notes = await req.db("notes").where({ user_id: userId });
    // const notes = await req.db("notes").where("user_id", "=", userId);
    res.status(200).json(notes);
    console.log(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Failed to retrieve notes" });
  }
});

//특정 노트 조회 라우트
router.get("/:id", authorize, async (req, res) => {
  const userId = req.userId; // 토큰에서 가져온 사용자 ID
  const noteId = req.params.id;
  console.log("noteId", noteId);

  try {
    const note = await req
      .db("notes")
      .where({ user_id: userId, note_id: noteId })
      .first();
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Failed to retrieve note" });
  }
});

module.exports = router;
