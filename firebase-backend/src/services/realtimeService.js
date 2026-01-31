const admin = require('../firebaseAdmin');

const db = admin.database();

async function setProgress(studentUid, courseId, { lessonsCompleted = [], examsCompleted = [] } = {}) {
  const path = `progress/${studentUid}/${courseId}`;
  const ref = db.ref(path);
  await ref.update({
    lessonsCompleted,
    examsCompleted,
    updatedAt: admin.database.ServerValue.TIMESTAMP,
  });
  return { path, lessonsCompleted, examsCompleted };
}

async function pushNotification({ title, courseId, metadata = {} }) {
  const ref = db.ref('notifications').push();
  const payload = {
    title,
    courseId: courseId || null,
    timestamp: admin.database.ServerValue.TIMESTAMP,
    metadata,
  };
  await ref.set(payload);
  return { id: ref.key, ...payload };
}

async function pushChatMessage(courseId, { userId, message }) {
  const ref = db.ref(`liveChat/${courseId}`).push();
  const msg = {
    userId,
    message,
    timestamp: admin.database.ServerValue.TIMESTAMP,
  };
  await ref.set(msg);
  return { id: ref.key, ...msg };
}

module.exports = { setProgress, pushNotification, pushChatMessage };
