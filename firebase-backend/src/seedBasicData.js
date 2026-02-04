/**
 * Firebase Basic Data Seeder
 * إرسال البيانات الأساسية فقط (الدورات والدروس والامتحانات)
 * الطلاب سيسجلون تلقائياً عند تسجيل الدخول
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

console.log('🚀 بدء إرسال البيانات الأساسية إلى Firebase...\n');

// UID المدرس الحقيقي
const TEACHER_UID = 'FcQkTppXwcNVSt7AkBi0J1JKkjI2';

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
    studentsCount: 0
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
    studentsCount: 0
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
    studentsCount: 0
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
    studentsCount: 0
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
    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 يوم من الآن
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
    endTime: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 يوم من الآن
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

// دالة إرسال البيانات الأساسية
async function seedBasicData() {
  try {
    console.log('📚 إرسال بيانات الدورات...');
    
    // إرسال بيانات الدورات
    const batch1 = writeBatch(db);
    for (const course of sampleCourses) {
      const courseRef = doc(db, 'courses', course.id);
      batch1.set(courseRef, course);
    }
    await batch1.commit();
    console.log('✅ تم إرسال بيانات الدورات بنجاح');

    console.log('🎥 إرسال بيانات الدروس...');
    
    // إرسال بيانات الدروس
    const batch2 = writeBatch(db);
    for (const lesson of sampleLessons) {
      const lessonRef = doc(db, 'lessons', lesson.id);
      batch2.set(lessonRef, lesson);
    }
    await batch2.commit();
    console.log('✅ تم إرسال بيانات الدروس بنجاح');

    console.log('📝 إرسال بيانات الامتحانات...');
    
    // إرسال بيانات الامتحانات
    const batch3 = writeBatch(db);
    for (const exam of sampleExams) {
      const examRef = doc(db, 'exams', exam.id);
      batch3.set(examRef, exam);
    }
    await batch3.commit();
    console.log('✅ تم إرسال بيانات الامتحانات بنجاح');

    console.log('\n🎉 تم إرسال البيانات الأساسية إلى Firebase بنجاح!');
    console.log('\n📋 ملخص البيانات المرسلة:');
    console.log(`📚 الدورات: ${sampleCourses.length}`);
    console.log(`🎥 الدروس: ${sampleLessons.length}`);
    console.log(`📝 الامتحانات: ${sampleExams.length}`);
    
    console.log('\n🔐 بيانات تسجيل الدخول:');
    console.log('👨‍🏫 المدرس:');
    console.log('   البريد: mohamednaser@gmail.com');
    console.log('   كلمة المرور: 16122003');
    console.log('\n👨‍🎓 الطلاب:');
    console.log('   يمكن لأي طالب التسجيل باستخدام أي بريد إلكتروني وكلمة مرور');
    console.log('   سيتم إنشاء حسابهم تلقائياً عند تسجيل الدخول لأول مرة');

  } catch (error) {
    console.error('❌ خطأ في إرسال البيانات:', error);
    process.exit(1);
  }
}

// تشغيل السكريپت
seedBasicData().then(() => {
  console.log('\n✨ انتهى إرسال البيانات الأساسية بنجاح!');
  console.log('\n📝 ملاحظات مهمة:');
  console.log('1. المدرس: mohamednaser@gmail.com / 16122003');
  console.log('2. الطلاب: يمكنهم التسجيل بأي بريد إلكتروني');
  console.log('3. سيتم إنشاء ملفات الطلاب تلقائياً عند تسجيل الدخول');
  console.log('4. لا تنس استعادة قواعد الأمان بعد إرسال البيانات');
  process.exit(0);
}).catch((error) => {
  console.error('❌ فشل في إرسال البيانات:', error);
  process.exit(1);
});