/**
 * Data Migration Utility
 * Migrate data from localStorage to Firebase
 */

class DataMigration {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
        this.migrationLog = [];
    }

    /**
     * Migrate all localStorage data to Firebase
     */
    async migrateAll() {
        console.log('🔄 Starting data migration...');
        
        try {
            await this.migrateVideos();
            await this.migrateExams();
            await this.migrateNotes();
            await this.migrateMaterials();
            await this.migrateTodos();
            
            console.log('✅ Migration completed successfully');
            return { success: true, log: this.migrationLog };
        } catch (error) {
            console.error('❌ Migration failed:', error);
            return { success: false, error, log: this.migrationLog };
        }
    }

    /**
     * Migrate videos
     */
    async migrateVideos() {
        const videos = this.getFromLocalStorage('videos', []);
        if (videos.length === 0) return;

        console.log(`📹 Migrating ${videos.length} videos...`);
        
        for (const video of videos) {
            try {
                await this.firebaseService.addDoc('lessons', {
                    ...video,
                    migratedAt: new Date().toISOString()
                });
                this.log('video', video.id, 'success');
            } catch (error) {
                this.log('video', video.id, 'failed', error.message);
            }
        }
    }

    /**
     * Migrate exams
     */
    async migrateExams() {
        const exams = this.getFromLocalStorage('exams', []);
        if (exams.length === 0) return;

        console.log(`📝 Migrating ${exams.length} exams...`);
        
        for (const exam of exams) {
            try {
                await this.firebaseService.addDoc('exams', {
                    ...exam,
                    migratedAt: new Date().toISOString()
                });
                this.log('exam', exam.id, 'success');
            } catch (error) {
                this.log('exam', exam.id, 'failed', error.message);
            }
        }
    }

    /**
     * Migrate notes
     */
    async migrateNotes() {
        const notes = this.getFromLocalStorage('notes', []);
        if (notes.length === 0) return;

        console.log(`📌 Migrating ${notes.length} notes...`);
        
        for (const note of notes) {
            try {
                await this.firebaseService.addDoc('notes', {
                    ...note,
                    migratedAt: new Date().toISOString()
                });
                this.log('note', note.id, 'success');
            } catch (error) {
                this.log('note', note.id, 'failed', error.message);
            }
        }
    }

    /**
     * Migrate materials
     */
    async migrateMaterials() {
        const materials = this.getFromLocalStorage('materials', []);
        if (materials.length === 0) return;

        console.log(`📚 Migrating ${materials.length} materials...`);
        
        for (const material of materials) {
            try {
                await this.firebaseService.addDoc('materials', {
                    ...material,
                    migratedAt: new Date().toISOString()
                });
                this.log('material', material.id, 'success');
            } catch (error) {
                this.log('material', material.id, 'failed', error.message);
            }
        }
    }

    /**
     * Migrate todos
     */
    async migrateTodos() {
        const todos = this.getFromLocalStorage('todos', []);
        if (todos.length === 0) return;

        console.log(`✅ Migrating ${todos.length} todos...`);
        
        for (const todo of todos) {
            try {
                await this.firebaseService.addDoc('todos', {
                    ...todo,
                    migratedAt: new Date().toISOString()
                });
                this.log('todo', todo.id, 'success');
            } catch (error) {
                this.log('todo', todo.id, 'failed', error.message);
            }
        }
    }

    /**
     * Get data from localStorage
     */
    getFromLocalStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`Error reading ${key} from localStorage:`, error);
            return defaultValue;
        }
    }

    /**
     * Log migration result
     */
    log(type, id, status, error = null) {
        this.migrationLog.push({
            type,
            id,
            status,
            error,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Export migration log
     */
    exportLog() {
        return JSON.stringify(this.migrationLog, null, 2);
    }

    /**
     * Clear localStorage after successful migration
     */
    clearLocalStorage() {
        const keys = ['videos', 'exams', 'notes', 'materials', 'todos'];
        keys.forEach(key => localStorage.removeItem(key));
        console.log('🗑️ LocalStorage cleared');
    }
}

export default DataMigration;
