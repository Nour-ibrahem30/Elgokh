# 🔒 تحديث قواعد Firestore

## ⚠️ مهم جداً

يجب تحديث قواعد Firestore في Firebase Console لكي يعمل نظام تتبع التقدم الجديد.

---

## 📋 الخطوات

### 1. افتح Firebase Console
انتقل إلى: https://console.firebase.google.com/

### 2. اختر المشروع
اختر مشروع `a-platform-for-learning`

### 3. افتح Firestore Database
من القائمة الجانبية:
- Build → Firestore Database

### 4. افتح قواعد الأمان (Rules)
- اضغط على تبويب "Rules" في الأعلى

### 5. انسخ القواعد الجديدة
انسخ محتوى ملف `firestore.rules` من المشروع والصقه في المحرر

أو انسخ هذا الكود:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isTeacher() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isTeacher();
      allow delete: if isTeacher();
    }
    
    // Lessons/Videos collection
    match /lessons/{lessonId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher();
    }
    
    // Videos collection (same as lessons)
    match /videos/{videoId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher();
    }
    
    // Exams collection
    match /exams/{examId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher();
    }
    
    // Exam Results
    match /examResults/{resultId} {
      allow read: if isAuthenticated() && 
                     (isOwner(resource.data.userId) || isTeacher());
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow update, delete: if isTeacher();
    }
    
    // Video Watches - Track which videos students have watched
    match /videoWatches/{watchId} {
      allow read: if isAuthenticated() && 
                     (isOwner(resource.data.userId) || isTeacher());
      allow create, update: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow delete: if isTeacher();
    }
    
    // Notes collection
    match /notes/{noteId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher();
    }
    
    // Materials collection
    match /materials/{materialId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher();
    }
    
    // Testimonials collection
    match /testimonials/{testimonialId} {
      allow read: if true; // Public read for testimonials
      allow write: if isTeacher();
    }
    
    // Todos collection
    match /todos/{todoId} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
    }
    
    // Progress tracking
    match /progress/{progressId} {
      allow read: if isAuthenticated() && 
                     (isOwner(resource.data.studentId) || isTeacher());
      allow write: if isAuthenticated() && isOwner(request.resource.data.studentId);
    }
    
    // Motivational messages
    match /motivationalMessages/{messageId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher();
    }
    
    // Reviews/Feedback
    match /reviews/{reviewId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId);
      allow delete: if isTeacher() || isOwner(resource.data.userId);
    }
  }
}
```

### 6. انشر القواعد (Publish)
- اضغط على زر "Publish" في الأعلى
- انتظر رسالة التأكيد

---

## ✅ التحقق من النشر

بعد النشر، يجب أن ترى:
- ✅ "Rules published successfully"
- ✅ تاريخ ووقت آخر تحديث

---

## 🔍 ما الذي تم إضافته؟

### 1. قواعد `videoWatches`
```javascript
match /videoWatches/{watchId} {
  allow read: if isAuthenticated() && 
                 (isOwner(resource.data.userId) || isTeacher());
  allow create, update: if isAuthenticated() && 
                           isOwner(request.resource.data.userId);
  allow delete: if isTeacher();
}
```

**الأذونات:**
- الطالب يمكنه قراءة وكتابة سجلات المشاهدة الخاصة به فقط
- المعلم يمكنه قراءة جميع السجلات
- المعلم فقط يمكنه الحذف

### 2. تحديث قواعد `examResults`
تم تغيير `studentId` إلى `userId` لتوحيد الأسماء

---

## ⚠️ تحذيرات

1. **لا تنشر القواعد قبل نسخها بالكامل** - قد يؤدي ذلك لحظر الوصول
2. **تأكد من نسخ الكود كاملاً** - القواعد الناقصة تسبب أخطاء
3. **لا تعدل القواعد يدوياً** إلا إذا كنت تعرف ما تفعل

---

## 🧪 اختبار القواعد

بعد النشر، جرب:

### كطالب:
1. سجل دخول كطالب
2. شاهد فيديو
3. افتح Console (F12)
4. يجب أن ترى: `✅ Video watch tracked`

### كمعلم:
1. سجل دخول كمعلم
2. يمكنك رؤية جميع البيانات
3. يمكنك الحذف والتعديل

---

## 🆘 حل المشاكل

### خطأ: "Missing or insufficient permissions"
**السبب:** القواعد لم تُنشر بشكل صحيح

**الحل:**
1. ارجع لـ Firebase Console
2. تحقق من القواعد
3. تأكد من وجود قواعد `videoWatches` و `examResults`
4. أعد النشر

### خطأ: "Property userId is undefined"
**السبب:** البيانات المرسلة لا تحتوي على `userId`

**الحل:**
1. تأكد من تسجيل الدخول
2. تحقق من Console للأخطاء
3. تأكد من أن الكود يرسل `userId` صحيح

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Console (F12) للأخطاء
2. راجع ملف `نظام_تتبع_التقدم_الحقيقي.md`
3. تأكد من نشر القواعد بشكل صحيح

---

## ✨ بعد التحديث

بعد نشر القواعد بنجاح:
- ✅ الطلاب يمكنهم تسجيل تقدمهم
- ✅ نتائج الامتحانات تُحفظ تلقائياً
- ✅ الإحصائيات تظهر بشكل حقيقي
- ✅ الإنجازات تعتمد على البيانات الفعلية

**جاهز للاستخدام! 🎉**
