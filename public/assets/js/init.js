/**
 * Application Initialization
 * Initialize all services and utilities
 */

// Load toast system first
document.write('<script src="../assets/js/toast-system.js"></script>');

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing application...');

    // Initialize lazy loader
    if (window.lazyLoader) {
        window.lazyLoader.observeImages();
        console.log('✅ Lazy loader initialized');
    }

    // Initialize performance monitor
    if (window.performanceMonitor) {
        const metrics = window.performanceMonitor.getMetrics();
        console.log('📊 Performance:', metrics);
    }

    // Initialize auth service
    if (window.authService) {
        console.log('🔐 Auth service ready');
    }

    // Listen for app errors
    window.addEventListener('app-error', (event) => {
        if (window.showToast) {
            window.showToast(event.detail.message, 'error');
        }
    });

    console.log('✅ Application initialized');
});
