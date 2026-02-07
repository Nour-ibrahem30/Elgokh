/**
 * Firebase Service
 * @description Centralized Firebase service for authentication, database, and storage operations
 * @module services/firebase-service
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  QueryConstraint
} from 'firebase/firestore';
import { firebaseConfig, User } from '../firebase-config';
import { ErrorHandler } from '../utils/error-handler';

/**
 * Firebase Service Class
 * Handles all Firebase operations in a centralized, type-safe manner
 */
export class FirebaseService {
  private static instance: FirebaseService;
  private app: FirebaseApp;
  private auth: Auth;
  private db: Firestore;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  /**
   * Get singleton instance of FirebaseService
   * @returns {FirebaseService} Singleton instance
   */
  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  /**
   * Get Auth instance
   * @returns {Auth} Firebase Auth instance
   */
  getAuth(): Auth {
    return this.auth;
  }

  /**
   * Get Firestore instance
   * @returns {Firestore} Firebase Firestore instance
   */
  getFirestore(): Firestore {
    return this.db;
  }

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<FirebaseUser>} User object
   * @throws {Error} If authentication fails
   */
  async signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      ErrorHandler.handle(error, 'signInWithEmail');
      throw error;
    }
  }

  /**
   * Sign in with Google
   * @returns {Promise<FirebaseUser>} User object
   * @throws {Error} If authentication fails
   */
  async signInWithGoogle(): Promise<FirebaseUser> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      return userCredential.user;
    } catch (error) {
      ErrorHandler.handle(error, 'signInWithGoogle');
      throw error;
    }
  }

  /**
   * Create a new user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<FirebaseUser>} User object
   * @throws {Error} If user creation fails
   */
  async createUser(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      ErrorHandler.handle(error, 'createUser');
      throw error;
    }
  }

  /**
   * Sign out current user
   * @returns {Promise<void>}
   * @throws {Error} If sign out fails
   */
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      ErrorHandler.handle(error, 'signOut');
      throw error;
    }
  }

  /**
   * Subscribe to auth state changes
   * @param {(user: FirebaseUser | null) => void} callback - Callback function
   * @returns {() => void} Unsubscribe function
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  /**
   * Create or update user profile in Firestore
   * @param {string} uid - User ID
   * @param {Partial<User>} userData - User data to save
   * @returns {Promise<void>}
   * @throws {Error} If database operation fails
   */
  async createUserProfile(uid: string, userData: Partial<User>): Promise<void> {
    try {
      const userDoc: User = {
        uid,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'student',
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(this.db, 'users', uid), userDoc);
      ErrorHandler.log(`User profile created for ${uid}`);
    } catch (error) {
      ErrorHandler.handle(error, 'createUserProfile');
      throw error;
    }
  }

  /**
   * Get user profile from Firestore
   * @param {string} uid - User ID
   * @returns {Promise<User | null>} User object or null if not found
   */
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', uid));
      return userDoc.exists() ? (userDoc.data() as User) : null;
    } catch (error) {
      ErrorHandler.handle(error, 'getUserProfile');
      return null;
    }
  }

  /**
   * Update user profile
   * @param {string} uid - User ID
   * @param {Partial<User>} data - Data to update
   * @returns {Promise<void>}
   */
  async updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(this.db, 'users', uid), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      ErrorHandler.log(`User profile updated for ${uid}`);
    } catch (error) {
      ErrorHandler.handle(error, 'updateUserProfile');
      throw error;
    }
  }

  /**
   * Query collection with constraints
   * @param {string} collectionName - Collection name
   * @param {QueryConstraint[]} constraints - Query constraints
   * @returns {Promise<any[]>} Array of documents
   */
  async queryCollection(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<any[]> {
    try {
      const q = query(collection(this.db, collectionName), ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      ErrorHandler.handle(error, `queryCollection(${collectionName})`);
      return [];
    }
  }

  /**
   * Get document from collection
   * @param {string} collectionName - Collection name
   * @param {string} docId - Document ID
   * @returns {Promise<any | null>} Document data or null
   */
  async getDocument(collectionName: string, docId: string): Promise<any | null> {
    try {
      const docSnapshot = await getDoc(
        doc(this.db, collectionName, docId)
      );
      return docSnapshot.exists()
        ? { id: docSnapshot.id, ...docSnapshot.data() }
        : null;
    } catch (error) {
      ErrorHandler.handle(error, `getDocument(${collectionName}/${docId})`);
      return null;
    }
  }

  /**
   * Save document to collection
   * @param {string} collectionName - Collection name
   * @param {string} docId - Document ID
   * @param {any} data - Document data
   * @returns {Promise<void>}
   */
  async saveDocument(collectionName: string, docId: string, data: any): Promise<void> {
    try {
      await setDoc(doc(this.db, collectionName, docId), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      ErrorHandler.log(`Document saved: ${collectionName}/${docId}`);
    } catch (error) {
      ErrorHandler.handle(error, `saveDocument(${collectionName}/${docId})`);
      throw error;
    }
  }

  /**
   * Delete document from collection
   * @param {string} collectionName - Collection name
   * @param {string} docId - Document ID
   * @returns {Promise<void>}
   */
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.db, collectionName, docId));
      ErrorHandler.log(`Document deleted: ${collectionName}/${docId}`);
    } catch (error) {
      ErrorHandler.handle(error, `deleteDocument(${collectionName}/${docId})`);
      throw error;
    }
  }
}

// Export singleton instance
export const firebaseService = FirebaseService.getInstance();
