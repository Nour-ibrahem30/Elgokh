import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

class AuthService {
  constructor() {
    this.currentUser = null;

    // مراقبة حالة المصادقة
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.currentUser = user;
        // جلب بيانات إضافية من Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          this.currentUser = { ...user, ...userDoc.data() };
        }
      } else {
        this.currentUser = null;
      }
    });
  }

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // جلب بيانات المستخدم من Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return { user: { ...user, ...userData }, token: await user.getIdToken() };
      } else {
        throw new Error("بيانات المستخدم غير موجودة");
      }
    } catch (error) {
      throw { message: error.message || 'خطأ في تسجيل الدخول' };
    }
  }

  async register(userData) {
    try {
      const { email, password, name, role = 'student' } = userData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // إضافة بيانات إضافية إلى Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role,
        createdAt: new Date(),
      });

      return { user: { ...user, name, email, role }, token: await user.getIdToken() };
    } catch (error) {
      throw { message: error.message || 'خطأ في التسجيل' };
    }
  }

  async getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }
    return null;
  }

  async updateProfile(profileData) {
    try {
      if (!this.currentUser) throw new Error("المستخدم غير مصادق عليه");

      const userRef = doc(db, "users", this.currentUser.uid);
      await updateDoc(userRef, profileData);

      // تحديث البيانات المحلية
      this.currentUser = { ...this.currentUser, ...profileData };
      return { user: this.currentUser };
    } catch (error) {
      throw { message: error.message || 'خطأ في تحديث البيانات' };
    }
  }

  async logout() {
    try {
      await signOut(auth);
      this.currentUser = null;
    } catch (error) {
      console.error("خطأ في تسجيل الخروج:", error);
    }
  }

  getStoredUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getToken() {
    return this.currentUser ? this.currentUser.getIdToken() : null;
  }
}

export default new AuthService();