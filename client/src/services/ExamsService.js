import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import AuthService from "./AuthService";

export const fetchExams = async (courseId = null) => {
  try {
    let q = collection(db, "exams");
    if (courseId) {
      q = query(q, where("courseId", "==", courseId));
    }
    const examsSnapshot = await getDocs(q);
    return examsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('خطأ في جلب الامتحانات');
  }
};

export const createExam = async (exam) => {
  const user = AuthService.getStoredUser();
  if (user?.role !== 'teacher') {
    throw new Error('غير مصرح لك بإنشاء امتحانات');
  }
  try {
    const docRef = await addDoc(collection(db, "exams"), exam);
    return { id: docRef.id, ...exam };
  } catch (error) {
    throw new Error('خطأ في إنشاء الامتحان');
  }
};

export const updateExam = async (examId, updates) => {
  const user = AuthService.getStoredUser();
  if (user?.role !== 'teacher') {
    throw new Error('غير مصرح لك بتحديث الامتحانات');
  }
  try {
    const examRef = doc(db, "exams", examId);
    await updateDoc(examRef, updates);
    return { id: examId, ...updates };
  } catch (error) {
    throw new Error('خطأ في تحديث الامتحان');
  }
};

export const deleteExam = async (examId) => {
  const user = AuthService.getStoredUser();
  if (user?.role !== 'teacher') {
    throw new Error('غير مصرح لك بحذف الامتحانات');
  }
  try {
    await deleteDoc(doc(db, "exams", examId));
    return true;
  } catch (error) {
    throw new Error('خطأ في حذف الامتحان');
  }
};