const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");
const Song = require("../models/Song");

const router = express.Router();

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/* User Signup */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, profileImagePath } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "member",
      profileImagePath,
      favoriteSongs: [],
    });

    await newUser.save();
    res
      .status(200)
      .json({ message: "User signed up successfully!", user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Signup failed!", error: err.message });
  }
});

/* User Login */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect login details!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* Get All Users */
router.get("/getUsers", async (req, res) => {
  try {
    const options = { sort: { createdAt: 1 } };
    const data = await User.find({}, null, options);
    if (data.length > 0) {
      return res.status(200).send({ success: true, users: data });
    } else {
      return res.status(404).json({ success: false, msg: "No users found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* Get User Data */
router.get("/getUser/:userId", async (req, res) => {
  try {
    const filter = { _id: req.params.userId };
    const data = await User.findOne(filter);
    if (data) {
      return res.status(200).send({ success: true, user: data });
    } else {
      return res.status(404).send({ success: false, msg: "Data not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* Update User Info */
router.patch("/update-details", async (req, res) => {
  try {
    const { userId, name, email, profileImagePath } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (profileImagePath) user.profileImagePath = profileImagePath;

    await user.save();
    res
      .status(200)
      .json({ message: "User details updated successfully", user });
  } catch (err) {
    console.error("Update details failed:", err);
    res
      .status(500)
      .json({ message: "Update details failed!", error: err.message });
  }
});

router.patch("/update-password", async (req, res) => {
  try {
    const { userId, password, newPassword, confirmNewPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }
  } catch (err) {
    console.error("Update password failed:", err);
    res
      .status(500)
      .json({ message: "Update password failed!", error: err.message });
  }
});

/* Update User Role */
router.put("/updateRole/:userId", async (req, res) => {
  try {
    const filter = { _id: req.params.userId };
    const { role } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      filter,
      { role },
      { new: true }
    );
    res.status(200).send({ success: true, user: updatedUser });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

/* Delete User */
router.delete("/deleteUser/:userId", async (req, res) => {
  try {
    const filter = { _id: req.params.userId };
    const result = await User.deleteOne(filter);

    if (result.deletedCount === 1) {
      res.status(200).send({ success: true, msg: "User removed" });
    } else {
      res.status(404).send({ success: false, msg: "Data not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Add a Song to Favorites */
router.post("/addToFavorite", async (req, res) => {
  const { userId, songId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.favoriteSongs.includes(songId)) {
      user.favoriteSongs.push(songId);
      await user.save();
      res.status(200).json({ message: "Song added to favorites" });
    } else {
      res.status(400).json({ error: "Song already in favorites" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Remove a Song from Favorites */
router.post("/removeFromFavorite", async (req, res) => {
  const { userId, songId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.favoriteSongs = user.favoriteSongs.filter(
      (id) => id.toString() !== songId
    );
    await user.save();
    res.status(200).json({ message: "Song removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Get Favorite Songs */
router.get("/getFavoriteSongs/:userId", async (req, res) => {
  const filter = { _id: req.params.userId };

  try {
    const user = await User.findById(filter);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ favoriteSongs: user.favoriteSongs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
