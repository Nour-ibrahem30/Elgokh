# 🔧 حل مشكلة تسجيل الدخول بـ Google بعد تغيير الدومين

## 🔴 المشكلة
بعد تغيير الدومين، تسجيل الدخول بـ Google لا يعمل ويظهر خطأ مثل:
- "redirect_uri_mismatch"
- "This app is blocked"
- "Error 400: redirect_uri_mismatch"

---

## ✅ الحل الكامل

### الخطوة 1️⃣: تحديث Authorized Domains في Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك: **a-platform-for-learning**
3. من القائمة الجانبية، اختر **Authentication**
4. اضغط على تبويب **Settings** (الإعدادات)
5. انزل لقسم **Authorized domains** (النطاقات المصرح بها)
6. اضغط على **Add domain** (إضافة نطاق)
7. أضف الدومين الجديد (مثلاً: `your-new-domain.com`)
8. اضغط **Add** (إضافة)

**ملاحظة:** يجب إضافة الدومين بدون `https://` أو `www`
- ✅ صحيح: `example.com`
- ❌ خطأ: `https://example.com`
- ❌ خطأ: `www.example.com`

---

### الخطوة 2️⃣: تحديث OAuth Redirect URIs في Google Cloud Console

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. اختر مشروعك
3. من القائمة الجانبية، اختر **APIs & Services** > **Credentials**
4. ابحث عن **OAuth 2.0 Client IDs**
5. اضغط على اسم الـ Client ID الخاص بـ Firebase
6. في قسم **Authorized JavaScript origins**، أضف:
   ```
   https://your-new-domain.com
   ```
7. في قسم **Authorized redirect URIs**، أضف:
   ```
   https://your-new-domain.com/__/auth/handler
   ```
8. اضغط **Save** (حفظ)

---

### الخطوة 3️⃣: تحديث Firebase Config (إذا لزم الأمر)

إذا كنت تستخدم Custom Domain، قد تحتاج لتحديث `authDomain` في Firebase Config:

**الملف:** `public/assets/js/firebase-config-secure.js` أو أي ملف يحتوي على Firebase Config

```javascript
export const firebaseConfig = {
    apiKey: "AIzaSyAU0CCiQNrPEYpTNU4rAwmOmPUZnjb2FoU",
    authDomain: "a-platform-for-learning.firebaseapp.com", // أو الدومين الجديد
    projectId: "a-platform-for-learning",
    storageBucket: "a-platform-for-learning.firebasestorage.app",
    messagingSenderId: "764579707883",
    appId: "1:764579707883:web:5456e2348354cc58fab7ae",
    measurementId: "G-4P972FP416",
    databaseURL: "https://a-platform-for-learning-default-rtdb.firebaseio.com"
};
```

**ملاحظة مهمة:** 
- إذا كنت تستخدم Firebase Hosting، اترك `authDomain` كما هو: `a-platform-for-learning.firebaseapp.com`
- إذا كنت تستخدم Custom Domain خارج Firebase، غيّر `authDomain` للدومين الجديد

---

### الخطوة 4️⃣: مسح الـ Cache والـ Cookies

بعد التحديثات، امسح الـ Cache:

**في Chrome:**
1. اضغط `Ctrl + Shift + Delete` (أو `Cmd + Shift + Delete` على Mac)
2. اختر **Cookies and other site data**
3. اختر **Cached images and files**
4. اضغط **Clear data**

**أو:**
- افتح الموقع في وضع Incognito/Private
- جرب من متصفح آخر

---

## 🔍 التحقق من الإعدادات الحالية

### في Firebase Console:
1. **Authentication** > **Settings** > **Authorized domains**
2. تأكد من وجود:
   - ✅ `localhost` (للتطوير المحلي)
   - ✅ `a-platform-for-learning.firebaseapp.com` (Firebase Hosting)
   - ✅ الدومين الجديد

### في Google Cloud Console:
1. **APIs & Services** > **Credentials** > **OAuth 2.0 Client IDs**
2. تأكد من وجود الدومين الجديد في:
   - **Authorized JavaScript origins**
   - **Authorized redirect URIs**

---

## 🐛 حل المشاكل الشائعة

### المشكلة 1: "redirect_uri_mismatch"
**السبب:** الـ Redirect URI غير مطابق
**الحل:** 
- تأكد من إضافة `https://your-domain.com/__/auth/handler` في Google Cloud Console
- تأكد من عدم وجود مسافات أو أخطاء إملائية

### المشكلة 2: "This app is blocked"
**السبب:** التطبيق في وضع Testing في Google Cloud
**الحل:**
1. اذهب إلى **OAuth consent screen**
2. غيّر Publishing status من **Testing** إلى **In production**
3. أو أضف المستخدمين للـ Test users

### المشكلة 3: "Error 400: invalid_request"
**السبب:** مشكلة في الـ OAuth Client ID
**الحل:**
- تأكد من أن OAuth Client ID نشط
- تأكد من أن Firebase يستخدم نفس الـ Client ID

### المشكلة 4: لا يزال لا يعمل بعد التحديثات
**الحل:**
1. انتظر 5-10 دقائق (التحديثات تأخذ وقت)
2. امسح الـ Cache والـ Cookies
3. أعد تشغيل المتصفح
4. جرب من جهاز آخر أو شبكة أخرى

---

## 📝 قائمة التحقق السريعة

- [ ] أضفت الدومين الجديد في Firebase Console > Authentication > Authorized domains
- [ ] أضفت الدومين في Google Cloud Console > OAuth JavaScript origins
- [ ] أضفت الـ Redirect URI في Google Cloud Console
- [ ] مسحت الـ Cache والـ Cookies
- [ ] انتظرت 5-10 دقائق بعد التحديثات
- [ ] جربت في وضع Incognito

---

## 🎯 مثال عملي

إذا كان الدومين الجديد: `www.example.com`

### في Firebase Console:
```
Authorized domains:
- localhost
- a-platform-for-learning.firebaseapp.com
- example.com
- www.example.com
```

### في Google Cloud Console:
```
Authorized JavaScript origins:
- https://example.com
- https://www.example.com

Authorized redirect URIs:
- https://example.com/__/auth/handler
- https://www.example.com/__/auth/handler
```

---

## 📞 إذا استمرت المشكلة

1. تحقق من Console في المتصفح (F12) لرؤية الخطأ الدقيق
2. تأكد من أن الدومين يعمل بشكل صحيح (HTTPS)
3. تأكد من أن Firebase Hosting أو الاستضافة تعمل
4. جرب تسجيل الدخول بالبريد الإلكتروني (للتأكد من أن المشكلة في Google فقط)

---

## ✅ بعد الحل

بعد تطبيق الخطوات:
1. ✅ تسجيل الدخول بـ Google يعمل على الدومين الجديد
2. ✅ تسجيل الدخول بـ Google يعمل على الدومين القديم
3. ✅ جميع المستخدمين يمكنهم تسجيل الدخول بدون مشاكل

---

**ملاحظة مهمة:** 
- لا تحذف الدومين القديم من Firebase إذا كان لا يزال هناك مستخدمون يستخدمونه
- يمكنك الاحتفاظ بكلا الدومينين في القائمة

**تم! 🎉**
