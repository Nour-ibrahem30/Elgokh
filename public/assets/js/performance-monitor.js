/**
 * Performance Monitor
 * Track and optimize application performance
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoad: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            domInteractive: 0,
            domComplete: 0
        };
        this.init();
    }

    /**
     * Initialize performance monitoring
     */
    init() {
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                setTimeout(() => this.collectMetrics(), 0);
            });
        }
    }

    /**
     * Collect performance metrics
     */
    collectMetrics() {
        const timing = window.performance.timing;
        const navigation = window.performance.navigation;

        this.metrics = {
            pageLoad: timing.loadEventEnd - timing.navigationStart,
            firstPaint: timing.responseStart - timing.navigationStart,
            firstContentfulPaint: timing.domContentLoadedEventEnd - timing.navigationStart,
            domInteractive: timing.domInteractive - timing.navigationStart,
            domComplete: timing.domComplete - timing.navigationStart,
            navigationType: navigation.type
        };

        // Log in development
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Performance Metrics:', this.metrics);
        }
    }

    /**
     * Measure function execution time
     */
    measure(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    }

    /**
     * Measure async function execution time
     */
    async measureAsync(name, fn) {
        const start = performance.now();
        const result = await fn();
        const end = performance.now();
        
        console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    }

    /**
     * Get metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }

    /**
     * Check if page load is slow
     */
    isSlowLoad() {
        return this.metrics.pageLoad > 3000; // 3 seconds
    }

    /**
     * Get performance score (0-100)
     */
    getScore() {
        const load = this.metrics.pageLoad;
        if (load < 1000) return 100;
        if (load < 2000) return 90;
        if (load < 3000) return 70;
        if (load < 5000) return 50;
        return 30;
    }
}

// Create singleton
const performanceMonitor = new PerformanceMonitor();

// Export
window.performanceMonitor = performanceMonitor;
export default performanceMonitor;
