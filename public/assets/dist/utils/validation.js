export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return { isValid: false, error: 'البريد الإلكتروني مطلوب' };
    }
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'صيغة البريد الإلكتروني غير صحيحة' };
    }
    return { isValid: true };
}
export function validatePassword(password) {
    if (!password) {
        return { isValid: false, error: 'كلمة المرور مطلوبة' };
    }
    if (password.length < 8) {
        return { isValid: false, error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, error: 'كلمة المرور يجب أن تحتوي على حرف كبير' };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, error: 'كلمة المرور يجب أن تحتوي على رقم' };
    }
    return { isValid: true };
}
export function validateName(name, minLength = 2) {
    if (!name) {
        return { isValid: false, error: 'الاسم مطلوب' };
    }
    if (name.length < minLength) {
        return { isValid: false, error: `الاسم يجب أن يكون ${minLength} أحرف على الأقل` };
    }
    if (!/^[a-zA-Zأ-ي\s]+$/.test(name)) {
        return { isValid: false, error: 'الاسم يجب أن يحتوي على أحرف فقط' };
    }
    return { isValid: true };
}
export function validateURL(url) {
    try {
        new URL(url);
        return { isValid: true };
    }
    catch {
        return { isValid: false, error: 'رابط غير صحيح' };
    }
}
export function validateFileType(file, allowedTypes) {
    if (!file) {
        return { isValid: false, error: 'الملف مطلوب' };
    }
    if (!allowedTypes.includes(file.type)) {
        return { isValid: false, error: `نوع الملف غير مسموح. الأنواع المسموح بها: ${allowedTypes.join(', ')}` };
    }
    return { isValid: true };
}
export function validateFileSize(file, maxSizeInMB) {
    if (!file) {
        return { isValid: false, error: 'الملف مطلوب' };
    }
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        return { isValid: false, error: `حجم الملف يجب أن لا يتجاوز ${maxSizeInMB}MB` };
    }
    return { isValid: true };
}
export function validateNumber(num, min, max) {
    if (typeof num !== 'number' || isNaN(num)) {
        return { isValid: false, error: 'قيمة رقمية مطلوبة' };
    }
    if (min !== undefined && num < min) {
        return { isValid: false, error: `القيمة يجب أن تكون ${min} أو أكثر` };
    }
    if (max !== undefined && num > max) {
        return { isValid: false, error: `القيمة يجب أن تكون ${max} أو أقل` };
    }
    return { isValid: true };
}
export function validateStringLength(str, minLength, maxLength) {
    if (!str) {
        return { isValid: false, error: 'هذا الحقل مطلوب' };
    }
    if (str.length < minLength) {
        return { isValid: false, error: `يجب أن يكون ${minLength} أحرف على الأقل` };
    }
    if (maxLength !== undefined && str.length > maxLength) {
        return { isValid: false, error: `يجب أن لا يتجاوز ${maxLength} أحرف` };
    }
    return { isValid: true };
}
export function validateRequired(value, fieldName = 'هذا الحقل') {
    if (value === null || value === undefined || value === '') {
        return { isValid: false, error: `${fieldName} مطلوب` };
    }
    return { isValid: true };
}
export function validateMultiple(fields) {
    const results = {};
    Object.entries(fields).forEach(([fieldName, [value, validator]]) => {
        results[fieldName] = validator(value);
    });
    return results;
}
export function isAllValid(results) {
    return Object.values(results).every(result => result.isValid);
}
