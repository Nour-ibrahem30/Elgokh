const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const rtdb = admin.database();

// Automatically create a Firestore user document when a new auth user signs up.
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  const userRef = db.collection('users').doc(user.uid);
  const doc = {
    uid: user.uid,
    name: user.displayName || '',
    email: user.email || '',
    role: 'student',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await userRef.set(doc);

  // Set custom claims for role
  await admin.auth().setCustomUserClaims(user.uid, { role: 'student' });

  return null;
});

// When a teacher adds a note, optionally push a realtime notification to notify students.
exports.onNoteCreate = functions.firestore.document('notes/{noteId}').onCreate(async (snap) => {
  const data = snap.data();
  const payload = {
    title: `New note in course ${data.courseId}`,
    courseId: data.courseId,
    timestamp: admin.database.ServerValue.TIMESTAMP,
  };
  await rtdb.ref('notifications').push(payload);
  return null;
});

// Callable function to update user role (for admin use)
exports.updateUserRole = functions.https.onCall(async (data, context) => {
  // Only allow authenticated users (add admin check if needed)
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { uid, role } = data;
  if (!uid || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'UID and role are required');
  }

  // Update Firestore
  await db.collection('users').doc(uid).update({ role });

  // Update custom claims
  await admin.auth().setCustomUserClaims(uid, { role });

  return { success: true };
});
