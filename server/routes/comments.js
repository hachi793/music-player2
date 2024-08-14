const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

//Save new comment
router.post("/save", async (req, res) => {
  const { userId, songId, content } = req.body;

  if (!userId || !songId || !content) {
    return res.status(400).send({
      success: false,
      msg: "User, song and content are required",
    });
  }
  const newComment = new Comment({
    userId,
    songId,
    content,
  });

  try {
    const savedComment = await newComment.save();
    return res.status(200).send({ success: true, song: savedComment });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("userId")
      .populate("songId")
      .sort({ createdAt: -1 });

    if (comments.length > 0) {
      return res.status(200).send({ success: true, comments });
    } else {
      return res.status(404).send({ success: false, msg: "No comment found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);

    if (comment) {
      return res
        .status(200)
        .send({ success: true, msg: "Delete comment successfully" });
    } else {
      return res.status(404).send({ success: false, msg: "Comment not found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

router.get("/getCommentsBySongId/:songId", async (req, res) => {
  const { songId } = req.params;
  try {
    const comments = await Comment.find({ songId })
      .populate("userId")
      .populate("songId");

    if (comments) {
      return res.status(200).send({ success: true, comments });
    } else {
      return res.status(404).send({ success: false, msg: "No comment found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

router.get("/getCommentsByUserId/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const comments = await Comment.find({ userId })
      .populate("userId")
      .populate("songId");

    if (comments) {
      return res.status(200).send({ success: true, comments });
    } else {
      return res.status(404).send({ success: false, msg: "No comment found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

module.exports = router;
