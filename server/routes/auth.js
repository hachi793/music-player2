const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");

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

router.post("/signup", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    const profileImagePath = profileImage.path;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    /* Mã hóa password */
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "member",
      profileImagePath,
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

/* USER LOGIN*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập không chính xác!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* GET ALL USERS */
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

/* GET USER DATA */
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

/* UPDATE USER INFO */
router.patch("/updateUser/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, password } = req.body;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    existingUser.name = name;
    existingUser.email = email;

    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      existingUser.password = hashedPassword;
    }

    await existingUser.save();
    res.status(200).json({
      message: "User information updated successfully!",
      user: existingUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE USER ROLE */
router.put("/updateRole/:userId", async (req, res) => {
  try {
    const filter = { _id: req.params.userId };
    const { role } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      filter,
      { role: role },
      { new: true }
    );
    res.status(200).send({ success: true, user: updatedUser });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

/* DELETE USER */
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

module.exports = router;
