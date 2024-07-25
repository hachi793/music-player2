const express = require("express");
const router = express.Router();
const Artist = require("../models/Artist");

// Save a new artist
router.post("/save", async (req, res) => {
  const { name, imageURL, description, twitter, instagram, songId } = req.body;

  if (!name || !imageURL || !description) {
    return res
      .status(400)
      .send({
        success: false,
        msg: "Name, imageURL, and description are required!",
      });
  }

  const newArtist = new Artist({
    name,
    imageURL,
    description,
    twitter,
    instagram,
    songId,
  });

  try {
    const savedArtist = await newArtist.save();
    return res.status(200).send({ success: true, artist: savedArtist });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Get an artist by ID
router.get("/getArtist/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const artist = await Artist.findById(id);

    if (artist) {
      return res.status(200).send({ success: true, artist });
    } else {
      return res.status(404).send({ success: false, msg: "Artist not found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Get all artists
router.get("/getAll", async (req, res) => {
  try {
    const artists = await Artist.find().sort({ createdAt: 1 });

    if (artists.length > 0) {
      return res.status(200).send({ success: true, artists });
    } else {
      return res.status(404).send({ success: false, msg: "No artists found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Update an existing artist
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, imageURL, description, twitter, instagram, songId } = req.body;

  try {
    const updatedArtist = await Artist.findByIdAndUpdate(
      id,
      { name, imageURL, description, twitter, instagram, songId },
      { new: true, runValidators: true }
    );

    if (updatedArtist) {
      return res.status(200).send({ success: true, artist: updatedArtist });
    } else {
      return res.status(404).send({ success: false, msg: "Artist not found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Delete an artist
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Artist.findByIdAndDelete(id);

    if (result) {
      return res
        .status(200)
        .send({ success: true, msg: "Artist deleted successfully" });
    } else {
      return res.status(404).send({ success: false, msg: "Artist not found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

module.exports = router;
