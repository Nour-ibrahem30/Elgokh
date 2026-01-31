const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

function initFirebaseAdmin() {
  if (admin.apps && admin.apps.length) return admin;

  const opts = {};
  if (process.env.FIREBASE_DATABASE_URL) opts.databaseURL = process.env.FIREBASE_DATABASE_URL;

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      ...opts,
    });
  } else {
    // Try default initialize (useful in Cloud Functions environment)
    admin.initializeApp({
      ...opts,
    });
  }

  return admin;
}

module.exports = initFirebaseAdmin();
