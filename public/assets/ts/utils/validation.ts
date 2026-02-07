/**
 * Validation Utilities
 * @description Form validation and data validation utilities
 * @module utils/validation
 */

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {ValidationResult} Validation result
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, error: 'البريد الإلكتروني مطلوب' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'صيغة البريد الإلكتروني غير صحيحة' };
  }
  return { isValid: true };
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {ValidationResult} Validation result
 */
export function validatePassword(password: string): ValidationResult {
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

/**
 * Validate name
 * @param {string} name - Name to validate
 * @param {number} [minLength=2] - Minimum length
 * @returns {ValidationResult} Validation result
 */
export function validateName(name: string, minLength: number = 2): ValidationResult {
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

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {ValidationResult} Validation result
 */
export function validateURL(url: string): ValidationResult {
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'رابط غير صحيح' };
  }
}

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {ValidationResult} Validation result
 */
export function validateFileType(file: File, allowedTypes: string[]): ValidationResult {
  if (!file) {
    return { isValid: false, error: 'الملف مطلوب' };
  }
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `نوع الملف غير مسموح. الأنواع المسموح بها: ${allowedTypes.join(', ')}` };
  }
  return { isValid: true };
}

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeInMB - Maximum size in MB
 * @returns {ValidationResult} Validation result
 */
export function validateFileSize(file: File, maxSizeInMB: number): ValidationResult {
  if (!file) {
    return { isValid: false, error: 'الملف مطلوب' };
  }
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return { isValid: false, error: `حجم الملف يجب أن لا يتجاوز ${maxSizeInMB}MB` };
  }
  return { isValid: true };
}

/**
 * Validate number
 * @param {number} num - Number to validate
 * @param {number} [min] - Minimum value
 * @param {number} [max] - Maximum value
 * @returns {ValidationResult} Validation result
 */
export function validateNumber(num: number, min?: number, max?: number): ValidationResult {
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

/**
 * Validate string length
 * @param {string} str - String to validate
 * @param {number} minLength - Minimum length
 * @param {number} [maxLength] - Maximum length
 * @returns {ValidationResult} Validation result
 */
export function validateStringLength(
  str: string,
  minLength: number,
  maxLength?: number
): ValidationResult {
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

/**
 * Validate required field
 * @param {any} value - Value to check
 * @param {string} [fieldName] - Field name for error message
 * @returns {ValidationResult} Validation result
 */
export function validateRequired(value: any, fieldName: string = 'هذا الحقل'): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} مطلوب` };
  }
  return { isValid: true };
}

/**
 * Validate multiple fields
 * @param {Record<string, [any, (val: any) => ValidationResult]>} fields - Fields to validate
 * @returns {Record<string, ValidationResult>} Validation results
 */
export function validateMultiple(
  fields: Record<string, [any, (val: any) => ValidationResult]>
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};
  Object.entries(fields).forEach(([fieldName, [value, validator]]) => {
    results[fieldName] = validator(value);
  });
  return results;
}

/**
 * Check if all validations passed
 * @param {Record<string, ValidationResult>} results - Validation results
 * @returns {boolean} Whether all validations passed
 */
export function isAllValid(results: Record<string, ValidationResult>): boolean {
  return Object.values(results).every(result => result.isValid);
}
