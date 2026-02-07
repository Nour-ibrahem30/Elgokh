/**
 * Real-time Sync Service
 * Sync data in real-time with Firebase
 */

class RealtimeSync {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
        this.listeners = new Map();
        this.syncEnabled = true;
    }

    /**
     * Subscribe to collection changes
     */
    subscribe(collection, callback) {
        if (!this.syncEnabled) return null;

        const unsubscribe = this.firebaseService.db
            .collection(collection)
            .onSnapshot(
                (snapshot) => {
                    const changes = snapshot.docChanges().map(change => ({
                        type: change.type,
                        doc: { id: change.doc.id, ...change.doc.data() }
                    }));
                    
                    callback(changes);
                },
                (error) => {
                    console.error(`Sync error for ${collection}:`, error);
                }
            );

        this.listeners.set(collection, unsubscribe);
        return unsubscribe;
    }

    /**
     * Subscribe to specific document
     */
    subscribeToDoc(collection, docId, callback) {
        if (!this.syncEnabled) return null;

        const unsubscribe = this.firebaseService.db
            .collection(collection)
            .doc(docId)
            .onSnapshot(
                (doc) => {
                    if (doc.exists) {
                        callback({ id: doc.id, ...doc.data() });
                    }
                },
                (error) => {
                    console.error(`Sync error for ${collection}/${docId}:`, error);
                }
            );

        this.listeners.set(`${collection}_${docId}`, unsubscribe);
        return unsubscribe;
    }

    /**
     * Unsubscribe from collection
     */
    unsubscribe(collection) {
        const unsubscribe = this.listeners.get(collection);
        if (unsubscribe) {
            unsubscribe();
            this.listeners.delete(collection);
        }
    }

    /**
     * Unsubscribe from all
     */
    unsubscribeAll() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners.clear();
    }

    /**
     * Enable/disable sync
     */
    toggleSync(enabled) {
        this.syncEnabled = enabled;
        if (!enabled) {
            this.unsubscribeAll();
        }
    }

    /**
     * Check if sync is enabled
     */
    isSyncEnabled() {
        return this.syncEnabled;
    }
}

export default RealtimeSync;
