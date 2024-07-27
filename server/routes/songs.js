const express = require("express");
const router = express.Router();
const Song = require("../models/Song");

// Save a new song
router.post("/save", async (req, res) => {
  const { name, imageURL, audioURL, artistId, albumId, language, category } =
    req.body;

  if (!name || !imageURL || !audioURL || !artistId || !language || !category) {
    return res.status(400).send({
      success: false,
      msg: "Name, imageURL, audiURL, artistId, language, and category are required!",
    });
  }

  const newSong = new Song({
    name,
    imageURL,
    audioURL,
    artistId,
    albumId,
    language,
    category,
  });

  try {
    const savedSong = await newSong.save();
    return res.status(200).send({ success: true, song: savedSong });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Get a song by ID
router.get("/getSong/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const song = await Song.findById(id)
      .populate("artistId")
      .populate("albumId");

    if (song) {
      return res.status(200).send({ success: true, song });
    } else {
      return res.status(404).send({ success: false, msg: "Song not found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Get all songs
router.get("/getAll", async (req, res) => {
  try {
    const songs = await Song.find()
      .populate("artistId")
      .populate("albumId")
      .sort({ createdAt: -1 });

    if (songs.length > 0) {
      return res.status(200).send({ success: true, songs });
    } else {
      return res.status(404).send({ success: false, msg: "No songs found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Update an existing song
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, imageURL, audioURL, artistId, albumId, language, category } =
    req.body;

  try {
    const updatedSong = await Song.findByIdAndUpdate(
      id,
      { name, imageURL, audioURL, artistId, albumId, language, category },
      { new: true, runValidators: true }
    )
      .populate("artistId")
      .populate("albumId");

    if (updatedSong) {
      return res.status(200).send({ success: true, song: updatedSong });
    } else {
      return res.status(404).send({ success: false, msg: "Song not found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Delete a song
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Song.findByIdAndDelete(id);

    if (result) {
      return res
        .status(200)
        .send({ success: true, msg: "Song deleted successfully" });
    } else {
      return res.status(404).send({ success: false, msg: "Song not found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

module.exports = router;
