import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';
import { ErrorHandler } from './utils/error-handler';
import { toastManager } from './components/toast';
import { REDIRECT_URLS } from './constants';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');
function setLoading(isLoading) {
    if (loginBtn)
        loginBtn.disabled = isLoading;
    if (googleLoginBtn)
        googleLoginBtn.disabled = isLoading;
    if (loginBtn)
        loginBtn.classList.toggle('loading', isLoading);
}
async function createUserProfile(uid, email, name) {
    try {
        const role = email === 'mohamednaser@gmail.com' ? 'teacher' : 'student';
        const userDoc = {
            uid,
            name,
            email,
            role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', uid), userDoc);
        ErrorHandler.log(`User profile created: ${uid}`);
        return userDoc;
    }
    catch (error) {
        ErrorHandler.handle(error, 'createUserProfile');
        throw error;
    }
}
async function handleLogin(email, password) {
    try {
        setLoading(true);
        let userCredential;
        try {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
        }
        catch (signInError) {
            if (signInError.code === 'auth/user-not-found' ||
                signInError.code === 'auth/wrong-password') {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await createUserProfile(userCredential.user.uid, email, email.split('@')[0]);
                toastManager.success('تم إنشاء حسابك بنجاح!');
            }
            else {
                throw signInError;
            }
        }
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (!userDoc.exists()) {
            await createUserProfile(userCredential.user.uid, email, email.split('@')[0]);
        }
        const userData = userDoc.data();
        const redirectUrl = userData.role === 'teacher' ? REDIRECT_URLS.TEACHER_DASHBOARD : REDIRECT_URLS.STUDENT_PROFILE;
        toastManager.success('تم تسجيل الدخول بنجاح!');
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
    }
    catch (error) {
        ErrorHandler.handle(error, 'handleLogin');
        toastManager.error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
    finally {
        setLoading(false);
    }
}
async function handleGoogleLogin() {
    try {
        setLoading(true);
        const result = await signInWithPopup(auth, googleProvider);
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!userDoc.exists()) {
            await createUserProfile(result.user.uid, result.user.email || '', result.user.displayName || 'مستخدم');
        }
        const userData = userDoc.data();
        const redirectUrl = userData.role === 'teacher' ? REDIRECT_URLS.TEACHER_DASHBOARD : REDIRECT_URLS.STUDENT_PROFILE;
        toastManager.success('تم تسجيل الدخول بنجاح!');
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
    }
    catch (error) {
        ErrorHandler.handle(error, 'handleGoogleLogin');
        toastManager.error('حدث خطأ أثناء تسجيل الدخول بواسطة Google');
    }
    finally {
        setLoading(false);
    }
}
function setupEventListeners() {
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        if (!email || !password) {
            toastManager.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
            return;
        }
        handleLogin(email, password);
    });
    googleLoginBtn?.addEventListener('click', handleGoogleLogin);
    const passwordToggle = document.querySelector('[data-toggle-password]');
    passwordToggle?.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        passwordToggle.setAttribute('aria-label', type === 'password' ? 'إظهار كلمة المرور' : 'إخفاء كلمة المرور');
    });
}
onAuthStateChanged(auth, async (user) => {
    if (user && window.location.pathname.includes('login.html')) {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const redirectUrl = userData.role === 'teacher' ? REDIRECT_URLS.TEACHER_DASHBOARD : REDIRECT_URLS.STUDENT_PROFILE;
                window.location.href = redirectUrl;
            }
        }
        catch (error) {
            ErrorHandler.handle(error, 'onAuthStateChanged');
        }
    }
});
setupEventListeners();
