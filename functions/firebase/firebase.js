const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.APP_API_KEY,
  authDomain: process.env.APP_PROJECT_ID + ".firebaseapp.com",
  projectId: process.env.APP_PROJECT_ID,
  storageBucket: process.env.APP_PROJECT_ID + ".appspot.com",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();

exports.db = db;
