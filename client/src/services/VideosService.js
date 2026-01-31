import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import AuthService from "./AuthService";

export const fetchVideos = async (courseId = null) => {
  try {
    let q = collection(db, "videos");
    if (courseId) {
      q = query(q, where("courseId", "==", courseId));
    }
    const videosSnapshot = await getDocs(q);
    return videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('خطأ في جلب الفيديوهات');
  }
};

export const createVideo = async (video) => {
  const user = AuthService.getStoredUser();
  if (user?.role !== 'teacher') {
    throw new Error('غير مصرح لك بإنشاء فيديوهات');
  }
  try {
    const docRef = await addDoc(collection(db, "videos"), video);
    return { id: docRef.id, ...video };
  } catch (error) {
    throw new Error('خطأ في إنشاء الفيديو');
  }
};

export const updateVideo = async (videoId, updates) => {
  const user = AuthService.getStoredUser();
  if (user?.role !== 'teacher') {
    throw new Error('غير مصرح لك بتحديث الفيديوهات');
  }
  try {
    const videoRef = doc(db, "videos", videoId);
    await updateDoc(videoRef, updates);
    return { id: videoId, ...updates };
  } catch (error) {
    throw new Error('خطأ في تحديث الفيديو');
  }
};

export const deleteVideo = async (videoId) => {
  const user = AuthService.getStoredUser();
  if (user?.role !== 'teacher') {
    throw new Error('غير مصرح لك بحذف الفيديوهات');
  }
  try {
    await deleteDoc(doc(db, "videos", videoId));
    return true;
  } catch (error) {
    throw new Error('خطأ في حذف الفيديو');
  }
};