/**
 * Firebase Service with Offline Support
 * Optimized Firebase operations with caching
 */

import cacheManager from './cache-manager.js';

class FirebaseService {
    constructor() {
        this.db = null;
        this.auth = null;
        this.offlineQueue = [];
    }

    /**
     * Initialize Firebase
     */
    async init(firebaseApp, firestore, auth) {
        this.db = firestore;
        this.auth = auth;
        
        // Enable offline persistence
        try {
            await this.db.enablePersistence({ synchronizeTabs: true });
            console.log('✅ Offline persistence enabled');
        } catch (err) {
            if (err.code === 'failed-precondition') {
                console.warn('⚠️ Multiple tabs open, persistence enabled in first tab only');
            } else if (err.code === 'unimplemented') {
                console.warn('⚠️ Browser doesn\'t support persistence');
            }
        }

        // Listen for online/offline
        window.addEventListener('online', () => this.syncOfflineQueue());
        window.addEventListener('offline', () => console.log('📴 Offline mode'));
    }

    /**
     * Get document with cache
     */
    async getDoc(collection, docId) {
        const cacheKey = `${collection}_${docId}`;
        
        // Check cache first
        const cached = cacheManager.get(cacheKey);
        if (cached) return cached;

        try {
            const docRef = this.db.collection(collection).doc(docId);
            const doc = await docRef.get();
            
            if (doc.exists) {
                const data = { id: doc.id, ...doc.data() };
                cacheManager.set(cacheKey, data);
                return data;
            }
            return null;
        } catch (error) {
            console.error('Get doc error:', error);
            return cached || null;
        }
    }

    /**
     * Get collection with cache
     */
    async getCollection(collection, useCache = true) {
        const cacheKey = `collection_${collection}`;
        
        if (useCache) {
            const cached = cacheManager.get(cacheKey);
            if (cached) return cached;
        }

        try {
            const snapshot = await this.db.collection(collection).get();
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            cacheManager.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Get collection error:', error);
            const cached = cacheManager.get(cacheKey);
            return cached || [];
        }
    }

    /**
     * Add document (with offline queue)
     */
    async addDoc(collection, data) {
        if (!navigator.onLine) {
            this.offlineQueue.push({ type: 'add', collection, data });
            return { id: 'pending_' + Date.now(), ...data };
        }

        try {
            const docRef = await this.db.collection(collection).add(data);
            cacheManager.delete(`collection_${collection}`);
            return { id: docRef.id, ...data };
        } catch (error) {
            console.error('Add doc error:', error);
            throw error;
        }
    }

    /**
     * Update document (with offline queue)
     */
    async updateDoc(collection, docId, data) {
        if (!navigator.onLine) {
            this.offlineQueue.push({ type: 'update', collection, docId, data });
            return true;
        }

        try {
            await this.db.collection(collection).doc(docId).update(data);
            cacheManager.delete(`${collection}_${docId}`);
            cacheManager.delete(`collection_${collection}`);
            return true;
        } catch (error) {
            console.error('Update doc error:', error);
            throw error;
        }
    }

    /**
     * Delete document (with offline queue)
     */
    async deleteDoc(collection, docId) {
        if (!navigator.onLine) {
            this.offlineQueue.push({ type: 'delete', collection, docId });
            return true;
        }

        try {
            await this.db.collection(collection).doc(docId).delete();
            cacheManager.delete(`${collection}_${docId}`);
            cacheManager.delete(`collection_${collection}`);
            return true;
        } catch (error) {
            console.error('Delete doc error:', error);
            throw error;
        }
    }

    /**
     * Sync offline queue when back online
     */
    async syncOfflineQueue() {
        if (this.offlineQueue.length === 0) return;

        console.log(`🔄 Syncing ${this.offlineQueue.length} offline operations...`);

        for (const operation of this.offlineQueue) {
            try {
                switch (operation.type) {
                    case 'add':
                        await this.db.collection(operation.collection).add(operation.data);
                        break;
                    case 'update':
                        await this.db.collection(operation.collection).doc(operation.docId).update(operation.data);
                        break;
                    case 'delete':
                        await this.db.collection(operation.collection).doc(operation.docId).delete();
                        break;
                }
            } catch (error) {
                console.error('Sync error:', error);
            }
        }

        this.offlineQueue = [];
        console.log('✅ Offline queue synced');
    }

    /**
     * Clear all caches
     */
    clearCache() {
        cacheManager.clear();
    }
}

const firebaseService = new FirebaseService();
window.firebaseService = firebaseService;
export default firebaseService;
