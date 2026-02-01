/**
 * Test Functions
 * Example usage of all Firebase backend functions
 */

import {
  registerUser,
  loginUser,
  getCurrentUser
} from '../services/auth.service.js';

import {
  createCourse,
  createLesson,
  createTeacherNote,
  createExam,
  createAssignment,
  getAllCourses,
  getLessonsByCourse,
  getNotesByCourse
} from '../services/firestore.service.js';

import {
  updateStudentProgress,
  markLessonCompleted,
  markExamCompleted,
  sendNotification,
  sendChatMessage,
  getChatMessages
} from '../services/realtime.service.js';

console.log('🧪 Firebase Backend Test Functions\n');

// ==================== AUTHENTICATION EXAMPLES ====================

async function testAuthentication() {
  console.log('📝 Testing Authentication...\n');

  try {
    // Register a teacher
    const teacher = await registerUser(
      'teacher@example.com',
      'password123',
      'محمد ناصر الفيلسوف',
      'teacher'
    );
    console.log('Teacher registered:', teacher);

    // Register a student
    const student = await registerUser(
      'student@example.com',
      'password123',
      'أحمد محمد',
      'student'
    );
    console.log('Student registered:', student);

    // Login
    const loginResult = await loginUser('teacher@example.com', 'password123');
    console.log('Login successful:', loginResult);

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// ==================== COURSE EXAMPLES ====================

async function testCourseOperations() {
  console.log('\n📚 Testing Course Operations...\n');

  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.log('Please login first');
      return;
    }

    // Create a course
    const courseId = await createCourse({
      title: 'مقدمة في الفلسفة',
      description: 'دورة شاملة في أساسيات الفلسفة',
      instructorId: currentUser.uid,
      thumbnailUrl: 'https://example.com/thumbnail.jpg'
    });
    console.log('Course created with ID:', courseId);

    // Create a lesson
    const lessonId = await createLesson({
      courseId: courseId,
      title: 'الدرس الأول: ما هي الفلسفة؟',
      videoUrl: 'https://youtube.com/watch?v=example',
      notes: 'ملاحظات الدرس الأول',
      createdBy: currentUser.uid
    });
    console.log('Lesson created with ID:', lessonId);

    // Create teacher note (auto-created)
    const noteId = await createTeacherNote({
      userId: currentUser.uid,
      courseId: courseId,
      content: 'ملاحظة مهمة للطلاب: يرجى مراجعة الدرس قبل الامتحان'
    });
    console.log('Teacher note created with ID:', noteId);

    // Get all courses
    const courses = await getAllCourses();
    console.log('All courses:', courses);

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// ==================== EXAM EXAMPLES ====================

async function testExamOperations() {
  console.log('\n📋 Testing Exam Operations...\n');

  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.log('Please login first');
      return;
    }

    // Create an exam
    const examId = await createExam({
      courseId: 'course123',
      title: 'امتحان الفصل الأول',
      questions: [
        {
          question: 'ما هو تعريف الفلسفة؟',
          options: ['علم الحكمة', 'علم الطبيعة', 'علم الرياضيات', 'علم الفلك'],
          correctAnswer: 0
        },
        {
          question: 'من هو أفلاطون؟',
          options: ['فيلسوف يوناني', 'عالم رياضيات', 'طبيب', 'شاعر'],
          correctAnswer: 0
        }
      ],
      startTime: new Date('2026-02-15T10:00:00'),
      endTime: new Date('2026-02-15T12:00:00'),
      createdBy: currentUser.uid
    });
    console.log('Exam created with ID:', examId);

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// ==================== PROGRESS TRACKING EXAMPLES ====================

async function testProgressTracking() {
  console.log('\n📊 Testing Progress Tracking...\n');

  try {
    const studentUid = 'student123';
    const courseId = 'course123';

    // Mark lesson as completed
    await markLessonCompleted(studentUid, courseId, 'lesson1');
    console.log('Lesson marked as completed');

    // Mark exam as completed
    await markExamCompleted(studentUid, courseId, 'exam1');
    console.log('Exam marked as completed');

    // Update overall progress
    await updateStudentProgress(studentUid, courseId, {
      lessonsCompleted: ['lesson1', 'lesson2'],
      examsCompleted: ['exam1']
    });
    console.log('Progress updated');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// ==================== NOTIFICATION EXAMPLES ====================

async function testNotifications() {
  console.log('\n🔔 Testing Notifications...\n');

  try {
    // Send notification
    const notificationId = await sendNotification({
      title: 'درس جديد متاح',
      courseId: 'course123',
      message: 'تم إضافة درس جديد في مقدمة الفلسفة',
      type: 'info'
    });
    console.log('Notification sent with ID:', notificationId);

    // Send notification when teacher adds a note
    await sendNotification({
      title: 'ملاحظة جديدة من المدرس',
      courseId: 'course123',
      message: 'أضاف المدرس ملاحظة جديدة للدورة',
      type: 'success'
    });
    console.log('Note notification sent');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// ==================== CHAT EXAMPLES ====================

async function testLiveChat() {
  console.log('\n💬 Testing Live Chat...\n');

  try {
    const courseId = 'course123';

    // Send chat message
    const messageId = await sendChatMessage(courseId, {
      userId: 'user123',
      userName: 'أحمد محمد',
      message: 'مرحباً، هل يمكن توضيح النقطة الأخيرة؟'
    });
    console.log('Message sent with ID:', messageId);

    // Get chat messages
    const messages = await getChatMessages(courseId);
    console.log('Chat messages:', messages);

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// ==================== RUN ALL TESTS ====================

async function runAllTests() {
  console.log('🚀 Starting all tests...\n');
  console.log('=' .repeat(50));

  await testAuthentication();
  await testCourseOperations();
  await testExamOperations();
  await testProgressTracking();
  await testNotifications();
  await testLiveChat();

  console.log('\n' + '='.repeat(50));
  console.log('✅ All tests completed!\n');
}

// Export for use
export {
  testAuthentication,
  testCourseOperations,
  testExamOperations,
  testProgressTracking,
  testNotifications,
  testLiveChat,
  runAllTests
};

// Uncomment to run tests
// runAllTests();

console.log('💡 Import these functions to test Firebase backend');
console.log('Example: import { testAuthentication } from "./testFunctions.js"');
