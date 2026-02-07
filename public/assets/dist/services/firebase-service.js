import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebase-config';
import { ErrorHandler } from '../utils/error-handler';
export class FirebaseService {
    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
    }
    static getInstance() {
        if (!FirebaseService.instance) {
            FirebaseService.instance = new FirebaseService();
        }
        return FirebaseService.instance;
    }
    getAuth() {
        return this.auth;
    }
    getFirestore() {
        return this.db;
    }
    async signInWithEmail(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        }
        catch (error) {
            ErrorHandler.handle(error, 'signInWithEmail');
            throw error;
        }
    }
    async signInWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(this.auth, provider);
            return userCredential.user;
        }
        catch (error) {
            ErrorHandler.handle(error, 'signInWithGoogle');
            throw error;
        }
    }
    async createUser(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        }
        catch (error) {
            ErrorHandler.handle(error, 'createUser');
            throw error;
        }
    }
    async signOut() {
        try {
            await signOut(this.auth);
        }
        catch (error) {
            ErrorHandler.handle(error, 'signOut');
            throw error;
        }
    }
    onAuthStateChanged(callback) {
        return onAuthStateChanged(this.auth, callback);
    }
    async createUserProfile(uid, userData) {
        try {
            const userDoc = {
                uid,
                name: userData.name || '',
                email: userData.email || '',
                role: userData.role || 'student',
                createdAt: userData.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await setDoc(doc(this.db, 'users', uid), userDoc);
            ErrorHandler.log(`User profile created for ${uid}`);
        }
        catch (error) {
            ErrorHandler.handle(error, 'createUserProfile');
            throw error;
        }
    }
    async getUserProfile(uid) {
        try {
            const userDoc = await getDoc(doc(this.db, 'users', uid));
            return userDoc.exists() ? userDoc.data() : null;
        }
        catch (error) {
            ErrorHandler.handle(error, 'getUserProfile');
            return null;
        }
    }
    async updateUserProfile(uid, data) {
        try {
            await updateDoc(doc(this.db, 'users', uid), {
                ...data,
                updatedAt: new Date().toISOString()
            });
            ErrorHandler.log(`User profile updated for ${uid}`);
        }
        catch (error) {
            ErrorHandler.handle(error, 'updateUserProfile');
            throw error;
        }
    }
    async queryCollection(collectionName, constraints = []) {
        try {
            const q = query(collection(this.db, collectionName), ...constraints);
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        catch (error) {
            ErrorHandler.handle(error, `queryCollection(${collectionName})`);
            return [];
        }
    }
    async getDocument(collectionName, docId) {
        try {
            const docSnapshot = await getDoc(doc(this.db, collectionName, docId));
            return docSnapshot.exists()
                ? { id: docSnapshot.id, ...docSnapshot.data() }
                : null;
        }
        catch (error) {
            ErrorHandler.handle(error, `getDocument(${collectionName}/${docId})`);
            return null;
        }
    }
    async saveDocument(collectionName, docId, data) {
        try {
            await setDoc(doc(this.db, collectionName, docId), {
                ...data,
                updatedAt: new Date().toISOString()
            });
            ErrorHandler.log(`Document saved: ${collectionName}/${docId}`);
        }
        catch (error) {
            ErrorHandler.handle(error, `saveDocument(${collectionName}/${docId})`);
            throw error;
        }
    }
    async deleteDocument(collectionName, docId) {
        try {
            await deleteDoc(doc(this.db, collectionName, docId));
            ErrorHandler.log(`Document deleted: ${collectionName}/${docId}`);
        }
        catch (error) {
            ErrorHandler.handle(error, `deleteDocument(${collectionName}/${docId})`);
            throw error;
        }
    }
}
export const firebaseService = FirebaseService.getInstance();
