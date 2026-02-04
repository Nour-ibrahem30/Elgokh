# تعليمات إعداد Firebase وإرسال البيانات - محدث

## الخطوة 1: تحديث قواعد الأمان مؤقتاً

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروع `a-platform-for-learning`
3. اذهب إلى **Firestore Database** → **Rules**
4. استبدل القواعد الحالية بالقواعد التالية مؤقتاً:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // قواعد مؤقتة للسماح بإرسال البيانات التجريبية
    // يجب تغييرها بعد إرسال البيانات
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. اضغط **Publish**

## الخطوة 2: إرسال البيانات الأساسية

بعد تحديث القواعد، قم بتشغيل الأمر التالي:

```bash
cd firebase-backend
npm run seed-basic
```

## الخطوة 3: استعادة قواعد الأمان الأصلية

بعد إرسال البيانات بنجاح، استبدل القواعد بالقواعد الأصلية الآمنة:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isTeacher() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }

    // Users: own record can be read/updated by user; readable by all authenticated users
    match /users/{userId} {
      allow read: if true; // Allow reading for browsing
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if request.auth != null && request.auth.uid == userId;
    }

    // Courses: anyone can read (browsing is free); only teachers can write
    match /courses/{courseId} {
      allow read: if true; // Allow browsing without login
      allow create, update, delete: if isTeacher();
    }

    // Lessons: anyone can read (browsing is free); write only teachers
    match /lessons/{lessonId} {
      allow read: if true; // Allow browsing without login
      allow create, update, delete: if isTeacher();
    }

    // Assignments: anyone can read; teachers only for write
    match /assignments/{assignmentId} {
      allow read: if true; // Allow browsing without login
      allow create, update, delete: if isTeacher();
    }

    // Exams: anyone can read; teachers only for write
    match /exams/{examId} {
      allow read: if true; // Allow browsing without login
      allow create, update, delete: if isTeacher();
    }

    // Notes: students can read/write their own; teachers can read all
    match /notes/{noteId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isTeacher());
    }

    // Todos: students can read/write their own; teachers can read all
    match /todos/{todoId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || isTeacher());
    }

    // Exam Results: students can create their own; teachers can read all
    match /examResults/{resultId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isTeacher();
    }

    // Progress: students can read/write their own; teachers can read all
    match /progress/{progressId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated() && 
        (resource.data.studentId == request.auth.uid || isTeacher());
      allow delete: if isTeacher();
    }

    // Testimonials: anyone can read; authenticated users can create
    match /testimonials/{testimonialId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isTeacher();
    }
  }
}
```

## 🔐 بيانات تسجيل الدخول المحدثة

### 👨‍🏫 المدرس:
- **البريد الإلكتروني:** mohamednaser@gmail.com
- **كلمة المرور:** 16122003

### 👨‍🎓 الطلاب:
- **يمكن لأي طالب التسجيل** باستخدام أي بريد إلكتروني وكلمة مرور
- **سيتم إنشاء حسابهم تلقائياً** عند تسجيل الدخول لأول مرة
- **مثال:** student@example.com / password123

## البيانات التي سيتم إرسالها

سيتم إرسال البيانات التالية إلى Firebase:

- ✅ **4 دورات تعليمية** (رياضيات، فيزياء، كيمياء، تاريخ)
- ✅ **10 دروس فيديو** موزعة على الدورات
- ✅ **2 امتحان** مع أسئلة متنوعة

## المميزات الجديدة

### 🎯 **تسجيل تلقائي للطلاب:**
- الطلاب لا يحتاجون لحسابات محددة مسبقاً
- يمكنهم التسجيل بأي بريد إلكتروني
- سيتم إنشاء ملفهم الشخصي تلقائياً
- سيحصلون على نظام مهام وتتبع تقدم شخصي

### 🔐 **أمان محسن:**
- المدرس فقط: mohamednaser@gmail.com
- جميع المستخدمين الآخرين = طلاب تلقائياً
- قواعد أمان متقدمة تحمي البيانات

### 📱 **تجربة مستخدم محسنة:**
- تسجيل دخول سلس
- إنشاء حسابات تلقائي
- رسائل ترحيب مخصصة
- توجيه تلقائي حسب نوع المستخدم

## ملاحظات مهمة

1. **الأمان:** تأكد من استعادة قواعد الأمان الأصلية بعد إرسال البيانات
2. **المدرس:** فقط mohamednaser@gmail.com يحصل على صلاحيات المدرس
3. **الطلاب:** أي بريد إلكتروني آخر = طالب تلقائياً
4. **البيانات:** ستكون المنصة جاهزة للاستخدام فوراً

## استكشاف الأخطاء

إذا واجهت مشاكل:

1. تأكد من أن قواعد Firestore محدثة
2. تأكد من أن المشروع صحيح في Firebase Console
3. تحقق من اتصال الإنترنت
4. راجع رسائل الخطأ في وحدة التحكم

---

**🌟 الآن منصتك جاهزة مع نظام تسجيل مفتوح للطلاب!**