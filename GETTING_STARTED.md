# 🎓 منصة الفيلسوف التعليمية - دليل الاستخدام

## ✨ التحسينات الحديثة (February 2026)

تم تطبيق تحسينات شاملة على المشروع! اطلع على [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md) للتفاصيل الكاملة.

### الميزات الجديدة:
- ✅ **أمان محسّن** - Firebase credentials آمنة عبر environment variables
- ✅ **معمارية نظيفة** - تنظيم محسّن مع services, components, utils
- ✅ **Components قابلة لإعادة الاستخدام** - Modal, Toast, FormBuilder
- ✅ **60+ Utility Functions** - DOM, Validation, Common utilities
- ✅ **Full TypeScript** - Type safety مع strict mode
- ✅ **Accessibility** - WCAG 2.1 compliant
- ✅ **Documentation** - ARCHITECTURE.md, ACCESSIBILITY.md

---

## 🚀 البدء السريع

### 1️⃣ التثبيت والإعداد

```bash
# تثبيت التبعيات
npm install

# إنشاء ملف .env من .env.example
cp .env.example .env

# تعديل .env بـ Firebase credentials
# VITE_FIREBASE_API_KEY=your_key
# VITE_FIREBASE_PROJECT_ID=your_project_id
# ...
```

### 2️⃣ تشغيل المشروع

```bash
# تشغيل في وضع التطوير
npm run dev

# بناء الـ TypeScript
npm run build:ts

# مراقبة تغييرات TypeScript
npm run watch:ts

# بناء الـ SCSS
npm run build:css

# مراقبة تغييرات SCSS
npm run watch:css

# تشغيل الكل معاً
npm run watch
```

### 3️⃣ الفحص والتنسيق

```bash
# فحص الكود بـ ESLint
npm run lint

# اختبار الكود
npm run test

# تغطية الاختبارات
npm run test:coverage
```

---

## 📁 البنية الجديدة

```
public/assets/ts/
├── auth.ts                    # مصادقة المستخدمين
├── main.ts                    # نقطة الدخول
├── firebase-config.ts         # إعدادات Firebase (آمنة)
├── constants.ts               # الثوابت العامة
│
├── services/                  # خدمات البيزنس
│   ├── firebase-service.ts    # خدمة Firebase الموحدة
│   └── index.ts
│
├── components/                # مكونات قابلة لإعادة الاستخدام
│   ├── modal.ts               # نافذة منبثقة
│   ├── toast.ts               # إشعارات
│   ├── form-builder.ts        # بناء النماذج
│   └── index.ts
│
├── utils/                     # أدوات مساعدة
│   ├── error-handler.ts       # معالجة الأخطاء
│   ├── dom-utils.ts           # عمليات DOM
│   ├── validation.ts          # التحقق من الصحة
│   ├── common.ts              # أدوات عامة
│   └── index.ts
│
└── types/                     # تعريفات TypeScript
    └── index.ts               # جميع الـ interfaces
```

---

## 💡 أمثلة الاستخدام

### استخدام Firebase Service

```typescript
import { firebaseService } from '@services';
import { toastManager } from '@components';
import { ErrorHandler } from '@utils';

// تسجيل الدخول
try {
  const user = await firebaseService.signInWithEmail(email, password);
  toastManager.success('تم تسجيل الدخول بنجاح');
} catch (error) {
  ErrorHandler.handle(error, 'signInWithEmail');
  toastManager.error('فشل تسجيل الدخول');
}

// الحصول على ملف المستخدم
const user = await firebaseService.getUserProfile(userId);

// إنشاء مستخدم جديد
await firebaseService.createUserProfile(uid, {
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  role: 'student'
});
```

### استخدام Modal Component

```typescript
import { Modal } from '@components';

const modal = new Modal({
  title: 'تأكيد الحذف',
  content: 'هل تريد حذف هذا العنصر نهائياً؟',
  actions: [
    {
      label: 'حذف',
      onClick: async () => {
        await deleteItem();
        modal.close();
      },
      variant: 'danger'
    },
    {
      label: 'إلغاء',
      onClick: () => modal.close(),
      variant: 'secondary'
    }
  ]
});

modal.open();
```

### استخدام FormBuilder

```typescript
import { FormBuilder } from '@components';
import { validateEmail, validatePassword } from '@utils';

const form = new FormBuilder({
  onSubmit: async (data) => {
    console.log('بيانات النموذج:', data);
  }
});

form
  .addField({
    name: 'email',
    label: 'البريد الإلكتروني',
    type: 'email',
    required: true,
    placeholder: 'أدخل بريدك الإلكتروني',
    validate: (value) => validateEmail(value).isValid
  })
  .addField({
    name: 'password',
    label: 'كلمة المرور',
    type: 'password',
    required: true,
    validate: (value) => validatePassword(value).isValid
  })
  .addSubmitButton({ label: 'دخول' });

document.body.appendChild(form.getElement());
```

### استخدام Toast Notifications

