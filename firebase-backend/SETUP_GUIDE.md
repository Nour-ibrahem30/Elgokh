# 🔥 دليل الإعداد - Firebase Backend

## الخطوة 1: إنشاء مشروع Firebase

### 1.1 إنشاء المشروع
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. انقر على "Add project" أو "إضافة مشروع"
3. أدخل اسم المشروع: `philosopher-platform`
4. اختر إعدادات Google Analytics (اختياري)
5. انقر "Create project"

### 1.2 الحصول على معلومات التكوين
1. في لوحة تحكم Firebase، انقر على أيقونة الترس ⚙️ → "Project settings"
2. في قسم "Your apps"، انقر على أيقونة الويب `</>`
3. سجل التطبيق باسم: `philosopher-web-app`
4. انسخ معلومات `firebaseConfig`

---

## الخطوة 2: تفعيل Authentication

### 2.1 تفعيل Email/Password
1. في القائمة الجانبية، اذهب إلى **Build** → **Authentication**
2. انقر "Get started"
3. في تبويب "Sign-in method"
4. فعّل **Email/Password**
5. احفظ التغييرات

### 2.2 تفعيل Google Sign-In
1. في نفس الصفحة، فعّل **Google**
2. أدخل بريد الدعم الإلكتروني
3. احفظ التغييرات

---

## الخطوة 3: تفعيل Firestore Database

### 3.1 إنشاء قاعدة البيانات
1. اذهب إلى **Build** → **Firestore Database**
2. انقر "Create database"
3. اختر **Start in test mode** (سنضيف القواعد الأمنية لاحقاً)
4. اختر الموقع الجغرافي الأقرب لك
5. انقر "Enable"

### 3.2 إضافة قواعد الأمان
1. اذهب إلى تبويب **Rules**
2. انسخ محتوى ملف `security-rules/firestore.rules`
3. الصقه في محرر القواعد
4. انقر "Publish"

---

## الخطوة 4: تفعيل Realtime Database

### 4.1 إنشاء قاعدة البيانات
1. اذهب إلى **Build** → **Realtime Database**
2. انقر "Create Database"
3. اختر الموقع الجغرافي
4. اختر **Start in test mode**
5. انقر "Enable"

### 4.2 إضافة قواعد الأمان
1. اذهب إلى تبويب **Rules**
2. انسخ محتوى ملف `security-rules/database.rules.json`
3. الصقه في محرر القواعد
4. انقر "Publish"

### 4.3 الحصول على Database URL
1. في صفحة Realtime Database
2. انسخ الرابط الموجود أعلى الصفحة
3. مثال: `https://philosopher-platform-default-rtdb.firebaseio.com`

---

## الخطوة 5: إعداد المشروع المحلي

### 5.1 تثبيت المكتبات
```bash
cd firebase-backend
npm install
```

### 5.2 إعداد ملف البيئة
```bash
# انسخ ملف المثال
cp .env.example .env

# افتح .env وأضف معلومات Firebase
```

### 5.3 ملء ملف .env
```env
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=philosopher-platform.firebaseapp.com
FIREBASE_PROJECT_ID=philosopher-platform
FIREBASE_STORAGE_BUCKET=philosopher-platform.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456
FIREBASE_DATABASE_URL=https://philosopher-platform-default-rtdb.firebaseio.com

PORT=3000
NODE_ENV=development
```

---

## الخطوة 6: تشغيل المشروع

### 6.1 تشغيل الخادم
```bash
# للتطوير
npm run dev

# للإنتاج
npm start
```

### 6.2 التحقق من التشغيل
افتح المتصفح على:
- http://localhost:3000 - الصفحة الرئيسية
- http://localhost:3000/api/status - حالة الخادم
- http://localhost:3000/api/docs - التوثيق

---

## الخطوة 7: اختبار الوظائف

### 7.1 اختبار التسجيل
```javascript
import { registerUser } from './src/services/auth.service.js';

const teacher = await registerUser(
  'teacher@example.com',
  'password123',
  'محمد ناصر الفيلسوف',
  'teacher'
);
```

### 7.2 اختبار إنشاء دورة
```javascript
import { createCourse } from './src/services/firestore.service.js';

const courseId = await createCourse({
  title: 'مقدمة في الفلسفة',
  description: 'دورة شاملة',
  instructorId: 'teacher-uid',
  thumbnailUrl: 'https://example.com/thumb.jpg'
});
```

