/**
 * Secure Authentication Service
 * Handles all authentication operations with proper error handling
 */

import firebaseConfig from './firebase-config-secure.js';

class AuthService {
    constructor() {
        this.currentUser = null;
        this.authStateListeners = [];
    }

    /**
     * Initialize auth state from localStorage
     */
    init() {
        try {
            const storedUser = localStorage.getItem('currentUser');
            const storedEmail = localStorage.getItem('currentUserEmail');
            
            if (storedUser && storedEmail) {
                this.currentUser = JSON.parse(storedUser);
                this.notifyAuthStateChange(this.currentUser);
            }
        } catch (error) {
            console.error('Auth init error:', error);
            this.clearAuthData();
        }
    }

    /**
     * Login with email and password
     */
    async login(email, password) {
        try {
            // Validate inputs
            if (!email || !password) {
                throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
            }

            // Check for teacher credentials
            if (email === 'mohamednaser@gmail.com' && password === '16122003') {
                const teacherUser = {
                    uid: 'teacher-uid',
                    name: 'محمد ناصر',
                    email: email,
                    role: 'teacher'
                };
                
                this.setAuthData(teacherUser);
                return { success: true, user: teacherUser };
            }

            // For other users, would integrate with Firebase Auth
            throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');

        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.message || 'فشل تسجيل الدخول'
            };
        }
    }

    /**
     * Logout current user
     */
    async logout() {
        try {
            this.clearAuthData();
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.currentUser && !!localStorage.getItem('currentUserEmail');
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if current user is teacher
     */
    isTeacher() {
        return this.currentUser?.role === 'teacher';
    }

    /**
     * Set authentication data
     */
    setAuthData(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('currentUserEmail', user.email);
        localStorage.setItem('userRole', user.role);
        this.notifyAuthStateChange(user);
    }

    /**
     * Clear authentication data
     */
    clearAuthData() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserEmail');
        localStorage.removeItem('userRole');
        this.notifyAuthStateChange(null);
    }

    /**
     * Subscribe to auth state changes
     */
    onAuthStateChange(callback) {
        this.authStateListeners.push(callback);
        // Immediately call with current state
        callback(this.currentUser);
        
        // Return unsubscribe function
        return () => {
            this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
        };
    }

    /**
     * Notify all listeners of auth state change
     */
    notifyAuthStateChange(user) {
        this.authStateListeners.forEach(callback => {
            try {
                callback(user);
            } catch (error) {
                console.error('Auth state listener error:', error);
            }
        });
    }

    /**
     * Require authentication - redirect if not authenticated
     */
    requireAuth(redirectUrl = '../login.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    /**
     * Require teacher role - redirect if not teacher
     */
    requireTeacher(redirectUrl = '../profile.html') {
        if (!this.isAuthenticated() || !this.isTeacher()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }
}

// Create singleton instance
const authService = new AuthService();
authService.init();

// Export for use in application
export default authService;
window.authService = authService;
