# 🏗️ معمارية المشروع - Firebase Backend

## 📐 نظرة عامة على البنية

هذا المشروع مبني على مبادئ **Clean Code** و **Separation of Concerns** لضمان قابلية التوسع والصيانة.

---

## 📁 هيكل المشروع

```
firebase-backend/
│
├── src/
│   ├── config/
│   │   └── firebase.js              # تهيئة Firebase
│   │
│   ├── services/
│   │   ├── auth.service.js          # خدمات المصادقة
│   │   ├── firestore.service.js     # عمليات Firestore
│   │   └── realtime.service.js      # عمليات Realtime DB
│   │
│   ├── test/
│   │   └── testFunctions.js         # أمثلة الاختبار
│   │
│   └── index.js                     # نقطة الدخول الرئيسية
│
├── security-rules/
│   ├── firestore.rules              # قواعد أمان Firestore
│   └── database.rules.json          # قواعد أمان Realtime DB
│
├── .env.example                     # مثال لمتغيرات البيئة
├── .gitignore                       # ملفات مستبعدة من Git
├── package.json                     # تبعيات المشروع
├── README.md                        # دليل المشروع
├── SETUP_GUIDE.md                   # دليل الإعداد
├── ARCHITECTURE.md                  # هذا الملف
└── start.bat                        # ملف تشغيل Windows
```

---

## 🔧 الطبقات المعمارية

### 1. طبقة التكوين (Config Layer)
**الملف**: `src/config/firebase.js`

**المسؤولية**:
- تهيئة Firebase SDK
- إنشاء اتصالات مع الخدمات
- تصدير الكائنات للاستخدام

**الخدمات المُهيأة**:
- `auth` - Firebase Authentication
- `firestore` - Firestore Database
- `realtimeDb` - Realtime Database

```javascript
import { auth, firestore, realtimeDb } from './config/firebase.js';
```

---

### 2. طبقة الخدمات (Services Layer)
**الملفات**: `src/services/*.js`

#### 2.1 Auth Service
**الملف**: `auth.service.js`

**الوظائف**:
- `registerUser()` - تسجيل مستخدم جديد
- `loginUser()` - تسجيل الدخول
- `loginWithGoogle()` - تسجيل دخول بـ Google
- `logoutUser()` - تسجيل الخروج
- `getCurrentUser()` - الحصول على المستخدم الحالي

**مثال**:
```javascript
const user = await registerUser(
  'email@example.com',
  'password',
  'الاسم',
  'student'
);
```

#### 2.2 Firestore Service
**الملف**: `firestore.service.js`

**المجموعات المدارة**:
- `users` - ملفات المستخدمين
- `courses` - الدورات
- `lessons` - الدروس
- `assignments` - الواجبات
- `exams` - الامتحانات
- `notes` - ملاحظات المدرس
- `feedback` - التقييمات

**الوظائف الرئيسية**:
```javascript
// المستخدمون
createUserProfile(userData)
getUserProfile(uid)

// الدورات
createCourse(courseData)
getAllCourses()
getCoursesByInstructor(instructorId)

// الدروس
createLesson(lessonData)
getLessonsByCourse(courseId)

// الملاحظات (تُنشأ تلقائياً)
createTeacherNote(noteData)
getNotesByCourse(courseId)

// الامتحانات
createExam(examData)

// الواجبات
createAssignment(assignmentData)

// التقييمات
createFeedback(feedbackData)
```

#### 2.3 Realtime Service
**الملف**: `realtime.service.js`

**العقد المدارة**:
- `progress` - تقدم الطلاب
- `notifications` - الإشعارات
- `liveChat` - الدردشة المباشرة

**الوظائف الرئيسية**:
```javascript
// التقدم
updateStudentProgress(studentUid, courseId, progressData)
markLessonCompleted(studentUid, courseId, lessonId)
markExamCompleted(studentUid, courseId, examId)
getStudentProgress(studentUid, courseId)

// الإشعارات
sendNotification(notificationData)
getAllNotifications()
listenToNotifications(callback) // Real-time

// الدردشة
sendChatMessage(courseId, messageData)
getChatMessages(courseId)
listenToChatMessages(courseId, callback) // Real-time
```

---

### 3. طبقة الأمان (Security Layer)
**الملفات**: `security-rules/*.rules`

#### 3.1 Firestore Security Rules
**الملف**: `firestore.rules`

