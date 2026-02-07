/**
 * Lazy Loading Utility
 * Optimizes resource loading for better performance
 */

class LazyLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    /**
     * Initialize Intersection Observer
     */
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadElement(entry.target);
                            this.observer.unobserve(entry.target);
                        }
                    });
                },
                { rootMargin: '50px' }
            );
        }
    }

    /**
     * Load element (image, script, etc.)
     */
    loadElement(element) {
        if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
        }
        
        if (element.dataset.srcset) {
            element.srcset = element.dataset.srcset;
            element.removeAttribute('data-srcset');
        }

        element.classList.add('loaded');
    }

    /**
     * Observe images for lazy loading
     */
    observeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            if (this.observer) {
                this.observer.observe(img);
            } else {
                this.loadElement(img);
            }
        });
    }

    /**
     * Load script dynamically
     */
    loadScript(src, async = true) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = async;
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }

    /**
     * Load CSS dynamically
     */
    loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => resolve(link);
            link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
            document.head.appendChild(link);
        });
    }

    /**
     * Preload critical resources
     */
    preload(url, as = 'script') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = as;
        document.head.appendChild(link);
    }
}

// Create singleton
const lazyLoader = new LazyLoader();

// Auto-observe images on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => lazyLoader.observeImages());
} else {
    lazyLoader.observeImages();
}

// Export
window.lazyLoader = lazyLoader;
export default lazyLoader;
