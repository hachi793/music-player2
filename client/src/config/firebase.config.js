// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNmqT0pTuC6xMM_0sF60-hA34C2PBUYks",
  authDomain: "sptf-music-player.firebaseapp.com",
  databaseURL: "https://sptf-music-player-default-rtdb.firebaseio.com",
  projectId: "sptf-music-player",
  storageBucket: "sptf-music-player.appspot.com",
  messagingSenderId: "699827339389",
  appId: "1:699827339389:web:e68fd5ee94755d258c3114",
};

// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
