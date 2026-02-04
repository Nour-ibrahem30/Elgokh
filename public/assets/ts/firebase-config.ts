// Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAU0CCiQNrPEYpTNU4rAwmOmPUZnjb2FoU",
  authDomain: "a-platform-for-learning.firebaseapp.com",
  projectId: "a-platform-for-learning",
  storageBucket: "a-platform-for-learning.firebasestorage.app",
  messagingSenderId: "764579707883",
  appId: "1:764579707883:web:5456e2348354cc58fab7ae",
  measurementId: "G-4P972FP416",
  databaseURL: "https://a-platform-for-learning-default-rtdb.firebaseio.com"
};

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
