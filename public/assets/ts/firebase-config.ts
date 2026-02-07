// Firebase Configuration Interface
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  databaseURL: string;
}

/**
 * Load Firebase configuration from environment variables
 * Ensures sensitive data is not hardcoded in the application
 * @throws Error if required environment variables are missing
 */
function getFirebaseConfig(): FirebaseConfig {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_DATABASE_URL'
  ];

  // Access import.meta.env with proper typing
  // @ts-ignore - import.meta.env is available at runtime in Vite
  const env = (import.meta.env as Record<string, any>);
  
  const missingVars = requiredVars.filter(varName => !env[varName]);

  if (missingVars.length > 0) {
    console.error(
      'Missing required Firebase environment variables:',
      missingVars.join(', ')
    );
    throw new Error(
      'Missing Firebase configuration. Please check your .env file and ensure all required variables are set.'
    );
  }
  
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.VITE_FIREBASE_APP_ID || '',
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || '',
    databaseURL: env.VITE_FIREBASE_DATABASE_URL || ''
  };
}

export const firebaseConfig: FirebaseConfig = getFirebaseConfig();

// Types
export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  createdAt: string;
  updatedAt?: string;
  photoURL?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  notes?: string;
  duration?: number;
  createdBy: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  type: 'true-false' | 'multiple-choice' | 'mixed';
  questions: Question[];
  duration: number; // in minutes
  startTime: string;
  endTime: string;
  createdBy: string;
  createdAt: string;
}

export interface Question {
  id: string;
  type: 'true-false' | 'multiple-choice';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: number | boolean; // index for multiple choice, boolean for true/false
  points: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  answers: (number | boolean)[];
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface Note {
  id: string;
  userId: string;
  courseId: string;
  content: string;
  priority?: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Progress {
  studentId: string;
  courseId: string;
  lessonsCompleted: string[];
  examsCompleted: string[];
  lastAccessed: string;
}

export interface TodoItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt?: string;
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  grade: '1' | '2' | '3'; // Grade level
  fileUrl: string;
  fileSize?: string;
  fileName?: string;
  createdBy: string;
  createdAt: string;
}
