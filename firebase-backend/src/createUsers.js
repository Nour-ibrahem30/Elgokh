/**
 * Firebase Authentication Users Creator
 * إنشاء المستخدمين في Firebase Authentication
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

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
const auth = getAuth(app);

console.log('🔐 بدء إنشاء المستخدمين في Firebase Authentication...\n');

// بيانات المستخدمين
const users = [
  {
    email: 'mohamednaser@gmail.com',
    password: '16122003',
    displayName: 'الأستاذ محمد ناصر',
    role: 'teacher'
  }
  // الطلاب سيسجلون بأنفسهم باستخدام أي بريد إلكتروني
];

// دالة إنشاء المستخدمين
async function createUsers() {
  try {
    for (const userData of users) {
      try {
        console.log(`👤 إنشاء المستخدم: ${userData.displayName} (${userData.email})`);
        
        // إنشاء المستخدم
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          userData.email, 
          userData.password
        );
        
        // تحديث الملف الشخصي
        await updateProfile(userCredential.user, {
          displayName: userData.displayName
        });
        
        console.log(`✅ تم إنشاء المستخدم بنجاح - UID: ${userCredential.user.uid}`);
        
        // انتظار قصير بين إنشاء المستخدمين
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (userError) {
        if (userError.code === 'auth/email-already-in-use') {
          console.log(`⚠️  المستخدم ${userData.email} موجود بالفعل`);
        } else {
          console.error(`❌ خطأ في إنشاء المستخدم ${userData.email}:`, userError.message);
        }
      }
    }
    
    console.log('\n🎉 انتهى إنشاء المستخدمين!');
    console.log('\n🔐 بيانات تسجيل الدخول:');
    console.log('👨‍🏫 المدرس:');
    console.log('   البريد: teacher@learning-platform.com');
    console.log('   كلمة المرور: Teacher123!');
    console.log('\n👨‍🎓 الطلاب:');
    users.filter(u => u.role === 'student').forEach((student, index) => {
      console.log(`   الطالب ${index + 1}: ${student.displayName}`);
      console.log(`   البريد: ${student.email}`);
      console.log(`   كلمة المرور: ${student.password}`);
    });
    
  } catch (error) {
    console.error('❌ خطأ عام في إنشاء المستخدمين:', error);
  }
}

// تشغيل السكريبت
createUsers().then(() => {
  console.log('\n✨ انتهى إنشاء المستخدمين بنجاح!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ فشل في إنشاء المستخدمين:', error);
  process.exit(1);
});