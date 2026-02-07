/**
 * Application Types
 * @description Centralized type definitions for the application
 * @module types
 */

/**
 * User roles in the application
 */
export type UserRole = 'student' | 'teacher' | 'admin';

/**
 * Exam question types
 */
export type QuestionType = 'true-false' | 'multiple-choice' | 'short-answer';

/**
 * Exam types
 */
export type ExamType = 'quiz' | 'midterm' | 'final' | 'homework';

/**
 * Learning progress status
 */
export type ProgressStatus = 'not-started' | 'in-progress' | 'completed';

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast notification interface
 */
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * API Response interface
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

/**
 * Pagination interface
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: Pagination;
}

/**
 * Sort options
 */
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Filter options
 */
export interface FilterOptions {
  [key: string]: any;
}

/**
 * Query options
 */
export interface QueryOptions {
  sort?: SortOptions;
  filter?: FilterOptions;
  pagination?: Pagination;
}

/**
 * Loading state
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Data state interface
 */
export interface DataState<T> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}

/**
 * Video interface
 */
export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  thumbnail?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Material interface
 */
export interface Material {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: number;
  type: 'pdf' | 'doc' | 'image' | 'other';
  createdAt: string;
  updatedAt: string;
}

/**
 * Note interface
 */
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags?: string[];
  priority: 'low' | 'medium' | 'high';
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Achievement interface
 */
export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

/**
 * Stats interface
 */
export interface Stats {
  totalVideosWatched: number;
  totalMaterialsDownloaded: number;
  totalExamsCompleted: number;
  averageScore: number;
  totalStudyTime: number;
  lastActivityDate: string;
}

/**
 * Component props interface
 */
export interface ComponentProps {
  className?: string;
  id?: string;
  style?: Record<string, string>;
  children?: any;
}

/**
 * Modal interface
 */
export interface ModalState {
  isOpen: boolean;
  title: string;
  content: string | any;
  actions?: ModalAction[];
}

/**
 * Modal action interface
 */
export interface ModalAction {
  label: string;
  onClick: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

/**
 * Form field interface
 */
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  value: any;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validate?: (value: any) => boolean | string;
}

/**
 * Form state interface
 */
export interface FormState {
  fields: Record<string, FormField>;
  isSubmitting: boolean;
  isValid: boolean;
  errors: Record<string, string>;
}
