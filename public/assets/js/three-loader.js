/**
 * Three.js Lazy Loader
 * Load Three.js only when needed
 */

class ThreeJSLoader {
    constructor() {
        this.loaded = false;
        this.loading = false;
        this.callbacks = [];
    }

    /**
     * Load Three.js library
     */
    async load() {
        if (this.loaded) {
            return window.THREE;
        }

        if (this.loading) {
            return new Promise((resolve) => {
                this.callbacks.push(resolve);
            });
        }

        this.loading = true;

        try {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
            this.loaded = true;
            this.loading = false;
            
            // Resolve all waiting callbacks
            this.callbacks.forEach(cb => cb(window.THREE));
            this.callbacks = [];
            
            return window.THREE;
        } catch (error) {
            this.loading = false;
            console.error('Failed to load Three.js:', error);
            throw error;
        }
    }

    /**
     * Load script helper
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize Three.js scene (only if element exists)
     */
    async initIfNeeded(canvasId = 'three-canvas') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const THREE = await this.load();
        return { THREE, canvas };
    }
}

// Create singleton
const threeJSLoader = new ThreeJSLoader();

// Export
window.threeJSLoader = threeJSLoader;
export default threeJSLoader;
