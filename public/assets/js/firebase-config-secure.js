/**
 * Secure Firebase Configuration
 * Reads from environment variables for security
 */

// Firebase configuration from environment or fallback
export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAU0CCiQNrPEYpTNU4rAwmOmPUZnjb2FoU",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "a-platform-for-learning.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "a-platform-for-learning",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "a-platform-for-learning.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "764579707883",
    appId: process.env.FIREBASE_APP_ID || "1:764579707883:web:5456e2348354cc58fab7ae",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-4P972FP416",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://a-platform-for-learning-default-rtdb.firebaseio.com"
};

// Validate configuration
export function validateFirebaseConfig(): boolean {
    const required = ['apiKey', 'authDomain', 'projectId'];
    return required.every(key => firebaseConfig[key as keyof typeof firebaseConfig]);
}

// Export for use in application
export default firebaseConfig;
