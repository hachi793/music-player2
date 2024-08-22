const express = require("express");
const router = express.Router();
const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

// Add a new playlist
router.post("/add", async (req, res) => {
  const { userId, name, imageURL, description, songs } = req.body;

  if (!userId) {
    return res.status(400).send({
      success: false,
      msg: "User is required",
    });
  }

  const newPlaylist = new Playlist({
    userId,
    name,
    imageURL,
    description,
    songs,
  });

  try {
    const savedPlaylist = await newPlaylist.save();
    return res.status(200).send({ success: true, playlist: savedPlaylist });
  } catch (error) {
    return res.status(500).send({ success: false, msg: error.message });
  }
});

// Get All Playlist
router.get("/getAll", async (req, res) => {
  try {
    const playlists = await Playlist.find()
      .populate("userId")
      .populate("songs")
      .sort({ createAt: -1 });

    if (playlists.length > 0) {
      return res.status(200).send({ success: true, playlists });
    } else {
      return res
        .status(404)
        .send({ success: false, msg: "No playlist is found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Get playlist by id
router.get("/getPlaylist/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const playlist = await Playlist.findById(id).populate("songs");
    if (playlist) {
      return res.status(200).send({ success: true, playlist });
    } else {
      return res
        .status(404)
        .send({ success: false, msg: "Playlist not found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Get playlists by UserId
router.get("/getPlaylistsByUserId/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const playlists = await Playlist.find({ userId })
      .populate("userId")
      .populate("songs");

    if (playlists) {
      return res.status(200).send({ success: true, playlists });
    } else {
      return res
        .status(404)
        .send({ success: false, msg: "No playlist is found" });
    }
  } catch (error) {
    return res.status(400).send({
      success: false,
      msg: error.message,
    });
  }
});

// Add song to playlist
router.post("/addToPlaylist/:playlistId", async (req, res) => {
  const { playlistId } = req.params;
  const { songId } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res
        .status(404)
        .send({ success: false, msg: "Playlist not found" });
    }

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();

      const updatedPlaylist = await Playlist.findById(playlistId).populate(
        "songs"
      );

      return res.status(200).send({
        success: true,
        playlist: updatedPlaylist,
      });
    } else {
      return res
        .status(400)
        .send({ success: false, msg: "Song already in the playlist" });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      msg: error.message,
    });
  }
});

// Remove song from playlist
router.post("/removeFromPlaylist/:playlistId", async (req, res) => {
  const { playlistId } = req.params;
  const { songId } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });

    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
    await playlist.save();

    const updatedPlaylist = await Playlist.findById(playlistId).populate(
      "songs"
    );

    res.status(200).json({
      message: "Song removed from playlist successfully",
      playlist: updatedPlaylist,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Playlist By Id
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { userId, name, imageURL, description, songs } = req.body;

  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      { userId, name, imageURL, description, songs },
      { new: true, runValidators: true }
    ).populate("songs");

    if (updatedPlaylist) {
      return res.status(200).send({ success: true, playlist: updatedPlaylist });
    } else {
      return res
        .status(404)
        .send({ success: false, msg: "Playlist not found" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
});

// Delete playlist
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const playlist = await Playlist.findByIdAndDelete(id);

    if (playlist) {
      return res
        .status(200)
        .send({ success: true, msg: "Deleted playlist successfully" });
    } else {
      return res
        .status(404)
        .send({ success: false, msg: "Playlist not found" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, msg: error.message });
  }
});
module.exports = router;
