const admin = require('firebase-admin');
require('dotenv').config();

let db;

const connectDB = () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log('✅ Firebase Admin SDK Initialized');
    }
    db = admin.firestore();
    return db;
  } catch (error) {
    console.error(`❌ Firebase Initialization Error: ${error.message}`);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    return connectDB();
  }
  return db;
};

module.exports = { connectDB, getDB, admin };