**القواعد**:
- ✅ المستخدمون المصادق عليهم فقط
- ✅ الطلاب: قراءة فقط للدورات والدروس
- ✅ المدرسون: CRUD كامل
- ✅ الملاحظات: مرئية للجميع، يُنشئها المدرسون فقط

**الدوال المساعدة**:
```javascript
isAuthenticated() // هل المستخدم مسجل دخول؟
isTeacher()       // هل المستخدم مدرس؟
isStudent()       // هل المستخدم طالب؟
isOwner(userId)   // هل المستخدم مالك المستند؟
```

#### 3.2 Realtime Database Security Rules
**الملف**: `database.rules.json`

**القواعد**:
- ✅ التقدم: الطالب والمدرس فقط
- ✅ الإشعارات: قراءة للجميع، كتابة للمدرسين
- ✅ الدردشة: قراءة وكتابة للجميع

---

## 🔄 تدفق البيانات (Data Flow)

### سيناريو 1: تسجيل مستخدم جديد
```
1. Client → registerUser(email, password, name, role)
2. Auth Service → Firebase Authentication
3. Auth Service → createUserProfile() في Firestore
4. Firestore → إنشاء مستند في users collection
5. Return → بيانات المستخدم
```

### سيناريو 2: إنشاء دورة جديدة
```
1. Teacher → createCourse(courseData)
2. Firestore Service → التحقق من الصلاحيات
3. Firestore → إنشاء مستند في courses collection
4. Return → Course ID
```

### سيناريو 3: إضافة ملاحظة مدرس
```
1. Teacher → createTeacherNote(noteData)
2. Firestore Service → إنشاء مستند في notes collection
3. Realtime Service → sendNotification() للطلاب
4. Realtime DB → إضافة إشعار في notifications node
5. Students → تلقي إشعار فوري
```

### سيناريو 4: تتبع تقدم الطالب
```
1. Student → يكمل درس
2. markLessonCompleted(studentUid, courseId, lessonId)
3. Realtime Service → تحديث progress node
4. Realtime DB → إضافة lessonId إلى lessonsCompleted
5. Dashboard → تحديث فوري للتقدم
```

---

## 🎯 مبادئ Clean Code المطبقة

### 1. Single Responsibility Principle
كل ملف له مسؤولية واحدة:
- `auth.service.js` → المصادقة فقط
- `firestore.service.js` → عمليات Firestore فقط
- `realtime.service.js` → عمليات Realtime DB فقط

### 2. Separation of Concerns
فصل الاهتمامات:
- **Config** → التكوين
- **Services** → منطق الأعمال
- **Security** → قواعد الأمان

### 3. DRY (Don't Repeat Yourself)
- دوال قابلة لإعادة الاستخدام
- عدم تكرار الكود
- استخدام helper functions

### 4. Clear Naming
أسماء واضحة ومعبرة:
- `createCourse()` بدلاً من `addC()`
- `markLessonCompleted()` بدلاً من `update()`
- `sendNotification()` بدلاً من `notify()`

### 5. Error Handling
معالجة الأخطاء في كل دالة:
```javascript
try {
  // العملية
  console.log('✅ نجح');
} catch (error) {
  console.error('❌ فشل:', error.message);
  throw error;
}
```

### 6. Async/Await
استخدام async/await لجميع العمليات:
```javascript
export async function createCourse(courseData) {
  try {
    const courseRef = await addDoc(...);
    return courseRef.id;
  } catch (error) {
    throw error;
  }
}
```

---

## 📊 نموذج البيانات (Data Model)

### Firestore Collections

#### users
```javascript
{
  uid: "user123",
  name: "محمد أحمد",
  email: "user@example.com",
  role: "student", // or "teacher"
  createdAt: Timestamp
}
```

#### courses
```javascript
{
  title: "مقدمة في الفلسفة",
  description: "دورة شاملة",
  instructorId: "teacher123",
  thumbnailUrl: "https://...",
  createdAt: Timestamp
}
```

#### lessons
```javascript
{
  courseId: "course123",
  title: "الدرس الأول",
  videoUrl: "https://youtube.com/...",
  notes: "ملاحظات الدرس",
  createdBy: "teacher123",
  createdAt: Timestamp
}
```

#### notes (Teacher Notes)
```javascript
{
  userId: "teacher123",
  courseId: "course123",
  content: "ملاحظة مهمة للطلاب",
  createdAt: Timestamp
}
```

