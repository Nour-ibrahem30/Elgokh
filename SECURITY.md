# 🔒 دليل الأمان - Security Guide

## ✅ التحسينات المُنفذة

### 1. **Environment Variables**
- ✅ تم نقل Firebase credentials إلى `.env`
- ✅ تم إنشاء `.env.example` كمرجع
- ✅ تم تحديث `.gitignore` لحماية `.env`

### 2. **Rate Limiting**
- ✅ حماية ضد DDoS attacks
- ✅ حد أقصى 100 طلب كل 15 دقيقة
- ✅ تنظيف تلقائي للذاكرة

### 3. **Authentication Service**
- ✅ نظام مركزي للمصادقة
- ✅ معالجة أخطاء محسّنة
- ✅ حماية المسارات (requireAuth, requireTeacher)

### 4. **Error Handling**
- ✅ نظام موحد لمعالجة الأخطاء
- ✅ تسجيل الأخطاء (logging)
- ✅ إشعارات للمستخدم

## 📋 خطوات التشغيل

### 1. تثبيت Dependencies
```bash
npm install
```

### 2. إعداد Environment Variables
```bash
cp .env.example .env
# ثم قم بتعديل .env بالقيم الصحيحة
```

### 3. تشغيل السيرفر
```bash
npm start
```

## ⚠️ ملاحظات مهمة

### للإنتاج (Production):
1. **غيّر جميع القيم في `.env`**
2. **استخدم HTTPS فقط**
3. **فعّل Firebase Security Rules**
4. **استخدم password hashing (bcrypt)**

### للتطوير (Development):
1. **لا ترفع `.env` على Git**
2. **استخدم `.env.example` للمشاركة**
3. **راجع logs بانتظام**

## 🔐 Firebase Security Rules

### Firestore Rules (مقترح):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Todos collection
    match /todos/{todoId} {
      allow read, write: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Public collections (read-only for students)
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'teacher';
    }
    
    match /exams/{examId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'teacher';
    }
  }
}
```

## 🚀 الخطوات التالية

### المرحلة 2 (Performance):
- [ ] Lazy loading للصور
- [ ] Code splitting
- [ ] Caching strategy
- [ ] Image optimization

### المرحلة 3 (Firebase Integration):
- [ ] دمج كامل مع Firebase Auth
- [ ] Offline persistence
- [ ] Real-time updates
- [ ] Security rules

## 📞 الدعم

للمساعدة أو الإبلاغ عن مشاكل أمنية:
- Email: nouribrahem207@gmail.com
- LinkedIn: [Nour Ibrahem](https://www.linkedin.com/in/nour-ibrahem-499172346/)

---

**تم التحديث:** ${new Date().toLocaleDateString('ar-EG')}
**المطور:** Nour Ibrahem & Amazon Q
