/**
 * Cache Manager
 * Manages caching strategy for better performance
 */

class CacheManager {
    constructor() {
        this.cache = new Map();
        this.maxAge = 3600000; // 1 hour
        this.maxSize = 50; // Max cached items
    }

    /**
     * Set item in cache
     */
    set(key, value, maxAge = this.maxAge) {
        // Remove oldest if cache is full
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            maxAge
        });
    }

    /**
     * Get item from cache
     */
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) return null;

        // Check if expired
        if (Date.now() - item.timestamp > item.maxAge) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    /**
     * Check if key exists and is valid
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Delete item from cache
     */
    delete(key) {
        return this.cache.delete(key);
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Get cache size
     */
    size() {
        return this.cache.size;
    }

    /**
     * Fetch with cache
     */
    async fetchWithCache(url, options = {}) {
        const cacheKey = `fetch_${url}`;
        
        // Check cache first
        const cached = this.get(cacheKey);
        if (cached) {
            return cached;
        }

        // Fetch and cache
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            this.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
}

// Create singleton
const cacheManager = new CacheManager();

// Export
window.cacheManager = cacheManager;
export default cacheManager;