#### exams
```javascript
{
  courseId: "course123",
  title: "امتحان الفصل الأول",
  questions: [
    {
      question: "السؤال؟",
      options: ["أ", "ب", "ج", "د"],
      correctAnswer: 0
    }
  ],
  startTime: Timestamp,
  endTime: Timestamp,
  createdBy: "teacher123",
  createdAt: Timestamp
}
```

### Realtime Database Nodes

#### progress
```javascript
{
  "student123": {
    "course123": {
      "lessonsCompleted": ["lesson1", "lesson2"],
      "examsCompleted": ["exam1"],
      "lastUpdated": 1234567890
    }
  }
}
```

#### notifications
```javascript
{
  "notif123": {
    "title": "درس جديد",
    "courseId": "course123",
    "message": "تم إضافة درس جديد",
    "type": "info",
    "timestamp": 1234567890
  }
}
```

#### liveChat
```javascript
{
  "course123": {
    "msg123": {
      "userId": "user123",
      "userName": "أحمد",
      "message": "مرحباً",
      "timestamp": 1234567890
    }
  }
}
```

---

## 🚀 قابلية التوسع (Scalability)

### إضافة مجموعة جديدة
1. أضف الدوال في `firestore.service.js`
2. أضف القواعد الأمنية في `firestore.rules`
3. وثق الاستخدام في `testFunctions.js`

### إضافة عقدة جديدة في Realtime DB
1. أضف الدوال في `realtime.service.js`
2. أضف القواعد في `database.rules.json`
3. اختبر الوظائف

### إضافة ميزة جديدة
1. حدد الطبقة المناسبة (Auth/Firestore/Realtime)
2. أنشئ الدالة في Service المناسب
3. أضف القواعد الأمنية
4. اختبر الوظيفة
5. وثق الاستخدام

---

## 🔐 الأمان (Security)

### مستويات الأمان

#### 1. Authentication Level
- Firebase Authentication
- Email/Password + Google Sign-In
- Token-based authentication

#### 2. Authorization Level
- Role-based access (student/teacher)
- Firestore Security Rules
- Realtime Database Rules

#### 3. Data Validation
- Input validation في الدوال
- Schema validation في القواعد
- Type checking

### أفضل الممارسات الأمنية
- ✅ لا تخزن بيانات حساسة في Client
- ✅ استخدم HTTPS دائماً
- ✅ راجع القواعد الأمنية بانتظام
- ✅ استخدم Environment Variables
- ✅ لا ترفع `.env` إلى Git

---

## 📈 الأداء (Performance)

### تحسينات Firestore
- استخدم الفهرسة للاستعلامات المعقدة
- قلل عدد القراءات بالتخزين المؤقت
- استخدم `limit()` للنتائج الكبيرة

### تحسينات Realtime Database
- استخدم للبيانات المتغيرة بشكل متكرر
- قلل حجم البيانات المنقولة
- استخدم `off()` لإلغاء الاستماع

### استخدام الروابط الخارجية
- YouTube للفيديوهات
- Google Drive للملفات الكبيرة
- لا تستخدم Firebase Storage (حد مجاني)

---

## 🧪 الاختبار (Testing)

### ملف الاختبار
`src/test/testFunctions.js`

### أمثلة الاختبار
```javascript
import { runAllTests } from './src/test/testFunctions.js';

// تشغيل جميع الاختبارات
await runAllTests();

// أو اختبار محدد
import { testAuthentication } from './src/test/testFunctions.js';
await testAuthentication();
```

---

## 📝 التوثيق (Documentation)

### الملفات المتاحة
- `README.md` - نظرة عامة
- `SETUP_GUIDE.md` - دليل الإعداد خطوة بخطوة
- `ARCHITECTURE.md` - هذا الملف
- `src/test/testFunctions.js` - أمثلة الاستخدام

### التعليقات في الكود
كل دالة موثقة بـ JSDoc:
```javascript
/**
 * وصف الدالة
 * @param {string} param1 - وصف المعامل
 * @returns {Promise<string>} وصف القيمة المرجعة
 */
```

---

## 🎓 الخلاصة

هذا المشروع مبني على:
- ✅ Clean Code principles
- ✅ Separation of Concerns
- ✅ Scalable architecture
- ✅ Security best practices
- ✅ Performance optimization
- ✅ Comprehensive documentation

**جاهز للاستخدام والتوسع! 🚀**
