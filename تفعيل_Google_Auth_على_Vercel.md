# 🚀 تفعيل Google Sign-In على Vercel

## 📋 معلومات مهمة

عند رفع الموقع على Vercel، يكون الدومين عادة:
- `your-project.vercel.app` (الدومين الافتراضي)
- أو دومين مخصص إذا أضفته

---

## 🎯 الخطوات المطلوبة

### 1️⃣ معرفة الدومين الخاص بك على Vercel

#### الطريقة الأولى:
1. اذهب إلى: https://vercel.com/dashboard
2. اختر مشروعك
3. ستجد الدومين في الأعلى، مثلاً:
   - `my-platform.vercel.app`
   - أو الدومين المخصص

#### الطريقة الثانية:
افتح الموقع وانظر للـ URL في المتصفح

---

### 2️⃣ إضافة الدومين في Firebase Console

1. اذهب إلى: https://console.firebase.google.com/
2. اختر مشروع **a-platform-for-learning**
3. **Authentication** > **Settings** > **Authorized domains**
4. اضغط **Add domain**
5. أضف الدومين من Vercel (بدون https://)

#### مثال:
```
my-platform.vercel.app
```

#### إذا كان عندك دومين مخصص:
```
example.com
www.example.com
```

---

### 3️⃣ إضافة الدومين في Google Cloud Console

1. اذهب إلى: https://console.cloud.google.com/
2. اختر المشروع
3. **APIs & Services** > **Credentials**
4. اضغط على **OAuth 2.0 Client ID**

#### في Authorized JavaScript origins:
اضغط **+ ADD URI** وأضف:

**للدومين الافتراضي من Vercel:**
```
https://my-platform.vercel.app
```

**إذا كان عندك دومين مخصص:**
```
https://example.com
https://www.example.com
```

#### في Authorized redirect URIs:
اضغط **+ ADD URI** وأضف:

**للدومين الافتراضي من Vercel:**
```
https://my-platform.vercel.app/__/auth/handler
```

**إذا كان عندك دومين مخصص:**
```
https://example.com/__/auth/handler
https://www.example.com/__/auth/handler
```

⚠️ **مهم:** لا تنسى `/__/auth/handler` في النهاية!

5. اضغط **SAVE**

---

### 4️⃣ التحقق من إعدادات Vercel

#### تأكد من أن الموقع يعمل بـ HTTPS:
- Vercel يوفر HTTPS تلقائياً ✅
- لا تحتاج لإعدادات إضافية

#### إذا كان عندك دومين مخصص:
1. في Vercel Dashboard
2. اذهب لـ **Settings** > **Domains**
3. تأكد من أن الدومين مضاف ويعمل

---

### 5️⃣ اختبار على Vercel

#### الطريقة الأولى (اختبار سريع):
1. افتح موقعك على Vercel: `https://your-project.vercel.app`
2. اذهب لصفحة تسجيل الدخول
3. اضغط "تسجيل الدخول بـ Google"
4. يجب أن يعمل! ✅

#### الطريقة الثانية (اختبار متقدم):
1. ارفع ملف `test-google-auth.html` على Vercel
2. افتحه: `https://your-project.vercel.app/test-google-auth.html`
3. اضغط "اختبار تسجيل الدخول"
4. سيعطيك تشخيص دقيق

---

## 📝 مثال كامل

لنفترض أن دومين Vercel الخاص بك هو: `learning-platform.vercel.app`

### في Firebase Console:
```
Authorized domains:
✅ localhost
✅ 127.0.0.1
✅ a-platform-for-learning.firebaseapp.com
✅ learning-platform.vercel.app
```

### في Google Cloud Console:
```
Authorized JavaScript origins:
✅ http://localhost
✅ https://learning-platform.vercel.app

Authorized redirect URIs:
✅ https://learning-platform.vercel.app/__/auth/handler
```

---

## 🔄 إذا غيرت الدومين على Vercel

إذا غيرت اسم المشروع أو أضفت دومين مخصص:

1. أضف الدومين الجديد في Firebase Console
2. أضف الدومين الجديد في Google Cloud Console
3. **لا تحذف** الدومين القديم (قد يكون هناك مستخدمون يستخدمونه)
4. انتظر 5-10 دقائق
5. امسح الـ Cache

---

## 🐛 حل المشاكل الشائعة على Vercel

### المشكلة 1: "redirect_uri_mismatch"
**السبب:** لم تضف الـ Redirect URI بشكل صحيح
**الحل:** 
- تأكد من إضافة `https://your-domain.vercel.app/__/auth/handler`
- تأكد من عدم وجود مسافات أو أخطاء

### المشكلة 2: "unauthorized-domain"
**السبب:** لم تضف الدومين في Firebase
**الحل:** أضف `your-domain.vercel.app` في Firebase Console

### المشكلة 3: يعمل على localhost لكن لا يعمل على Vercel
**السبب:** لم تضف دومين Vercel في الإعدادات
**الحل:** اتبع الخطوات أعلاه

### المشكلة 4: "This app is blocked"
**السبب:** OAuth consent screen في وضع Testing
**الحل:**
1. Google Cloud Console > OAuth consent screen
2. غيّر من Testing إلى In production

---

## ⚡ نصائح لـ Vercel

### 1. Environment Variables (اختياري):
إذا أردت استخدام Environment Variables للـ Firebase Config:

في Vercel Dashboard:
1. **Settings** > **Environment Variables**
2. أضف:
   ```
   FIREBASE_API_KEY=AIzaSyAU0CCiQNrPEYpTNU4rAwmOmPUZnjb2FoU
   FIREBASE_AUTH_DOMAIN=a-platform-for-learning.firebaseapp.com
   FIREBASE_PROJECT_ID=a-platform-for-learning
   ```

### 2. Automatic Deployments:
- كل push لـ GitHub يرفع تلقائياً على Vercel
- كل branch له preview URL خاص
- أضف preview URLs في Firebase إذا احتجتها

### 3. Custom Domain:
إذا أضفت دومين مخصص على Vercel:
1. أضفه في Firebase Console
2. أضفه في Google Cloud Console
3. تأكد من أن DNS settings صحيحة

---

## 📋 قائمة التحقق السريعة

- [ ] عرفت دومين Vercel الخاص بي
- [ ] أضفت الدومين في Firebase Console (Authorized domains)
- [ ] أضفت الدومين في Google Cloud Console (JavaScript origins)
- [ ] أضفت الـ Redirect URI في Google Cloud Console
- [ ] الموقع يعمل على Vercel بـ HTTPS
- [ ] انتظرت 5-10 دقائق بعد التحديثات
- [ ] مسحت الـ Cache أو جربت في Incognito
- [ ] اختبرت تسجيل الدخول بـ Google

---

## 🎯 الخطوة التالية

1. **اعرف دومين Vercel الخاص بك**
   - اذهب لـ Vercel Dashboard
   - انسخ الدومين (مثلاً: `my-platform.vercel.app`)

2. **أضفه في Firebase و Google Cloud Console**
   - اتبع الخطوات أعلاه

3. **اختبر**
   - افتح الموقع على Vercel
   - جرب تسجيل الدخول بـ Google

---

## 📞 هل تحتاج مساعدة؟

أخبرني:
1. ما هو دومين Vercel الخاص بك؟
2. هل أضفته في Firebase و Google Cloud Console؟
3. ما هو الخطأ الذي يظهر (إن وجد)؟

---

**ملاحظة:** Vercel رائع للاستضافة! HTTPS تلقائي، سريع، ومجاني. فقط أضف الدومين في Firebase و Google Cloud Console وكل شيء سيعمل! 🚀

**حظاً موفقاً! 💪**
