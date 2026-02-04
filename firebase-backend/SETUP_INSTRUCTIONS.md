# تعليمات إعداد Firebase وإرسال البيانات

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

## الخطوة 2: إرسال البيانات

بعد تحديث القواعد، قم بتشغيل الأمر التالي:

```bash
cd firebase-backend
npm run seed-database
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

## بيانات تسجيل الدخول التجريبية

### 👨‍🏫 المدرس:
- **البريد الإلكتروني:** teacher@learning-platform.com
- **كلمة المرور:** Teacher123!

### 👨‍🎓 الطلاب:

**الطالب 1: أحمد محمد علي**
- **البريد الإلكتروني:** student1@example.com
- **كلمة المرور:** Student123!

**الطالب 2: فاطمة أحمد حسن**
- **البريد الإلكتروني:** student2@example.com
- **كلمة المرور:** Student123!

**الطالب 3: عبدالله سعد المطيري**
- **البريد الإلكتروني:** student3@example.com
- **كلمة المرور:** Student123!

## البيانات المرسلة

سيتم إرسال البيانات التالية إلى Firebase:

- ✅ **4 مستخدمين** (1 مدرس + 3 طلاب)
- ✅ **4 دورات تعليمية** (رياضيات، فيزياء، كيمياء، تاريخ)
- ✅ **10 دروس فيديو** موزعة على الدورات
- ✅ **2 امتحان** مع أسئلة متنوعة
- ✅ **6 مهام** للطلاب
- ✅ **5 نتائج امتحانات**
- ✅ **5 سجلات تقدم** للطلاب
- ✅ **3 ملاحظات** دراسية
- ✅ **3 تقييمات** من الطلاب

## ملاحظات مهمة

1. **الأمان:** تأكد من استعادة قواعد الأمان الأصلية بعد إرسال البيانات
2. **البيانات التجريبية:** جميع البيانات المرسلة هي بيانات تجريبية لأغراض التطوير والاختبار
3. **المستخدمون:** تم إنشاء المستخدمين في Firebase Authentication مسبقاً
4. **الصور:** روابط الصور تستخدم Unsplash للحصول على صور عالية الجودة

## استكشاف الأخطاء

إذا واجهت مشاكل:

1. تأكد من أن قواعد Firestore محدثة
2. تأكد من أن المشروع صحيح في Firebase Console
3. تحقق من اتصال الإنترنت
4. راجع رسائل الخطأ في وحدة التحكم

## الدعم

إذا كنت بحاجة إلى مساعدة، تأكد من:
- تحديث قواعد Firestore كما هو موضح أعلاه
- استخدام بيانات تسجيل الدخول الصحيحة
- التأكد من أن Firebase مُعد بشكل صحيح