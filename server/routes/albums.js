const express = require("express");
const router = express.Router();
const { bucket } = require("../config/firebase.config");
const Artist = require("../models/Album");
const Album = require("../models/Album");

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

// upload a new album
router.post("/upload", async (req, res) => {
  try {
    const { name, imageBuffer, imageName, description } = req.body;
    const imageURL = imageBuffer
      ? await uploadFile(Buffer.from(imageBuffer, "base64"), imageName)
      : null;

    const newAlbum = newAlbum({
      name,
      imageURL,
      imageBuffer,
      description,
    });
    await newAlbum.save();
    res.status(201).json({
      message: "Album uploaded successfully",
      album: newAlbum,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Album uploaded failed ", error: err.message });
  }
});

// Update an existing album
router.put("/update/albumId", async (res, req) => {
  try {
    const { albumId } = req.params;
    const { name, imageURL, description } = req.body;
    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      {
        name,
        imageURL,
        description,
      },
      { new: true }
    );

    if (!updatedAlbum) {
      return res.status(404).json({ message: "Artist not found!" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Album updated failed", error: err.message });
  }
});

// Delete an album
router.delete("/delete/albumId", async (req, res) => {
  try {
    const { albumId } = req.params;

    const result = await Album.findOneAndDelete(albumId);

    if (!result) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Album deleted failed" });
  }
});

module.exports = router;
