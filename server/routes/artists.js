const express = require("express");
const router = express.Router();
const { bucket } = require("../config/firebase.config");
const Artist = require("../models/Artist");

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
// Get an artist by ID
router.get("/getArtist/:artistId", async (req, res) => {
  try {
    const { artistId } = req.params;
    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res.status(404).json({ message: "Artist not found!" });
    }

    res.status(200).json({ artist });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to fetch artist", error: err.message });
  }
});

// Get all artists
router.get("/getAll", async (req, res) => {
  try {
    const artists = await Artist.find();
    res.status(200).json({ artists });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to fetch artists", error: err.message });
  }
});

// Upload a new artist
router.post("/upload", async (req, res) => {
  try {
    const { name, imageBuffer, imageName, description, twitter, instagram } =
      req.body;

    const imageURL = imageBuffer
      ? await uploadFile(Buffer.from(imageBuffer, "base64"), imageName)
      : null;

    const newArtist = new Artist({
      name,
      imageURL,
      description,
      twitter,
      instagram,
    });

    await newArtist.save();
    res.status(201).json({
      message: "Artist uploaded successfully!",
      artist: newArtist,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Artist upload failed!", error: err.message });
  }
});

// Update an existing artist
router.put("/update/:artistId", async (req, res) => {
  try {
    const { artistId } = req.params;
    const { name, imageURL, description, twitter, instagram } = req.body;

    const updatedArtist = await Artist.findByIdAndUpdate(
      artistId,
      { name, imageURL, description, twitter, instagram },
      { new: true }
    );

    if (!updatedArtist) {
      return res.status(404).json({ message: "Artist not found!" });
    }

    res.status(200).json({
      message: "Artist updated successfully!",
      artist: updatedArtist,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Artist update failed!", error: err.message });
  }
});

// Delete an artist
router.delete("/delete/:artistId", async (req, res) => {
  try {
    const { artistId } = req.params;

    const result = await Artist.findByIdAndDelete(artistId);

    if (!result) {
      return res.status(404).json({ message: "Artist not found!" });
    }

    res.status(200).json({ message: "Artist deleted successfully!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Artist deletion failed!", error: err.message });
  }
});

module.exports = router;
