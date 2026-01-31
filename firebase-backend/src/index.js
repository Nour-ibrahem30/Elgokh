const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('./firebaseAdmin');
const { authenticate } = require('./middleware/authMiddleware');
const firestore = require('./services/firestoreService');
const realtime = require('./services/realtimeService');
const authService = require('./services/authService');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Signup via server (creates auth user + firestore user doc)
app.post('/signup', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
    const user = await authService.createUserWithEmail({ email, password, name, role });
    return res.json({ uid: user.uid, email: user.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Protected routes below
app.post('/courses', authenticate, async (req, res) => {
  try {
    // only teachers
    const role = await authService.getUserRole(req.user.uid);
    if (role !== 'teacher') return res.status(403).json({ error: 'Only teachers can create courses' });
    const course = await firestore.createCourse({ ...req.body, instructorId: req.user.uid });
    return res.json(course);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/lessons', authenticate, async (req, res) => {
  try {
    const role = await authService.getUserRole(req.user.uid);
    if (role !== 'teacher') return res.status(403).json({ error: 'Only teachers can create lessons' });
    const lesson = await firestore.createLesson({ ...req.body, createdBy: req.user.uid });
    return res.json(lesson);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/notes', authenticate, async (req, res) => {
  try {
    const role = await authService.getUserRole(req.user.uid);
    if (role !== 'teacher') return res.status(403).json({ error: 'Only teachers can add notes' });
    const note = await firestore.addTeacherNote({ userId: req.user.uid, ...req.body });
    // Optionally push notification to RTDB
    await realtime.pushNotification({ title: `New note for course ${note.courseId}`, courseId: note.courseId });
    return res.json(note);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/progress/:studentUid/:courseId', authenticate, async (req, res) => {
  try {
    // students update their own progress OR teachers/admins
    const { studentUid, courseId } = req.params;
    if (req.user.uid !== studentUid) {
      const role = await authService.getUserRole(req.user.uid);
      if (role !== 'teacher') return res.status(403).json({ error: 'Forbidden' });
    }
    const result = await realtime.setProgress(studentUid, courseId, req.body);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/notify', authenticate, async (req, res) => {
  try {
    const role = await authService.getUserRole(req.user.uid);
    if (role !== 'teacher') return res.status(403).json({ error: 'Only teachers can push notifications' });
    const note = await realtime.pushNotification(req.body);
    return res.json(note);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Firebase backend sample running on ${port}`));
