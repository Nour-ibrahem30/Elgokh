/**
 * Realtime Database Service
 * Handles real-time updates for progress, notifications, and chat
 */

import {
  ref,
  set,
  get,
  push,
  update,
  onValue,
  serverTimestamp
} from 'firebase/database';
import { realtimeDb } from '../config/firebase.js';

// ==================== PROGRESS TRACKING ====================

/**
 * Update student progress for a course
 * @param {string} studentUid - Student UID
 * @param {string} courseId - Course ID
 * @param {Object} progressData - Progress information
 * @returns {Promise<void>}
 */
export async function updateStudentProgress(studentUid, courseId, progressData) {
  try {
    const progressRef = ref(realtimeDb, `progress/${studentUid}/${courseId}`);
    
    await update(progressRef, {
      lessonsCompleted: progressData.lessonsCompleted || [],
      examsCompleted: progressData.examsCompleted || [],
      lastUpdated: serverTimestamp()
    });

    console.log(`✅ Progress updated for student: ${studentUid}`);
  } catch (error) {
    console.error('❌ Error updating progress:', error.message);
    throw error;
  }
}

/**
 * Mark lesson as completed
 * @param {string} studentUid - Student UID
 * @param {string} courseId - Course ID
 * @param {string} lessonId - Lesson ID
 * @returns {Promise<void>}
 */
export async function markLessonCompleted(studentUid, courseId, lessonId) {
  try {
    const progressRef = ref(realtimeDb, `progress/${studentUid}/${courseId}`);
    const snapshot = await get(progressRef);
    
    let lessonsCompleted = [];
    if (snapshot.exists()) {
      lessonsCompleted = snapshot.val().lessonsCompleted || [];
    }

    if (!lessonsCompleted.includes(lessonId)) {
      lessonsCompleted.push(lessonId);
    }

    await update(progressRef, {
      lessonsCompleted,
      lastUpdated: serverTimestamp()
    });

    console.log(`✅ Lesson ${lessonId} marked as completed`);
  } catch (error) {
    console.error('❌ Error marking lesson completed:', error.message);
    throw error;
  }
}

/**
 * Mark exam as completed
 * @param {string} studentUid - Student UID
 * @param {string} courseId - Course ID
 * @param {string} examId - Exam ID
 * @returns {Promise<void>}
 */
export async function markExamCompleted(studentUid, courseId, examId) {
  try {
    const progressRef = ref(realtimeDb, `progress/${studentUid}/${courseId}`);
    const snapshot = await get(progressRef);
    
    let examsCompleted = [];
    if (snapshot.exists()) {
      examsCompleted = snapshot.val().examsCompleted || [];
    }

    if (!examsCompleted.includes(examId)) {
      examsCompleted.push(examId);
    }

    await update(progressRef, {
      examsCompleted,
      lastUpdated: serverTimestamp()
    });

    console.log(`✅ Exam ${examId} marked as completed`);
  } catch (error) {
    console.error('❌ Error marking exam completed:', error.message);
    throw error;
  }
}

/**
 * Get student progress for a course
 * @param {string} studentUid - Student UID
 * @param {string} courseId - Course ID
 * @returns {Promise<Object>} Progress data
 */
export async function getStudentProgress(studentUid, courseId) {
  try {
    const progressRef = ref(realtimeDb, `progress/${studentUid}/${courseId}`);
    const snapshot = await get(progressRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }

    return {
      lessonsCompleted: [],
      examsCompleted: []
    };
  } catch (error) {
    console.error('❌ Error getting progress:', error.message);
    throw error;
  }
}

// ==================== NOTIFICATIONS ====================

/**
 * Send notification to students
 * @param {Object} notificationData - Notification information
 * @returns {Promise<string>} Notification ID
 */
export async function sendNotification(notificationData) {
  try {
    const notificationsRef = ref(realtimeDb, 'notifications');
    const newNotificationRef = push(notificationsRef);

    await set(newNotificationRef, {
      title: notificationData.title,
      courseId: notificationData.courseId || null,
      message: notificationData.message || '',
      type: notificationData.type || 'info', // info, warning, success
      timestamp: serverTimestamp()
    });

    console.log(`✅ Notification sent: ${notificationData.title}`);
    return newNotificationRef.key;
  } catch (error) {
    console.error('❌ Error sending notification:', error.message);
    throw error;
  }
}

/**
 * Get all notifications
 * @returns {Promise<Array>} List of notifications
 */
export async function getAllNotifications() {
  try {
    const notificationsRef = ref(realtimeDb, 'notifications');
    const snapshot = await get(notificationsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const notifications = [];
    snapshot.forEach(child => {
      notifications.push({
        id: child.key,
        ...child.val()
      });
    });

    return notifications.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('❌ Error getting notifications:', error.message);
    throw error;
  }
}

/**
 * Listen to notifications in real-time
 * @param {Function} callback - Callback function to handle new notifications
 * @returns {Function} Unsubscribe function
 */
export function listenToNotifications(callback) {
  const notificationsRef = ref(realtimeDb, 'notifications');
  
  const unsubscribe = onValue(notificationsRef, (snapshot) => {
    if (snapshot.exists()) {
      const notifications = [];
      snapshot.forEach(child => {
        notifications.push({
          id: child.key,
          ...child.val()
        });
      });
      callback(notifications.sort((a, b) => b.timestamp - a.timestamp));
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}

// ==================== LIVE CHAT ====================

/**
 * Send message to course chat
 * @param {string} courseId - Course ID
 * @param {Object} messageData - Message information
 * @returns {Promise<string>} Message ID
 */
export async function sendChatMessage(courseId, messageData) {
  try {
    const chatRef = ref(realtimeDb, `liveChat/${courseId}`);
    const newMessageRef = push(chatRef);

    await set(newMessageRef, {
      userId: messageData.userId,
      userName: messageData.userName,
      message: messageData.message,
      timestamp: serverTimestamp()
    });

    console.log(`✅ Message sent to course ${courseId}`);
    return newMessageRef.key;
  } catch (error) {
    console.error('❌ Error sending message:', error.message);
    throw error;
  }
}

/**
 * Get chat messages for a course
 * @param {string} courseId - Course ID
 * @returns {Promise<Array>} List of messages
 */
export async function getChatMessages(courseId) {
  try {
    const chatRef = ref(realtimeDb, `liveChat/${courseId}`);
    const snapshot = await get(chatRef);

    if (!snapshot.exists()) {
      return [];
    }

    const messages = [];
    snapshot.forEach(child => {
      messages.push({
        id: child.key,
        ...child.val()
      });
    });

    return messages.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error('❌ Error getting chat messages:', error.message);
    throw error;
  }
}

/**
 * Listen to chat messages in real-time
 * @param {string} courseId - Course ID
 * @param {Function} callback - Callback function to handle new messages
 * @returns {Function} Unsubscribe function
 */
export function listenToChatMessages(courseId, callback) {
  const chatRef = ref(realtimeDb, `liveChat/${courseId}`);
  
  const unsubscribe = onValue(chatRef, (snapshot) => {
    if (snapshot.exists()) {
      const messages = [];
      snapshot.forEach(child => {
        messages.push({
          id: child.key,
          ...child.val()
        });
      });
      callback(messages.sort((a, b) => a.timestamp - b.timestamp));
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}
