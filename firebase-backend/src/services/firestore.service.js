/**
 * Firestore Service
 * Handles all Firestore database operations
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { firestore } from '../config/firebase.js';

// ==================== USER OPERATIONS ====================

/**
 * Create user profile in Firestore
 * @param {Object} userData - User data
 * @returns {Promise<void>}
 */
export async function createUserProfile(userData) {
  try {
    const userRef = doc(firestore, 'users', userData.uid);
    
    // Check if user already exists
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      console.log('ℹ️ User profile already exists');
      return;
    }

    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp()
    });

    console.log(`✅ User profile created: ${userData.email}`);
  } catch (error) {
    console.error('❌ Error creating user profile:', error.message);
    throw error;
  }
}

/**
 * Get user profile by UID
 * @param {string} uid - User ID
 * @returns {Promise<Object>} User data
 */
export async function getUserProfile(uid) {
  try {
    const userRef = doc(firestore, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    return { id: userSnap.id, ...userSnap.data() };
  } catch (error) {
    console.error('❌ Error getting user profile:', error.message);
    throw error;
  }
}

// ==================== COURSE OPERATIONS ====================

/**
 * Create a new course (Teacher only)
 * @param {Object} courseData - Course information
 * @returns {Promise<string>} Course ID
 */
export async function createCourse(courseData) {
  try {
    const courseRef = await addDoc(collection(firestore, 'courses'), {
      title: courseData.title,
      description: courseData.description,
      instructorId: courseData.instructorId,
      thumbnailUrl: courseData.thumbnailUrl || '',
      createdAt: serverTimestamp()
    });

    console.log(`✅ Course created: ${courseData.title}`);
    return courseRef.id;
  } catch (error) {
    console.error('❌ Error creating course:', error.message);
    throw error;
  }
}

/**
 * Get all courses
 * @returns {Promise<Array>} List of courses
 */
export async function getAllCourses() {
  try {
    const coursesRef = collection(firestore, 'courses');
    const q = query(coursesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const courses = [];
    snapshot.forEach(doc => {
      courses.push({ id: doc.id, ...doc.data() });
    });

    return courses;
  } catch (error) {
    console.error('❌ Error getting courses:', error.message);
    throw error;
  }
}

/**
 * Get courses by instructor
 * @param {string} instructorId - Teacher UID
 * @returns {Promise<Array>} List of courses
 */
export async function getCoursesByInstructor(instructorId) {
  try {
    const coursesRef = collection(firestore, 'courses');
    const q = query(coursesRef, where('instructorId', '==', instructorId));
    const snapshot = await getDocs(q);

    const courses = [];
    snapshot.forEach(doc => {
      courses.push({ id: doc.id, ...doc.data() });
    });

    return courses;
  } catch (error) {
    console.error('❌ Error getting instructor courses:', error.message);
    throw error;
  }
}

// ==================== LESSON OPERATIONS ====================

/**
 * Create a new lesson (Teacher only)
 * @param {Object} lessonData - Lesson information
 * @returns {Promise<string>} Lesson ID
 */
export async function createLesson(lessonData) {
  try {
    const lessonRef = await addDoc(collection(firestore, 'lessons'), {
      courseId: lessonData.courseId,
      title: lessonData.title,
      videoUrl: lessonData.videoUrl, // External link
      notes: lessonData.notes || '',
      createdBy: lessonData.createdBy,
      createdAt: serverTimestamp()
    });

    console.log(`✅ Lesson created: ${lessonData.title}`);
    return lessonRef.id;
  } catch (error) {
    console.error('❌ Error creating lesson:', error.message);
    throw error;
  }
}

/**
 * Get lessons by course
 * @param {string} courseId - Course ID
 * @returns {Promise<Array>} List of lessons
 */
export async function getLessonsByCourse(courseId) {
  try {
    const lessonsRef = collection(firestore, 'lessons');
    const q = query(lessonsRef, where('courseId', '==', courseId), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);

    const lessons = [];
    snapshot.forEach(doc => {
      lessons.push({ id: doc.id, ...doc.data() });
    });

    return lessons;
  } catch (error) {
    console.error('❌ Error getting lessons:', error.message);
    throw error;
  }
}

// ==================== ASSIGNMENT OPERATIONS ====================

/**
 * Create assignment (Teacher only)
 * @param {Object} assignmentData - Assignment information
 * @returns {Promise<string>} Assignment ID
 */
export async function createAssignment(assignmentData) {
  try {
    const assignmentRef = await addDoc(collection(firestore, 'assignments'), {
      courseId: assignmentData.courseId,
      title: assignmentData.title,
      description: assignmentData.description,
      dueDate: Timestamp.fromDate(new Date(assignmentData.dueDate)),
      resources: assignmentData.resources || [],
      createdBy: assignmentData.createdBy,
      createdAt: serverTimestamp()
    });

    console.log(`✅ Assignment created: ${assignmentData.title}`);
    return assignmentRef.id;
  } catch (error) {
    console.error('❌ Error creating assignment:', error.message);
    throw error;
  }
}

// ==================== EXAM OPERATIONS ====================

/**
 * Create exam (Teacher only)
 * @param {Object} examData - Exam information
 * @returns {Promise<string>} Exam ID
 */
export async function createExam(examData) {
  try {
    const examRef = await addDoc(collection(firestore, 'exams'), {
      courseId: examData.courseId,
      title: examData.title,
      questions: examData.questions, // Array of question objects
      startTime: Timestamp.fromDate(new Date(examData.startTime)),
      endTime: Timestamp.fromDate(new Date(examData.endTime)),
      createdBy: examData.createdBy,
      createdAt: serverTimestamp()
    });

    console.log(`✅ Exam created: ${examData.title}`);
    return examRef.id;
  } catch (error) {
    console.error('❌ Error creating exam:', error.message);
    throw error;
  }
}

// ==================== TEACHER NOTES OPERATIONS ====================

/**
 * Create teacher note (Auto-created when teacher adds note)
 * @param {Object} noteData - Note information
 * @returns {Promise<string>} Note ID
 */
export async function createTeacherNote(noteData) {
  try {
    const noteRef = await addDoc(collection(firestore, 'notes'), {
      userId: noteData.userId, // Teacher UID
      courseId: noteData.courseId,
      content: noteData.content,
      createdAt: serverTimestamp()
    });

    console.log(`✅ Teacher note created for course: ${noteData.courseId}`);
    return noteRef.id;
  } catch (error) {
    console.error('❌ Error creating teacher note:', error.message);
    throw error;
  }
}

/**
 * Get notes by course
 * @param {string} courseId - Course ID
 * @returns {Promise<Array>} List of notes
 */
export async function getNotesByCourse(courseId) {
  try {
    const notesRef = collection(firestore, 'notes');
    const q = query(notesRef, where('courseId', '==', courseId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const notes = [];
    snapshot.forEach(doc => {
      notes.push({ id: doc.id, ...doc.data() });
    });

    return notes;
  } catch (error) {
    console.error('❌ Error getting notes:', error.message);
    throw error;
  }
}

// ==================== FEEDBACK OPERATIONS ====================

/**
 * Create student feedback
 * @param {Object} feedbackData - Feedback information
 * @returns {Promise<string>} Feedback ID
 */
export async function createFeedback(feedbackData) {
  try {
    const feedbackRef = await addDoc(collection(firestore, 'feedback'), {
      userId: feedbackData.userId,
      courseId: feedbackData.courseId,
      rating: feedbackData.rating,
      comment: feedbackData.comment || '',
      createdAt: serverTimestamp()
    });

    console.log(`✅ Feedback created for course: ${feedbackData.courseId}`);
    return feedbackRef.id;
  } catch (error) {
    console.error('❌ Error creating feedback:', error.message);
    throw error;
  }
}
