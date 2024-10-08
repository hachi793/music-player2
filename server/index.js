const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth.js");
const songRoutes = require("./routes/songs.js");
const albumRoutes = require("./routes/albums.js");
const artistRoutes = require("./routes/artists.js");
const commentRoutes = require("./routes/comments.js");
const playlistRoutes = require("./routes/playlists.js");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/songs", songRoutes);
app.use("/albums", albumRoutes);
app.use("/artists", artistRoutes);
app.use("/comments", commentRoutes);
app.use("/playlists", playlistRoutes);

/* MONGOOSE SETUP */
const PORT = 3001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));
