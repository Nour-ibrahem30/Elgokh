# 🔥 Firebase Backend - Educational Platform

Clean, scalable backend using Firebase (Free Spark Plan)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password + Google)
4. Enable Firestore Database
5. Enable Realtime Database
6. Copy your config to `.env` file

### 3. Setup Environment
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

### 4. Run the Server
```bash
npm start
# or for development
npm run dev
```

## 📁 Project Structure

```
firebase-backend/
├── src/
│   ├── config/
│   │   └── firebase.js          # Firebase initialization
│   ├── services/
│   │   ├── auth.service.js      # Authentication logic
│   │   ├── firestore.service.js # Firestore operations
│   │   └── realtime.service.js  # Realtime DB operations
│   ├── controllers/
│   │   ├── user.controller.js   # User management
│   │   ├── course.controller.js # Course operations
│   │   ├── lesson.controller.js # Lesson management
│   │   └── note.controller.js   # Teacher notes
│   ├── routes/
│   │   └── api.routes.js        # API endpoints
│   ├── middleware/
│   │   └── auth.middleware.js   # Auth verification
│   ├── utils/
│   │   └── helpers.js           # Helper functions
│   └── index.js                 # Entry point
├── security-rules/
│   ├── firestore.rules          # Firestore security
│   └── database.rules.json      # Realtime DB security
└── package.json
```

## 🔐 Security Rules

Security rules are automatically configured for:
- ✅ Only authenticated users can access data
- ✅ Students cannot create/edit courses, lessons, exams
- ✅ Teachers have full CRUD permissions
- ✅ Notes are automatically visible to course students

## 📊 Database Structure

### Firestore Collections:
- `users` - User profiles and roles
- `courses` - Course information
- `lessons` - Course lessons with external video links
- `assignments` - Student assignments
- `exams` - Exams and quizzes
- `notes` - Teacher notes (auto-created)
- `feedback` - Student feedback

### Realtime Database Nodes:
- `progress` - Student progress tracking
- `notifications` - Real-time notifications
- `liveChat` - Course chat rooms

## 🎯 Features

- ✅ Email/Password & Google Authentication
- ✅ Role-based access (student/teacher)
- ✅ Auto-create Firestore documents
- ✅ Real-time progress tracking
- ✅ Live notifications
- ✅ Teacher notes auto-sync
- ✅ External video links (YouTube, Vimeo, Drive)
- ✅ Clean code architecture
- ✅ Scalable structure

## 📝 API Examples

See `src/test/testFunctions.js` for usage examples.

## 🌐 Deploy

Ready to deploy on:
- Vercel
- Railway
- Render
- Any Node.js hosting

---

**Built with Clean Code principles for scalability and maintainability**
