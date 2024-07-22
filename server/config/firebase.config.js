// firebase-config.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json"); // Update this path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "sptf-music-player.appspot.com", // Your Firebase Storage Bucket
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
