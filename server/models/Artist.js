const mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    twitter: {
      type: String,
      required: false,
    },
    instagram: {
      type: String,
      required: false,
    },
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: false,
    },
  },
  { timestamps: true }
);

const Artist = mongoose.model("Artist", ArtistSchema);
module.exports = Artist;

// {
//   "name": "John Doe",
//   "imageURL": "https://example.com/images/johndoe.jpg",
//   "description": "John Doe is an acclaimed singer and songwriter known for his soulful voice and heartfelt lyrics.",
//   "twitter": "https://twitter.com/johndoe",
//   "instagram": "https://instagram.com/johndoe"
// }
