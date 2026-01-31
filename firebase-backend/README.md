# Firebase Backend (clean scaffold)

This folder contains an example backend scaffold using Firebase Admin SDK, Firestore, Realtime Database and sample Cloud Functions.

Key features:
- Express server with authenticated endpoints (verify Firebase ID token)
- Firestore service module (courses, lessons, assignments, exams, notes, feedback)
- Realtime Database service module (progress, notifications, liveChat)
- Cloud Function examples: `onUserCreate` and `onNoteCreate`
- Firestore and Realtime Database security rules

Setup (local server)

1. Install dependencies:

```bash
cd firebase-backend
npm install
```

2. Set environment variables (recommended):

- `GOOGLE_APPLICATION_CREDENTIALS` -> path to service account JSON (for admin SDK)
- `FIREBASE_DATABASE_URL` -> your RTDB URL (e.g. https://<project>.firebaseio.com)
- `PORT` -> optional

3. Run server:

```bash
npm start
```

Cloud Functions:
- Example functions are in `functions/index.js`. Deploy with `firebase deploy --only functions` from the root of your Firebase project.

Security rules are in `security/`.
