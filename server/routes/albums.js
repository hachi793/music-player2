const express = require("express");
const router = express.Router();
const Album = require("../models/Album");

// Save a new album
router.post("/save", async (req, res) => {
  const { name, imageURL, description, songs } = req.body;

  if (!name || !imageURL || !description) {
    return res.status(400).send({
      success: false,
      msg: "Title, imageURL, and description are required!",
    });
  }

  const newAlbum = new Album({
    name,
    imageURL,
    description,
    songs,
  });

  try {
    const savedAlbum = await newAlbum.save();
    return res.status(200).send({ success: true, album: savedAlbum });
  } catch (error) {
    return res.status(500).send({ success: false, msg: error.message });
  }
});

// Get an album by ID
router.get("/getAlbum/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const album = await Album.findById(id).populate("songs");

    if (album) {
      return res.status(200).send({ success: true, album });
    } else {
      return res.status(404).send({ success: false, msg: "Album not found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Get all albums
router.get("/getAll", async (req, res) => {
  try {
    const albums = await Album.find().populate("songs").sort({ createdAt: -1 });

    if (albums.length > 0) {
      return res.status(200).send({ success: true, albums });
    } else {
      return res.status(404).send({ success: false, msg: "No albums found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});
// Update an existing album
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, imageURL, description, songs } = req.body;

  try {
    const updatedAlbum = await Album.findByIdAndUpdate(
      id,
      { name, imageURL, description, songs },
      { new: true, runValidators: true }
    ).populate("songs");

    if (updatedAlbum) {
      return res.status(200).send({ success: true, album: updatedAlbum });
    } else {
      return res.status(404).send({ success: false, msg: "Album not found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Delete an album
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Album.findByIdAndDelete(id);

    if (result) {
      return res
        .status(200)
        .send({ success: true, msg: "Album deleted successfully" });
    } else {
      return res.status(404).send({ success: false, msg: "Album not found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});
module.exports = router;