### 7.3 اختبار الإشعارات
```javascript
import { sendNotification } from './src/services/realtime.service.js';

await sendNotification({
  title: 'درس جديد',
  courseId: 'course-id',
  message: 'تم إضافة درس جديد',
  type: 'info'
});
```

---

## الخطوة 8: التحقق من Firebase Console

### 8.1 التحقق من المستخدمين
1. اذهب إلى **Authentication** → **Users**
2. يجب أن ترى المستخدمين المسجلين

### 8.2 التحقق من Firestore
1. اذهب إلى **Firestore Database** → **Data**
2. يجب أن ترى المجموعات:
   - users
   - courses
   - lessons
   - notes
   - exams
   - assignments
   - feedback

### 8.3 التحقق من Realtime Database
1. اذهب إلى **Realtime Database** → **Data**
2. يجب أن ترى العقد:
   - progress
   - notifications
   - liveChat

---

## 🎯 الميزات المتاحة

### ✅ Authentication
- تسجيل بالبريد الإلكتروني وكلمة المرور
- تسجيل الدخول بحساب Google
- أدوار المستخدمين (طالب/مدرس)
- إنشاء ملف تعريف تلقائي

### ✅ Firestore Collections
- **users**: ملفات المستخدمين
- **courses**: معلومات الدورات
- **lessons**: دروس مع روابط فيديو خارجية
- **assignments**: الواجبات
- **exams**: الامتحانات
- **notes**: ملاحظات المدرس (تُنشأ تلقائياً)
- **feedback**: تقييمات الطلاب

### ✅ Realtime Database
- **progress**: تتبع تقدم الطلاب
- **notifications**: إشعارات فورية
- **liveChat**: دردشة مباشرة للدورات

### ✅ Security Rules
- المستخدمون المصادق عليهم فقط يمكنهم الوصول
- الطلاب لا يمكنهم إنشاء/تعديل الدورات
- المدرسون لديهم صلاحيات كاملة
- الملاحظات مرئية تلقائياً للطلاب

---

## 🚀 النشر على الإنترنت

### Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Railway
1. اذهب إلى [railway.app](https://railway.app)
2. ربط مع GitHub
3. نشر المشروع

### Render
1. اذهب إلى [render.com](https://render.com)
2. إنشاء Web Service جديد
3. ربط المستودع

---

## 📝 ملاحظات مهمة

### حدود الخطة المجانية (Spark Plan)
- **Firestore**: 1 GB تخزين، 50K قراءة/يوم، 20K كتابة/يوم
- **Realtime Database**: 1 GB تخزين، 10 GB نقل بيانات/شهر
- **Authentication**: غير محدود
- **Storage**: غير متاح (استخدم روابط خارجية)

### استخدام الروابط الخارجية
- **YouTube**: `https://youtube.com/watch?v=VIDEO_ID`
- **Vimeo**: `https://vimeo.com/VIDEO_ID`
- **Google Drive**: `https://drive.google.com/file/d/FILE_ID/view`

### نصائح للأداء
- استخدم الفهرسة في Firestore للاستعلامات المعقدة
- قلل عدد القراءات/الكتابات
- استخدم Realtime Database للبيانات المتغيرة بشكل متكرر
- خزن الملفات الكبيرة خارجياً

---

## 🆘 حل المشاكل

### مشكلة: Firebase not initialized
**الحل**: تأكد من ملء جميع متغيرات البيئة في `.env`

### مشكلة: Permission denied
**الحل**: تحقق من قواعد الأمان في Firebase Console

### مشكلة: Database URL not found
**الحل**: أضف `FIREBASE_DATABASE_URL` في ملف `.env`

### مشكلة: Authentication failed
**الحل**: تأكد من تفعيل طرق التسجيل في Firebase Console

---

## 📞 الدعم

للمساعدة:
1. راجع [Firebase Documentation](https://firebase.google.com/docs)
2. تحقق من ملف `README.md`
3. راجع أمثلة الاختبار في `src/test/testFunctions.js`

---

**✅ الآن مشروعك جاهز للعمل مع Firebase!**
