const admin = require('../firebaseAdmin');
const firestore = admin.firestore();

async function createUserWithEmail({ email, password, name, role = 'student' }) {
  try {
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Create Firestore user doc (consistent structure)
    await firestore.collection('users').doc(user.uid).set({
      uid: user.uid,
      name: name || user.displayName || '',
      email: user.email,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return user;
  } catch (err) {
    throw err;
  }
}

async function getUserRole(uid) {
  const doc = await firestore.collection('users').doc(uid).get();
  if (!doc.exists) return null;
  return doc.data().role || null;
}

module.exports = { createUserWithEmail, getUserRole };
