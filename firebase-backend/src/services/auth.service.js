/**
 * Authentication Service
 * Handles user registration, login, and role management
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { auth } from '../config/firebase.js';
import { createUserProfile } from './firestore.service.js';

/**
 * Register new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User full name
 * @param {string} role - User role (student/teacher)
 * @returns {Promise<Object>} User data
 */
export async function registerUser(email, password, name, role = 'student') {
  try {
    // Validate role
    if (!['student', 'teacher'].includes(role)) {
      throw new Error('Invalid role. Must be "student" or "teacher"');
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await createUserProfile({
      uid: user.uid,
      name,
      email: user.email,
      role
    });

    console.log(`✅ User registered: ${email} (${role})`);

    return {
      uid: user.uid,
      email: user.email,
      name,
      role
    };
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    throw error;
  }
}

/**
 * Sign in user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data
 */
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log(`✅ User logged in: ${email}`);

    return {
      uid: user.uid,
      email: user.email,
      token: await user.getIdToken()
    };
  } catch (error) {
    console.error('❌ Login error:', error.message);
    throw error;
  }
}

/**
 * Sign in with Google
 * @param {string} role - User role for new users
 * @returns {Promise<Object>} User data
 */
export async function loginWithGoogle(role = 'student') {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user profile exists, if not create one
    await createUserProfile({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      role
    });

    console.log(`✅ Google sign-in: ${user.email}`);

    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      token: await user.getIdToken()
    };
  } catch (error) {
    console.error('❌ Google sign-in error:', error.message);
    throw error;
  }
}

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log('✅ User logged out');
  } catch (error) {
    console.error('❌ Logout error:', error.message);
    throw error;
  }
}

/**
 * Get current authenticated user
 * @returns {Object|null} Current user or null
 */
export function getCurrentUser() {
  return auth.currentUser;
}