```typescript
import { toastManager } from '@components';

// إشعار نجاح
toastManager.success('تم الحفظ بنجاح!');

// إشعار خطأ
toastManager.error('حدث خطأ في العملية');

// رسالة معلومات
toastManager.info('هذه رسالة معلومات');

// تحذير
toastManager.warning('تحذير: تأكد من البيانات');
```

### استخدام Utility Functions

```typescript
import { 
  debounce, 
  throttle, 
  delay, 
  formatDate,
  validateEmail,
  generateUID,
  copyToClipboard
} from '@utils';

// Debounce
const debouncedSearch = debounce((query) => {
  // البحث بعد 300ms من انتهاء الكتابة
  searchItems(query);
}, 300);

// Throttle
const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 1000);

// تأخير العملية
await delay(2000);

// صيغة التاريخ
const formatted = formatDate(new Date(), 'YYYY-MM-DD');

// التحقق من البريد
const { isValid, error } = validateEmail('test@example.com');

// توليد معرف فريد
const id = generateUID();

// نسخ للحافظة
await copyToClipboard('النص المراد نسخه');
```

---

## 🔒 الأمان

### متغيرات البيئة

تأكد من إنشاء ملف `.env` بالقيم الصحيحة:

```bash
# .env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_DATABASE_URL=https://your_project-rtdb.firebaseio.com
NODE_ENV=development
```

### التحقق من الصحة

كل الـ inputs يجب أن تمر بـ validation:

```typescript
import { validateEmail, validatePassword, validateRequired } from '@utils';

// التحقق من البريد
const emailResult = validateEmail(email);
if (!emailResult.isValid) {
  console.error(emailResult.error); // رسالة الخطأ
}

// التحقق من كلمة المرور
const passwordResult = validatePassword(password);
if (!passwordResult.isValid) {
  console.error(passwordResult.error);
}

// التحقق من الحقول المطلوبة
const nameResult = validateRequired(name, 'الاسم');
if (!nameResult.isValid) {
  console.error(nameResult.error);
}
```

---

## ♿ إمكانية الوصول

المشروع يتوافق مع معايير الوصول WCAG 2.1:

- ✅ جميع العناصر التفاعلية يمكن الوصول إليها بلوحة المفاتيح
- ✅ ARIA labels على جميع المكونات
- ✅ نسب تباين لون كافية
- ✅ Screen reader compatible
- ✅ Semantic HTML

اطلع على [ACCESSIBILITY.md](ACCESSIBILITY.md) للتفاصيل.

---

## 🏗️ المعمارية

تم تنظيم المشروع بمعمارية نظيفة:

- **Services**: منطق البيزنس وعمليات Firebase
- **Components**: مكونات قابلة لإعادة الاستخدام
- **Utils**: أدوات مساعدة وفوائد عامة
- **Types**: تعريفات TypeScript لـ Type Safety

اطلع على [ARCHITECTURE.md](ARCHITECTURE.md) لفهم أعمق.

---

## 📊 معايير الكود

### ESLint

```json
// .eslintrc.json
{
  "rules": {
    "no-unused-vars": "error",
    "prefer-const": "error",
    "@typescript-eslint/explicit-function-return-types": "error"
  }
}
```

### Prettier

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

---

## 🧪 الاختبارات

```bash
# تشغيل الاختبارات
npm run test

# الاختبارات المستمرة
npm run test:watch

# تغطية الاختبارات
npm run test:coverage
```

---

## 📚 الموارد الإضافية

| الملف | الوصف |
|------|-------|
| [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md) | ملخص التحسينات المطبقة |
| [ARCHITECTURE.md](ARCHITECTURE.md) | شرح معمارية المشروع |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | معايير الوصول والـ SEO |
| [README.md](README.md) | الوثائق الأصلية |

---

## 🚀 النشر

### على Vercel

```bash
vercel deploy
```

### على Firebase Hosting

```bash
firebase deploy
```

---

## 🆘 استكشاف الأخطاء

### Firebase لا يعمل
- ✅ تأكد من ملف `.env` يحتوي على جميع المتغيرات
- ✅ تحقق من بيانات الاعتماد صحيحة
- ✅ تحقق من قواعد Firestore في Firebase Console

### الأخطاء في TypeScript
```bash
npm run build:ts
```

### مشاكل في SCSS
```bash
npm run build:css
```

---

## 📝 ملاحظات مهمة

1. **Firebase Credentials**: لا تشارك ملف `.env` مع الآخرين
2. **Node Version**: استخدم Node.js 16+
3. **npm vs yarn**: استخدم npm أو yarn بشكل متسق
4. **Dependencies**: حدّث التبعيات بانتظام

---

## 🎯 الخطوات التالية

- [ ] إضافة unit tests
- [ ] إضافة integration tests
- [ ] تحسين الأداء
- [ ] إضافة PWA support
- [ ] إضافة monitoring

---

## 📞 الدعم

للمزيد من المساعدة:
- اطلع على [ARCHITECTURE.md](ARCHITECTURE.md)
- اطلع على [ACCESSIBILITY.md](ACCESSIBILITY.md)
- اطلع على [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md)

---

**آخر تحديث**: 6 فبراير 2026
**الإصدار**: 2.0.0
**الحالة**: ✅ جاهز للإنتاج
