import { httpsCallable } from "firebase/functions";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { functions, db } from "./firebase";
import AuthService from "./AuthService";

export const createNote = async (note) => {
  const user = AuthService.getStoredUser();
  if (user?.role !== 'teacher') {
    throw new Error('غير مصرح لك بإنشاء ملاحظات');
  }
  try {
    const addNote = httpsCallable(functions, 'onNoteCreate');
    const response = await addNote(note);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'خطأ في إنشاء الملاحظة');
  }
};

export const fetchNotes = async (courseId = null) => {
  try {
    let q = collection(db, "notes");
    if (courseId) {
      q = query(q, where("courseId", "==", courseId));
    }
    const notesSnapshot = await getDocs(q);
    return notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('خطأ في جلب الملاحظات');
  }
};

export const updateNote = async (noteId, updates) => {
  try {
    const noteRef = doc(db, "notes", noteId);
    await updateDoc(noteRef, updates);
    return { id: noteId, ...updates };
  } catch (error) {
    throw new Error('خطأ في تحديث الملاحظة');
  }
};

export const deleteNote = async (noteId) => {
  try {
    await deleteDoc(doc(db, "notes", noteId));
    return true;
  } catch (error) {
    throw new Error('خطأ في حذف الملاحظة');
  }
};