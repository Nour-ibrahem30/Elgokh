export declare const firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
    databaseURL: string;
};
export interface User {
    uid: string;
    name: string;
    email: string;
    role: 'student' | 'teacher';
    createdAt: string;
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
    duration: number;
    startTime: string;
    endTime: string;
    createdBy: string;
    createdAt: string;
}
export interface Question {
    id: string;
    type: 'true-false' | 'multiple-choice';
    question: string;
    options?: string[];
    correctAnswer: number | boolean;
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
}
//# sourceMappingURL=firebase-config.d.ts.map