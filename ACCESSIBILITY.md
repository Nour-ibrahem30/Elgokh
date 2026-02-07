# 📋 دليل إمكانية الوصول والـ SEO

## نظرة عامة
تم بناء المنصة مع مراعاة كاملة لمعايير الوصول (WCAG 2.1) وتحسين محركات البحث (SEO).

## ♿ معايير الوصول (Accessibility)

### 1. الـ ARIA Labels و Attributes
```html
<!-- Navigation Toggle -->
<button aria-label="فتح القائمة" aria-expanded="false" aria-controls="navbar-menu">
  ☰
</button>

<!-- Modal Dialog -->
<div role="dialog" aria-labelledby="modal-title" aria-modal="true">
  <h2 id="modal-title">عنوان النافذة</h2>
</div>

<!-- Alert Message -->
<div role="alert" aria-live="polite" aria-atomic="true">
  رسالة الإشعار
</div>
```

### 2. Keyboard Navigation
- **Tab**: التنقل بين العناصر
- **Shift+Tab**: التنقل العكسي
- **Enter**: تفعيل الأزرار والروابط
- **Space**: تفعيل الأزرار والمربعات
- **Escape**: إغلاق النوافذ المنبثقة والقوائم

### 3. Form Accessibility
```typescript
// استخدام FormBuilder يضمن الوصول التام
const form = new FormBuilder({ id: 'contact-form' });
form
  .addField({
    name: 'email',
    label: 'البريد الإلكتروني',
    type: 'email',
    required: true,
    placeholder: 'أدخل بريدك الإلكتروني'
  })
  .addSubmitButton({ label: 'إرسال' });
```

### 4. Color Contrast
- النص الأساسي: نسبة تباين 4.5:1 على الأقل
- النص الكبير: نسبة تباين 3:1 على الأقل
- الحدود والمؤشرات: نسبة تباين 3:1 على الأقل

### 5. Focus Management
```typescript
// الـ Modal يتولى إدارة التركيز تلقائياً
const modal = new Modal({ title: 'نموذج مهم' });
modal.open(); // يركز على زر الإغلاق تلقائياً
```

### 6. Semantic HTML
```html
<!-- استخدام العناصر الدلالية الصحيحة -->
<nav> <!-- للتنقل -->
<main> <!-- للمحتوى الرئيسي -->
<article> <!-- للمقالات -->
<section> <!-- للأقسام -->
<aside> <!-- للمحتوى الجانبي -->
<header> <!-- رأس الصفحة -->
<footer> <!-- تذييل الصفحة -->
```

### 7. Image Accessibility
```html
<!-- استخدام alt text الوصفي -->
<img src="lesson.jpg" alt="شرح مفصل للدرس الأول في الرياضيات">
```

## 🔍 تحسين محركات البحث (SEO)

### 1. Meta Tags
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="منصة تعليمية متكاملة...">
<meta name="keywords" content="تعليم، دروس، فيديوهات">
<meta name="author" content="الأستاذ محمد ناصر">

<!-- Open Graph -->
<meta property="og:title" content="منصة الفيلسوف التعليمية">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

### 2. Structured Data (Schema.org)
```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "منصة الفيلسوف التعليمية",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "description": "منصة تعليمية...",
  "offers": {
    "@type": "Course",
    "name": "دروس الفلسفة",
    "url": "https://example.com/lessons"
  }
}
```

### 3. Page Titles و Descriptions
```typescript
// تحديث الـ title و description لكل صفحة
document.title = 'الدروس - منصة الفيلسوف';
document.querySelector('meta[name="description"]')
  ?.setAttribute('content', 'مكتبة دروس الفلسفة...');
```

### 4. URL Structure
- استخدام URLs واضحة: `/lessons/philosophy-101`
- تجنب معرفات عشوائية
- استخدام hyphens بدلاً من underscores

### 5. Mobile Responsiveness
- تصميم متجاوب على جميع الأحجام
- استخدام viewport meta tag
- اختبار على أجهزة فعلية

### 6. Performance
- تحميل الصور المحسنة
- ضغط الملفات
- استخدام CDN
- Caching الصحيح

## 🧪 أدوات الاختبار

### Accessibility Testing
```bash
# استخدام أدوات الفحص
- Axe DevTools
- WAVE
- Lighthouse
- NVDA Screen Reader (Windows)
- JAWS Screen Reader
```

### SEO Testing
```bash
# فحص الـ SEO
- Google Search Console
- Bing Webmaster Tools
- Lighthouse SEO Audit
- GTmetrix
```

## 📋 Checklist

- [ ] جميع الصور لها alt text
- [ ] جميع النماذج لها labels مرتبطة
- [ ] نسب التباين كافية
- [ ] التنقل بالـ Keyboard يعمل
- [ ] الألوان ليست الطريقة الوحيدة لنقل المعلومات
- [ ] Meta tags موجودة
- [ ] Structured data موجودة
- [ ] Mobile responsive
- [ ] Fast loading time
- [ ] No broken links

## 📚 مراجع إضافية

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google SEO Starter Guide](https://developers.google.com/search/docs)
- [Web.dev Accessibility](https://web.dev/accessibility/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
