# 🏗️ معمارية المشروع

## نظرة عامة
منصة تعليمية حديثة مبنية بـ TypeScript + Firebase مع معمارية نظيفة وقابلة للتوسع.

## هيكل المشروع

```
public/assets/ts/
├── auth.ts                    # وحدة المصادقة
├── main.ts                    # نقطة الدخول الرئيسية
├── animations.ts              # تأثيرات الحركة
├── dashboard.ts               # لوحة التحكم
├── profile.ts                 # ملف المستخدم
├── videos.ts                  # إدارة الفيديوهات
├── exams.ts                   # إدارة الامتحانات
├── notes.ts                   # إدارة الملاحظات
├── firebase-config.ts         # إعدادات Firebase
├── constants.ts               # الثوابت العامة
│
├── services/                  # طبقة الخدمات
│   ├── index.ts
│   └── firebase-service.ts    # خدمة Firebase المركزية
│
├── components/                # مكونات قابلة لإعادة الاستخدام
│   ├── index.ts
│   ├── modal.ts               # نافذة منبثقة
│   ├── toast.ts               # إشعارات
│   └── form-builder.ts        # بناء النماذج
│
├── utils/                     # دوال مساعدة
│   ├── index.ts
│   ├── error-handler.ts       # معالجة الأخطاء
│   ├── dom-utils.ts           # عمليات DOM
│   ├── validation.ts          # التحقق من الصحة
│   └── common.ts              # دوال عامة
│
└── types/                     # تعريفات TypeScript
    └── index.ts               # جميع الـ interfaces والـ types
```

## طبقات المعمارية

### 1. Presentation Layer (UI)
- HTML pages (`public/pages/`)
- CSS styles (`public/assets/scss/`)
- TypeScript UI logic

### 2. Business Logic Layer
```
services/           # خدمات البيزنس
├── firebase-service.ts    # إدارة Firebase
└── [future services]      # خدمات أخرى
```

### 3. Data Layer
- Firebase Firestore (Database)
- Firebase Auth (Authentication)
- Firebase Storage (File Storage)

### 4. Utilities Layer
```
utils/              # أدوات وم مساعدات
├── error-handler.ts       # معالجة مركزية للأخطاء
├── dom-utils.ts          # عمليات DOM آمنة
├── validation.ts         # التحقق من البيانات
└── common.ts             # دوال عامة مفيدة
```

## مبادئ التصميم

### 1. Single Responsibility Principle
كل ملف/class مسؤول عن شيء واحد فقط:
```typescript
// ❌ خطأ: مسؤوليات متعددة
class UserManager {
  loginUser() { /* ... */ }
  saveToDatabase() { /* ... */ }
  sendEmail() { /* ... */ }
}

// ✅ صحيح: مسؤولية واحدة
class AuthService {
  loginUser() { /* ... */ }
}
```

### 2. Dependency Injection
```typescript
// ❌ خطأ: اعتماد مباشر
class UserProfile {
  private firebase = new FirebaseService();
}

// ✅ صحيح: injection عن طريق constructor
class UserProfile {
  constructor(private firebase: FirebaseService) {}
}
```

### 3. Error Handling
```typescript
// استخدام ErrorHandler المركزي
try {
  await firebaseService.getUserProfile(uid);
} catch (error) {
  ErrorHandler.handle(error, 'getUserProfile');
  toastManager.error('فشل تحميل الملف');
}
```

### 4. Type Safety
```typescript
// استخدام types قوية
interface User {
  uid: string;
  email: string;
  role: 'student' | 'teacher';
}

async function getUser(uid: string): Promise<User | null> {
  // ... implementation
}
```

## Data Flow

```
┌─────────────────────────────────────┐
│       User Interaction (UI)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Components & Event Listeners      │
│   (Modal, Toast, FormBuilder)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Business Logic (Services)        │
│    (FirebaseService)                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Utilities (Validation, DOM)      │
│    & Error Handling                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Firebase Backend               │
│  (Firestore, Auth, Storage)         │
└─────────────────────────────────────┘
```

## استخدام Services

```typescript
import { firebaseService } from '@services';
import { toastManager } from '@components';
import { ErrorHandler } from '@utils';

// الحصول على بيانات المستخدم
const user = await firebaseService.getUserProfile(userId);

// إنشاء مستخدم جديد
await firebaseService.createUserProfile(uid, {
  name: 'أحمد',
  email: 'ahmed@example.com',
  role: 'student'
});

// معالجة الأخطاء
ErrorHandler.log('Operation successful');
ErrorHandler.warn('Deprecation warning');
ErrorHandler.error('Critical error');

// إظهار إشعارات
toastManager.success('تم الحفظ بنجاح');
toastManager.error('حدث خطأ');
toastManager.info('معلومة');
toastManager.warning('تحذير');
```

## استخدام Components

### Modal
```typescript
import { Modal } from '@components';

const modal = new Modal({
  title: 'تأكيد الحذف',
  content: 'هل تريد حذف هذا العنصر؟',
  actions: [
    {
      label: 'نعم',
      onClick: async () => {
        await deleteItem();
      },
      variant: 'danger'
    },
    {
      label: 'لا',
      onClick: () => modal.close(),
      variant: 'secondary'
    }
  ]
});

modal.open();
```

### FormBuilder
```typescript
import { FormBuilder } from '@components';

const form = new FormBuilder({
  onSubmit: async (data) => {
    console.log('Form data:', data);
  }
});

form
  .addField({
    name: 'email',
    label: 'البريد الإلكتروني',
    type: 'email',
    required: true,
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

## Best Practices

### 1. Configuration
- جميع الإعدادات في `constants.ts`
- متغيرات البيئة في `.env`
- تجنب hardcoding القيم

### 2. Error Handling
- استخدم `ErrorHandler` دائماً
- قدم رسائل خطأ واضحة للمستخدم
- log الأخطاء للتحليل

### 3. Type Safety
- استخدم `tsconfig.json` الصارم
- عرّف `interfaces` لجميع البيانات
- تجنب `any` type

### 4. Code Organization
- ملف واحد = مسؤولية واحدة
- استخدم `index.ts` للتصدير
- Path aliases لـ imports نظيفة

### 5. Comments & Documentation
- JSDoc لكل function
- شرح المنطق المعقد
- أمثلة للاستخدام

## الملفات الهامة

| الملف | الهدف |
|------|------|
| `firebase-config.ts` | إعدادات Firebase من environment variables |
| `constants.ts` | جميع الثوابت والـ URLs |
| `services/firebase-service.ts` | الواجهة الموحدة للـ Firebase |
| `utils/error-handler.ts` | معالجة مركزية للأخطاء |
| `components/modal.ts` | نافذة منبثقة accessible |
| `components/toast.ts` | نظام إشعارات |
| `components/form-builder.ts` | بناء نماذج متقدمة |

## الخطوات التالية

- [ ] إضافة state management (Redux/Zustand)
- [ ] إنشاء reusable UI components library
- [ ] إضافة comprehensive testing suite
- [ ] تحسين الأداء مع code splitting
- [ ] إضافة monitoring و analytics
- [ ] إنشاء API wrapper service
- [ ] إضافة offline support
- [ ] تحسين SEO و accessibility
