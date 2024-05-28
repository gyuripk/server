const express = require("express");
const router = express.Router();
const authorize = require("./authorize");

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Retrieve a list of notes
 *     description: Retrieve a list of notes for the logged-in user.
 *     tags:
 *       - Notes
 *     responses:
 *       200:
 *         description: A list of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", authorize, async (req, res) => {
  const userId = req.userId; // The user ID set by the authorize middleware from the
  console.log("userId", userId);
  try {
    const notes = await req.db("notes").where({ user_id: userId });
    res.status(200).json(notes);
    console.log(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Failed to retrieve notes" });
  }
});

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Retrieve a single note
 *     description: Retrieve a specific note by ID for the logged-in user.
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The note ID
 *     responses:
 *       200:
 *         description: A single note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Note not found
 */
router.get("/:id", authorize, async (req, res) => {
  const userId = req.userId;
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

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     description: Create a new note for the logged-in user.
 *     tags:
 *       - Notes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Title and content are required
 */
router.post("/", authorize, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId;
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

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update an existing note
 *     description: Update a specific note by ID for the logged-in user.
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Title and content are required
 *       404:
 *         description: Note not found
 */
router.put("/:id", authorize, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId;
  const noteId = req.params.id;
  console.log("노트 수정 noteId", noteId);
  if (!title || !content) {
    return res
      .status(400)
      .json({ error: true, message: "Title and content are required" });
  }

  try {
    const note = await req
      .db("notes")
      .where({ note_id: noteId, user_id: userId })
      .first();
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    await req.db("notes").where({ note_id: noteId, user_id: userId }).update({
      title,
      content,
      updated_at: new Date(),
    });

    res.status(200).json({ note_id: noteId, user_id: userId, title, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Failed to update note" });
  }
});

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Delete a specific note by ID for the logged-in user.
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 */
router.delete("/:id", authorize, async (req, res) => {
  const userId = req.userId;
  const noteId = req.params.id;

  try {
    const note = await req
      .db("notes")
      .where({ user_id: userId, note_id: noteId })
      .first();
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    await req.db("notes").where({ user_id: userId, note_id: noteId }).del();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Failed to delete note" });
  }
});

module.exports = router;
