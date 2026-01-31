import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { fetchVideos, createVideo, updateVideo, deleteVideo } from "./VideosService";
import { fetchExams, createExam, updateExam, deleteExam } from "./ExamsService";
import { fetchNotes, createNote, updateNote, deleteNote } from "./NotesService";

class ApiService {
  // خدمات الطلاب
  async getStudentDashboard() {
    // جلب بيانات لوحة التحكم للطالب من Firestore
    // افتراضيًا، جلب الفيديوهات والامتحانات والملاحظات
    const [videos, exams, notes] = await Promise.all([
      fetchVideos(),
      fetchExams(),
      fetchNotes()
    ]);
    return { videos, exams, notes };
  }

  async getStudentStats() {
    // حساب إحصائيات الطالب
    const exams = await fetchExams();
    const videos = await fetchVideos();
    // حساب المتوسط والإنجازات
    return {
      totalExams: exams.length,
      totalVideos: videos.length,
      // إضافة حسابات أخرى حسب الحاجة
    };
  }

  async updateVideoWatchTime(videoId, watchTime, completed) {
    // تحديث وقت المشاهدة في Firestore
    await updateVideo(videoId, { watchTime, completed });
    return { success: true };
  }

  // خدمات المدرس
  async getTeacherDashboard() {
    const [videos, exams, notes, students] = await Promise.all([
      fetchVideos(),
      fetchExams(),
      fetchNotes(),
      this.getStudentsList()
    ]);
    return { videos, exams, notes, students };
  }

  async getStudentsList(params = {}) {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const studentsSnapshot = await getDocs(q);
    return studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getStudentDetails(studentId) {
    const studentDoc = await getDoc(doc(db, "users", studentId));
    if (studentDoc.exists()) {
      return { id: studentDoc.id, ...studentDoc.data() };
    }
    throw new Error("الطالب غير موجود");
  }

  async sendNotificationToStudent(studentId, notification) {
    // إرسال إشعار إلى الطالب عبر Firestore أو Realtime DB
    // للتبسيط، إضافة إلى مجموعة الإشعارات
    await addDoc(collection(db, "notifications"), {
      ...notification,
      studentId,
      timestamp: new Date()
    });
    return { success: true };
  }

  // خدمات الفيديوهات
  async getVideos(params = {}) {
    return await fetchVideos(params.courseId);
  }

  async getVideo(videoId) {
    const videoDoc = await getDoc(doc(db, "videos", videoId));
    if (videoDoc.exists()) {
      return { id: videoDoc.id, ...videoDoc.data() };
    }
    throw new Error("الفيديو غير موجود");
  }

  async createVideo(videoData) {
    return await createVideo(videoData);
  }

  async updateVideo(videoId, videoData) {
    return await updateVideo(videoId, videoData);
  }

  async deleteVideo(videoId) {
    return await deleteVideo(videoId);
  }

  // خدمات الامتحانات
  async getExams(params = {}) {
    return await fetchExams(params.courseId);
  }

  async getExam(examId) {
    const examDoc = await getDoc(doc(db, "exams", examId));
    if (examDoc.exists()) {
      return { id: examDoc.id, ...examDoc.data() };
    }
    throw new Error("الامتحان غير موجود");
  }

  async createExam(examData) {
    return await createExam(examData);
  }

  async submitExam(examId, answers, startedAt, timeSpent) {
    // حفظ إجابات الامتحان
    await addDoc(collection(db, "examResults"), {
      examId,
      answers,
      startedAt,
      timeSpent,
      submittedAt: new Date()
    });
    return { success: true };
  }

  async getExamResults(examId) {
    const q = query(collection(db, "examResults"), where("examId", "==", examId));
    const resultsSnapshot = await getDocs(q);
    return resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // خدمات الملاحظات
  async getNotes(params = {}) {
    return await fetchNotes(params.courseId);
  }

  async getNote(noteId) {
    const noteDoc = await getDoc(doc(db, "notes", noteId));
    if (noteDoc.exists()) {
      return { id: noteDoc.id, ...noteDoc.data() };
    }
    throw new Error("الملاحظة غير موجودة");
  }

  async createNote(noteData) {
    return await createNote(noteData);
  }

  async updateNote(noteId, noteData) {
    return await updateNote(noteId, noteData);
  }

  async deleteNote(noteId) {
    return await deleteNote(noteId);
  }

  async markNoteAsRead(noteId) {
    // تحديث حالة القراءة
    await updateNote(noteId, { read: true });
    return { success: true };
  }
    return response.data;
  }

  // خدمات الإشعارات
  async getNotifications(params = {}) {
    const q = query(collection(db, "notifications"), where("studentId", "==", params.studentId || ""));
    const notificationsSnapshot = await getDocs(q);
    return notificationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async markNotificationAsRead(notificationId) {
    await updateDoc(doc(db, "notifications", notificationId), { read: true });
    return { success: true };
  }

  async markAllNotificationsAsRead() {
    // للتبسيط، جلب جميع الإشعارات غير المقروءة وتحديثها
    const q = query(collection(db, "notifications"), where("read", "==", false));
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map(doc => updateDoc(doc.ref, { read: true }));
    await Promise.all(updates);
    return { success: true };
  }

  async deleteNotification(notificationId) {
    await deleteDoc(doc(db, "notifications", notificationId));
    return { success: true };
  }

  async getUnreadNotificationsCount() {
    const q = query(collection(db, "notifications"), where("read", "==", false));
    const snapshot = await getDocs(q);
    return { count: snapshot.size };
  }
}

export default new ApiService();