const admin = require('../firebaseAdmin');

const db = admin.firestore();
const { FieldValue } = admin.firestore;

async function ensureUserDoc(user) {
  const userRef = db.collection('users').doc(user.uid);
  const snap = await userRef.get();
  if (!snap.exists) {
    await userRef.set({
      uid: user.uid,
      name: user.name || user.displayName || '',
      email: user.email || '',
      role: user.role || 'student',
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  return userRef;
}

async function createCourse({ title, description, instructorId, thumbnailUrl }) {
  const ref = db.collection('courses').doc();
  const doc = {
    title,
    description: description || '',
    instructorId,
    thumbnailUrl: thumbnailUrl || null,
    createdAt: FieldValue.serverTimestamp(),
  };
  await ref.set(doc);
  return { id: ref.id, ...doc };
}

async function createLesson({ courseId, title, videoUrl, notes, createdBy }) {
  const ref = db.collection('lessons').doc();
  const doc = {
    courseId,
    title,
    videoUrl: videoUrl || null,
    notes: notes || null,
    createdBy,
    createdAt: FieldValue.serverTimestamp(),
  };
  await ref.set(doc);
  return { id: ref.id, ...doc };
}

async function createAssignment({ courseId, title, description, dueDate, resources, createdBy }) {
  const ref = db.collection('assignments').doc();
  const doc = {
    courseId,
    title,
    description: description || '',
    dueDate: dueDate || null,
    resources: Array.isArray(resources) ? resources : [],
    createdBy,
    createdAt: FieldValue.serverTimestamp(),
  };
  await ref.set(doc);
  return { id: ref.id, ...doc };
}

async function createExam({ courseId, title, questions, startTime, endTime, createdBy }) {
  const ref = db.collection('exams').doc();
  const doc = {
    courseId,
    title,
    questions: Array.isArray(questions) ? questions : [],
    startTime: startTime || null,
    endTime: endTime || null,
    createdBy,
    createdAt: FieldValue.serverTimestamp(),
  };
  await ref.set(doc);
  return { id: ref.id, ...doc };
}

async function addTeacherNote({ userId, courseId, content }) {
  const ref = db.collection('notes').doc();
  const doc = {
    userId,
    courseId,
    content,
    createdAt: FieldValue.serverTimestamp(),
  };
  await ref.set(doc);
  return { id: ref.id, ...doc };
}

async function addFeedback({ userId, courseId, rating, comment }) {
  const ref = db.collection('feedback').doc();
  const doc = {
    userId,
    courseId,
    rating,
    comment: comment || '',
    createdAt: FieldValue.serverTimestamp(),
  };
  await ref.set(doc);
  return { id: ref.id, ...doc };
}

module.exports = {
  ensureUserDoc,
  createCourse,
  createLesson,
  createAssignment,
  createExam,
  addTeacherNote,
  addFeedback,
};
