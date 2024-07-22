const express = require("express");
const router = express.Router();
const { bucket } = require("../config/firebase.config");
const Song = require("../models/Song");

const uploadFile = async (fileBuffer, fileName) => {
  const file = bucket.file(fileName);
  const stream = file.createWriteStream({
    metadata: {
      contentType: "application/octet-stream",
    },
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (error) => {
      reject(error);
    });
    stream.on("finish", async () => {
      try {
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: "03-09-2491",
        });
        resolve(url);
      } catch (error) {
        reject(error);
      }
    });
    stream.end(fileBuffer);
  });
};

router.post("/upload", async (req, res) => {
  try {
    const {
      name,
      artistId,
      albumId,
      language,
      category,
      imageBuffer,
      audioBuffer,
      imageName,
      audioName,
    } = req.body;

    const imageURL = imageBuffer
      ? await uploadFile(Buffer.from(imageBuffer, "base64"), imageName)
      : null;
    const songURL = audioBuffer
      ? await uploadFile(Buffer.from(audioBuffer, "base64"), audioName)
      : null;

    const newSong = new Song({
      name,
      imageURL,
      songURL,
      artistId,
      albumId,
      language,
      category,
    });

    await newSong.save();
    res
      .status(201)
      .json({ message: "Song uploaded successfully!", song: newSong });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Song upload failed!", error: err.message });
  }
});

// Update an existing song
router.put("/update/:songId", async (req, res) => {
  try {
    const { songId } = req.params;
    const { name, artistId, albumId, language, category, imageURL, songURL } =
      req.body;

    const updatedSong = await Song.findByIdAndUpdate(
      songId,
      { name, artistId, albumId, language, category, imageURL, songURL },
      { new: true }
    );

    if (!updatedSong) {
      return res.status(404).json({ message: "Song not found!" });
    }

    res
      .status(200)
      .json({ message: "Song updated successfully!", song: updatedSong });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Song update failed!", error: err.message });
  }
});

// Delete a song
router.delete("/delete/:songId", async (req, res) => {
  try {
    const { songId } = req.params;

    const result = await Song.findByIdAndDelete(songId);

    if (!result) {
      return res.status(404).json({ message: "Song not found!" });
    }

    res.status(200).json({ message: "Song deleted successfully!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Song deletion failed!", error: err.message });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json({ songs });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to fetch songs", error: err.message });
  }
});

// Get a song by ID
router.get("/getSong/:songId", async (req, res) => {
  try {
    const { songId } = req.params;
    const song = await Song.findById(songId);

    if (!song) {
      return res.status(404).json({ message: "Song not found!" });
    }

    res.status(200).json({ song });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to fetch song", error: err.message });
  }
});

module.exports = router;
