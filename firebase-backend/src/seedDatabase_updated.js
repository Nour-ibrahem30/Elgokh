/**
 * Firebase Database Seeder - Updated with Real UIDs
 * يقوم بإرسال جميع البيانات التجريبية إلى Firebase مع استخدام UIDs الحقيقية
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc, writeBatch } from 'firebase/firestore';

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAU0CCiQNrPEYpTNU4rAwmOmPUZnjb2FoU",
  authDomain: "a-platform-for-learning.firebaseapp.com",
  projectId: "a-platform-for-learning",
  storageBucket: "a-platform-for-learning.firebasestorage.app",
  messagingSenderId: "764579707883",
  appId: "1:764579707883:web:5456e2348354cc58fab7ae",
  measurementId: "G-4P972FP416",
  databaseURL: "https://a-platform-for-learning-default-rtdb.firebaseio.com"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🚀 بدء إرسال البيانات إلى Firebase...\n');

// UIDs الحقيقية من Firebase Authentication
const TEACHER_UID = 'UE1we4psryQOpB9Wyd4pKgC5K1g1';
const STUDENT1_UID = 'ktFIQ0dE3WP22vv5bkBlidmSsvj1';
const STUDENT2_UID = 'mDRljNUbbHeNZaTfqf0Xn1KP5Ue2';
const STUDENT3_UID = 'cRzpji3Ry9Pk4Up3slumz2w1SR52';

// بيانات المستخدمين
const sampleUsers = [
  {
    uid: TEACHER_UID,
    email: 'teacher@learning-platform.com',
    name: 'الأستاذ محمد ناصر',
    role: 'teacher',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    uid: STUDENT1_UID,
    email: 'student1@example.com',
    name: 'أحمد محمد علي',
    role: 'student',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    uid: STUDENT2_UID,
    email: 'student2@example.com',
    name: 'فاطمة أحمد حسن',
    role: 'student',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    uid: STUDENT3_UID,
    email: 'student3@example.com',
    name: 'عبدالله سعد المطيري',
    role: 'student',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// بيانات الدورات التعليمية
const sampleCourses = [
  {
    id: 'course-math-001',
    title: 'الرياضيات المتقدمة',
    description: 'دورة شاملة في الرياضيات المتقدمة تغطي الجبر والهندسة والتفاضل والتكامل',
    instructorId: TEACHER_UID,
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    createdAt: new Date().toISOString(),
    category: 'mathematics',
    level: 'advanced',
    duration: 120,
    studentsCount: 3
  },
  {
    id: 'course-physics-001',
    title: 'الفيزياء النووية',
    description: 'مقدمة شاملة في الفيزياء النووية والذرية مع التطبيقات العملية',
    instructorId: TEACHER_UID,
    thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400',
    createdAt: new Date().toISOString(),
    category: 'physics',
    level: 'intermediate',
    duration: 80,
    studentsCount: 2
  },
  {
    id: 'course-chemistry-001',
    title: 'الكيمياء العضوية',
    description: 'دراسة مفصلة للمركبات العضوية وتفاعلاتها وتطبيقاتها في الحياة',
    instructorId: TEACHER_UID,
    thumbnailUrl: 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=400',
    createdAt: new Date().toISOString(),
    category: 'chemistry',
    level: 'intermediate',
    duration: 60,
    studentsCount: 1
  },
  {
    id: 'course-history-001',
    title: 'التاريخ الإسلامي',
    description: 'رحلة عبر التاريخ الإسلامي من البداية حتى العصر الحديث',
    instructorId: TEACHER_UID,
    thumbnailUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    createdAt: new Date().toISOString(),
    category: 'history',
    level: 'beginner',
    duration: 40,
    studentsCount: 2
  }
];

// بيانات الدروس (الفيديوهات)
const sampleLessons = [
  // دروس الرياضيات
  {
    id: 'lesson-math-001',
    courseId: 'course-math-001',
    title: 'مقدمة في الجبر الخطي',
    description: 'أساسيات الجبر الخطي والمصفوفات',
    videoUrl: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
    duration: 45,
    order: 1,
    createdBy: TEACHER_UID,
    createdAt: new Date().toISOString(),
    notes: 'هذا الدرس يغطي المفاهيم الأساسية للجبر الخطي'
  },
  {
    id: 'lesson-math-002',
    courseId: 'course-math-001',
    title: 'العمليات على المصفوفات',
    description: 'جمع وضرب وقسمة المصفوفات',
    videoUrl: 'https://www.youtube.com/watch?v=XkY2DOUCWMU',
    duration: 50,
    order: 2,
    createdBy: TEACHER_UID,
    createdAt: new Date().toISOString(),
    notes: 'تطبيقات عملية على العمليات الحسابية للمصفوفات'
  },
  {
    id: 'lesson-math-003',
    courseId: 'course-math-001',
    title: 'حل المعادلات الخطية',
    description: 'طرق حل أنظمة المعادلات الخطية',
    videoUrl: 'https://www.youtube.com/watch?v=2IdtqGM6KWU',
    duration: 55,
    order: 3,
    createdBy: TEACHER_UID,
    createdAt: new Date().toISOString(),
    notes: 'استخدام طريقة جاوس وكرامر في حل المعادلات'
  },
  
  // دروس الفيزياء
  {
    id: 'lesson-physics-001',
    courseId: 'course-physics-001',
    title: 'مقدمة في الفيزياء النووية',
    description: 'أساسيات الذرة والنواة',
    videoUrl: 'https://www.youtube.com/watch?v=Qh_QBwvEUsE',
    duration: 40,
    order: 1,
    createdBy: TEACHER_UID,
    createdAt: new Date().toISOString(),
    notes: 'تركيب الذرة والجسيمات الأولية'
  },
  {
    id: 'lesson-physics-002',
    courseId: 'course-physics-001',
    title: 'الانحلال الإشعاعي',
    description: 'أنواع الانحلال الإشعاعي وقوانينه',
    videoUrl: 'https://www.youtube.com/watch?v=3koQhWCCd_4',
    duration: 45,
    order: 2,
    createdBy: TEACHER_UID,
    createdAt: new Date().toISOString(),
    notes: 'قوانين الانحلال الإشعاعي وعمر النصف'
  },
  
  // دروس الكيمياء
  {
    id: 'lesson-chemistry-001',
    courseId: 'course-chemistry-001',
    title: 'مقدمة في الكيمياء العضوية',
    description: 'أساسيات المركبات العضوية',
    videoUrl: 'https://www.youtube.com/watch?v=AWLJLy_0Mzg',
    duration: 35,
    order: 1,
    createdBy: TEACHER_UID,
    createdAt: new Date().toISOString(),
    notes: 'تصنيف المركبات العضوية والمجموعات الوظيفية'
  },
  {
    id: 'lesson-chemistry-002',
    courseId: 'course-chemistry-001',
    title: 'الألكانات والألكينات',
    description: 'دراسة الهيدروكربونات المشبعة وغير المشبعة',
    videoUrl: 'https://www.youtube.com/watch?v=H7B5haJ0t0c',
    duration: 42,
    order: 2,
    createdBy: TEACHER_UID,
    createdAt: new Date().toISOString(),
    notes: 'خصائص وتفاعلات الألكانات والألكينات'
  },
  
  // دروس التاريخ
  {
    id: 'lesson-history-001',
    courseId: 'course-history-001',
    title: 'عصر الرسالة',
    description: 'بداية الإسلام والدعوة النبوية',
    videoUrl: 'https://www.youtube.com/watch?v=VOUp3ZZ9t3A',
    duration: 30,
    order: 1,
    createdBy: TEACHER_UID,
    createdAt: new Date().toISOString(),
    notes: 'السيرة النبوية وبداية الدعوة الإسلامية'
  },
  {
    id: 'lesson-history-002',
    courseId: 'course-history-001',
    title: 'الخلافة الراشدة',
    description: 'عهد الخلفاء الراشدين وإنجازاتهم',
    videoUrl: 'https://www.youtube.com/watch?v=TpcbfxtdoI8',
    duration: 38,
    order: 2,
    createdBy: TEACHER_UID,
    createdAt: new Date().toISOString(),
    notes: 'إنجازات الخلفاء الأربعة وتوسع الدولة الإسلامية'
  }
];

// بيانات الامتحانات
const sampleExams = [
  {
    id: 'exam-math-001',
    courseId: 'course-math-001',
    title: 'امتحان الجبر الخطي',
    description: 'امتحان شامل في أساسيات الجبر الخطي',
    type: 'mixed',
    duration: 60,
    totalQuestions: 20,
    passingScore: 50,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: TEACHER_UID,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'ما هو ناتج ضرب المصفوفة A في المصفوفة الوحدة I؟',
        options: ['المصفوفة A', 'المصفوفة I', 'المصفوفة الصفرية', 'لا يمكن الضرب'],
        correctAnswer: 0,
        points: 5
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'المصفوفة المربعة لها دائماً معكوس',
        correctAnswer: false,
        points: 3
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'كم عدد الحلول لنظام معادلات خطية متسق؟',
        options: ['حل واحد فقط', 'حلول لا نهائية', 'حل واحد أو حلول لا نهائية', 'لا يوجد حل'],
        correctAnswer: 2,
        points: 4
      }
    ]
  },
  {
    id: 'exam-physics-001',
    courseId: 'course-physics-001',
    title: 'امتحان الفيزياء النووية',
    description: 'امتحان في أساسيات الفيزياء النووية',
    type: 'mixed',
    duration: 45,
    totalQuestions: 15,
    passingScore: 50,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: TEACHER_UID,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'ما هو العدد الذري للهيدروجين؟',
        options: ['0', '1', '2', '3'],
        correctAnswer: 1,
        points: 4
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'النيوترون له شحنة موجبة',
        correctAnswer: false,
        points: 3
      }
    ]
  }
];

// بيانات المهام التجريبية
const sampleTodos = [
  {
    userId: STUDENT1_UID,
    title: 'مراجعة الدرس الأول في الرياضيات',
    description: 'مراجعة شاملة للمفاهيم الأساسية والتمارين المهمة',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: STUDENT1_UID,
    title: 'حل تمارين الفيزياء - الفصل الثالث',
    description: 'إنجاز جميع التمارين المطلوبة من الكتاب المدرسي',
    completed: true,
    priority: 'medium',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: STUDENT1_UID,
    title: 'إعداد عرض تقديمي للكيمياء',
    description: 'تحضير عرض تقديمي عن التفاعلات الكيميائية',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: STUDENT2_UID,
    title: 'قراءة الفصل الثالث من كتاب التاريخ',
    description: 'قراءة وتلخيص الأحداث التاريخية المهمة',
    completed: false,
    priority: 'low',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: STUDENT2_UID,
    title: 'مراجعة قوانين الفيزياء',
    description: 'مراجعة شاملة لقوانين الحركة والطاقة',
    completed: true,
    priority: 'high',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: STUDENT3_UID,
    title: 'حل مسائل الرياضيات المتقدمة',
    description: 'حل جميع المسائل من الفصل الرابع',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// بيانات نتائج الامتحانات
const sampleExamResults = [
  {
    examId: 'exam-math-001',
    studentId: STUDENT1_UID,
    answers: [0, false, 2],
    score: 12,
    totalQuestions: 3,
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    passed: true,
    percentage: 80
  },
  {
    examId: 'exam-physics-001',
    studentId: STUDENT1_UID,
    answers: [1, false],
    score: 7,
    totalQuestions: 2,
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    passed: true,
    percentage: 100
  },
  {
    examId: 'exam-math-001',
    studentId: STUDENT2_UID,
    answers: [1, true, 0],
    score: 3,
    totalQuestions: 3,
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    passed: false,
    percentage: 25
  },
  {
    examId: 'exam-physics-001',
    studentId: STUDENT2_UID,
    answers: [1, false],
    score: 7,
    totalQuestions: 2,
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    passed: true,
    percentage: 100
  },
  {
    examId: 'exam-math-001',
    studentId: STUDENT3_UID,
    answers: [0, false, 2],
    score: 12,
    totalQuestions: 3,
    completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    passed: true,
    percentage: 80
  }
];

// بيانات التقدم
const sampleProgress = [
  {
    studentId: STUDENT1_UID,
    courseId: 'course-math-001',
    lessonsCompleted: ['lesson-math-001', 'lesson-math-002'],
    examsCompleted: ['exam-math-001'],
    lastAccessed: new Date().toISOString(),
    completionPercentage: 67
  },
  {
    studentId: STUDENT1_UID,
    courseId: 'course-physics-001',
    lessonsCompleted: ['lesson-physics-001'],
    examsCompleted: ['exam-physics-001'],
    lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    completionPercentage: 50
  },
  {
    studentId: STUDENT2_UID,
    courseId: 'course-math-001',
    lessonsCompleted: ['lesson-math-001'],
    examsCompleted: [],
    lastAccessed: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    completionPercentage: 33
  },
  {
    studentId: STUDENT2_UID,
    courseId: 'course-physics-001',
    lessonsCompleted: ['lesson-physics-001', 'lesson-physics-002'],
    examsCompleted: ['exam-physics-001'],
    lastAccessed: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    completionPercentage: 100
  },
  {
    studentId: STUDENT3_UID,
    courseId: 'course-math-001',
    lessonsCompleted: ['lesson-math-001', 'lesson-math-002', 'lesson-math-003'],
    examsCompleted: ['exam-math-001'],
    lastAccessed: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    completionPercentage: 100
  }
];

// بيانات الملاحظات
const sampleNotes = [
  {
    userId: STUDENT1_UID,
    courseId: 'course-math-001',
    title: 'ملاحظات الجبر الخطي',
    content: 'المصفوفات هي ترتيب مستطيلي للأرقام في صفوف وأعمدة. العمليات الأساسية تشمل الجمع والضرب.',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: STUDENT1_UID,
    courseId: 'course-physics-001',
    title: 'ملاحظات الفيزياء النووية',
    content: 'الذرة تتكون من نواة (بروتونات ونيوترونات) وإلكترونات تدور حولها.',
    priority: 'medium',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: STUDENT2_UID,
    courseId: 'course-history-001',
    title: 'ملاحظات التاريخ الإسلامي',
    content: 'بدأت الدعوة الإسلامية في مكة المكرمة وانتشرت في جميع أنحاء العالم.',
    priority: 'medium',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// بيانات الشهادات والتقييمات
const sampleTestimonials = [
  {
    studentName: 'أحمد محمد علي',
    studentId: STUDENT1_UID,
    rating: 5,
    comment: 'منصة رائعة ومفيدة جداً. الشروحات واضحة والمحتوى منظم بشكل ممتاز.',
    courseId: 'course-math-001',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    studentName: 'فاطمة أحمد حسن',
    studentId: STUDENT2_UID,
    rating: 4,
    comment: 'تجربة تعلم ممتازة. أنصح بها لكل من يريد تطوير مهاراته الأكاديمية.',
    courseId: 'course-physics-001',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    studentName: 'عبدالله سعد المطيري',
    studentId: STUDENT3_UID,
    rating: 5,
    comment: 'المدرس ممتاز والمحتوى غني بالمعلومات المفيدة. شكراً لكم.',
    courseId: 'course-math-001',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// دالة إرسال البيانات
async function seedDatabase() {
  try {
    console.log('📝 إرسال بيانات المستخدمين...');
    
    // إرسال بيانات المستخدمين
    const batch1 = writeBatch(db);
    for (const user of sampleUsers) {
      const userRef = doc(db, 'users', user.uid);
      batch1.set(userRef, {
        uid: user.uid,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    }
    await batch1.commit();
    console.log('✅ تم إرسال بيانات المستخدمين بنجاح');

    console.log('📚 إرسال بيانات الدورات...');
    
    // إرسال بيانات الدورات
    const batch2 = writeBatch(db);
    for (const course of sampleCourses) {
      const courseRef = doc(db, 'courses', course.id);
      batch2.set(courseRef, course);
    }
    await batch2.commit();
    console.log('✅ تم إرسال بيانات الدورات بنجاح');

    console.log('🎥 إرسال بيانات الدروس...');
    
    // إرسال بيانات الدروس
    const batch3 = writeBatch(db);
    for (const lesson of sampleLessons) {
      const lessonRef = doc(db, 'lessons', lesson.id);
      batch3.set(lessonRef, lesson);
    }
    await batch3.commit();
    console.log('✅ تم إرسال بيانات الدروس بنجاح');

    console.log('📝 إرسال بيانات الامتحانات...');
    
    // إرسال بيانات الامتحانات
    const batch4 = writeBatch(db);
    for (const exam of sampleExams) {
      const examRef = doc(db, 'exams', exam.id);
      batch4.set(examRef, exam);
    }
    await batch4.commit();
    console.log('✅ تم إرسال بيانات الامتحانات بنجاح');

    console.log('✅ إرسال بيانات المهام...');
    
    // إرسال بيانات المهام
    for (const todo of sampleTodos) {
      await addDoc(collection(db, 'todos'), todo);
    }
    console.log('✅ تم إرسال بيانات المهام بنجاح');

    console.log('📊 إرسال نتائج الامتحانات...');
    
    // إرسال نتائج الامتحانات
    for (const result of sampleExamResults) {
      await addDoc(collection(db, 'examResults'), result);
    }
    console.log('✅ تم إرسال نتائج الامتحانات بنجاح');

    console.log('📈 إرسال بيانات التقدم...');
    
    // إرسال بيانات التقدم
    for (const progress of sampleProgress) {
      const progressId = `${progress.studentId}_${progress.courseId}`;
      await setDoc(doc(db, 'progress', progressId), progress);
    }
    console.log('✅ تم إرسال بيانات التقدم بنجاح');

    console.log('📝 إرسال بيانات الملاحظات...');
    
    // إرسال بيانات الملاحظات
    for (const note of sampleNotes) {
      await addDoc(collection(db, 'notes'), note);
    }
    console.log('✅ تم إرسال بيانات الملاحظات بنجاح');

    console.log('⭐ إرسال بيانات التقييمات...');
    
    // إرسال بيانات التقييمات
    for (const testimonial of sampleTestimonials) {
      await addDoc(collection(db, 'testimonials'), testimonial);
    }
    console.log('✅ تم إرسال بيانات التقييمات بنجاح');

    console.log('\n🎉 تم إرسال جميع البيانات إلى Firebase بنجاح!');
    console.log('\n📋 ملخص البيانات المرسلة:');
    console.log(`👥 المستخدمون: ${sampleUsers.length}`);
    console.log(`📚 الدورات: ${sampleCourses.length}`);
    console.log(`🎥 الدروس: ${sampleLessons.length}`);
    console.log(`📝 الامتحانات: ${sampleExams.length}`);
    console.log(`✅ المهام: ${sampleTodos.length}`);
    console.log(`📊 نتائج الامتحانات: ${sampleExamResults.length}`);
    console.log(`📈 بيانات التقدم: ${sampleProgress.length}`);
    console.log(`📝 الملاحظات: ${sampleNotes.length}`);
    console.log(`⭐ التقييمات: ${sampleTestimonials.length}`);
    
    console.log('\n🔐 بيانات تسجيل الدخول التجريبية:');
    console.log('👨‍🏫 المدرس:');
    console.log('   البريد: teacher@learning-platform.com');
    console.log('   كلمة المرور: Teacher123!');
    console.log('\n👨‍🎓 الطلاب:');
    console.log('   الطالب 1: أحمد محمد علي');
    console.log('   البريد: student1@example.com');
    console.log('   كلمة المرور: Student123!');
    console.log('   الطالب 2: فاطمة أحمد حسن');
    console.log('   البريد: student2@example.com');
    console.log('   كلمة المرور: Student123!');
    console.log('   الطالب 3: عبدالله سعد المطيري');
    console.log('   البريد: student3@example.com');
    console.log('   كلمة المرور: Student123!');

  } catch (error) {
    console.error('❌ خطأ في إرسال البيانات:', error);
    process.exit(1);
  }
}

// تشغيل السكريپت
seedDatabase().then(() => {
  console.log('\n✨ انتهى إرسال البيانات بنجاح!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ فشل في إرسال البيانات:', error);
  process.exit(1);
});