function getFirebaseConfig() {
    const requiredVars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID',
        'VITE_FIREBASE_DATABASE_URL'
    ];
    const env = import.meta.env;
    const missingVars = requiredVars.filter(varName => !env[varName]);
    if (missingVars.length > 0) {
        console.error('Missing required Firebase environment variables:', missingVars.join(', '));
        throw new Error('Missing Firebase configuration. Please check your .env file and ensure all required variables are set.');
    }
    return {
        apiKey: env.VITE_FIREBASE_API_KEY || '',
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
        projectId: env.VITE_FIREBASE_PROJECT_ID || '',
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: env.VITE_FIREBASE_APP_ID || '',
        measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || '',
        databaseURL: env.VITE_FIREBASE_DATABASE_URL || ''
    };
}
export const firebaseConfig = getFirebaseConfig();
