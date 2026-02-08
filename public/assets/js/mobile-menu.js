/**
 * Mobile Menu Handler
 * Handles responsive navigation and dashboard sidebar
 */

(function() {
    'use strict';

    // ========================================
    // DASHBOARD MOBILE MENU
    // ========================================
    
    function initDashboardMobileMenu() {
        const sidebar = document.querySelector('.dashboard-sidebar');
        const dashboardMain = document.querySelector('.dashboard-main');
        
        if (!sidebar || !dashboardMain) return;

        // Create mobile menu toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.innerHTML = '☰';
        toggleBtn.style.display = 'none';
        toggleBtn.setAttribute('aria-label', 'فتح القائمة');
        document.body.appendChild(toggleBtn);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'dashboard-overlay';
        document.body.appendChild(overlay);

        // Toggle menu
        function toggleMenu() {
            const isActive = sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            toggleBtn.innerHTML = isActive ? '✕' : '☰';
            toggleBtn.setAttribute('aria-label', isActive ? 'إغلاق القائمة' : 'فتح القائمة');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
        }

        // Close menu
        function closeMenu() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            toggleBtn.innerHTML = '☰';
            toggleBtn.setAttribute('aria-label', 'فتح القائمة');
            document.body.style.overflow = '';
        }

        // Event listeners
        toggleBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);

        // Close menu when clicking on sidebar links
        const sidebarLinks = sidebar.querySelectorAll('a, button');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    closeMenu();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                closeMenu();
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 1024) {
                    closeMenu();
                }
            }, 250);
        });

        console.log('✅ Dashboard mobile menu initialized');
    }

    // ========================================
    // NAVIGATION MOBILE MENU
    // ========================================
    
    function initNavigationMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navbar = document.querySelector('.navbar');
        
        if (!navMenu || !navbar) return;

        // Check if toggle button already exists
        let toggleBtn = navbar.querySelector('.nav-toggle');
        
        if (!toggleBtn) {
            // Create mobile menu toggle button
            toggleBtn = document.createElement('button');
            toggleBtn.className = 'nav-toggle';
            toggleBtn.innerHTML = '☰';
            toggleBtn.setAttribute('aria-label', 'فتح القائمة');
            
            // Insert before nav-menu
            const navContainer = navbar.querySelector('.nav-container');
            if (navContainer) {
                navContainer.appendChild(toggleBtn);
            }
        }

        // Create overlay for navigation
        let navOverlay = document.querySelector('.nav-overlay');
        if (!navOverlay) {
            navOverlay = document.createElement('div');
            navOverlay.className = 'nav-overlay';
            navOverlay.style.cssText = `
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 98;
            `;
            document.body.appendChild(navOverlay);
        }

        // Toggle menu
        function toggleNavMenu() {
            const isActive = navMenu.classList.toggle('active');
            toggleBtn.innerHTML = isActive ? '✕' : '☰';
            toggleBtn.setAttribute('aria-label', isActive ? 'إغلاق القائمة' : 'فتح القائمة');
            navOverlay.style.display = isActive ? 'block' : 'none';
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
        }

        // Close menu
        function closeNavMenu() {
            navMenu.classList.remove('active');
            toggleBtn.innerHTML = '☰';
            toggleBtn.setAttribute('aria-label', 'فتح القائمة');
            navOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }

        // Event listeners
        toggleBtn.addEventListener('click', toggleNavMenu);
        navOverlay.addEventListener('click', closeNavMenu);

        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    closeNavMenu();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeNavMenu();
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 1024) {
                    closeNavMenu();
                }
            }, 250);
        });

        console.log('✅ Navigation mobile menu initialized');
    }

    // ========================================
    // RESPONSIVE TABLES
    // ========================================
    
    function makeTablesResponsive() {
        const tables = document.querySelectorAll('table:not(.responsive-table)');
        
        tables.forEach(table => {
            // Skip if already wrapped
            if (table.parentElement.classList.contains('dashboard-table-container')) {
                return;
            }

            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'dashboard-table-container';
            
            // Wrap table
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
            
            // Add responsive class
            table.classList.add('responsive-table');
        });

        if (tables.length > 0) {
            console.log(`✅ Made ${tables.length} tables responsive`);
        }
    }

    // ========================================
    // RESPONSIVE IMAGES
    // ========================================
    
    function makeImagesResponsive() {
        const images = document.querySelectorAll('img:not([style*="max-width"])');
        
        images.forEach(img => {
            if (!img.style.maxWidth) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });

        if (images.length > 0) {
            console.log(`✅ Made ${images.length} images responsive`);
        }
    }

    // ========================================
    // TOUCH SWIPE FOR MOBILE
    // ========================================
    
    function initTouchSwipe() {
        const sidebar = document.querySelector('.dashboard-sidebar');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!sidebar && !navMenu) return;

        let touchStartX = 0;
        let touchEndX = 0;

        function handleSwipe(element, closeCallback) {
            element.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            element.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipeGesture(closeCallback);
            }, { passive: true });
        }

        function handleSwipeGesture(closeCallback) {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            // Swipe left to close (for RTL)
            if (diff > swipeThreshold) {
                closeCallback();
            }
        }

        if (sidebar) {
            handleSwipe(sidebar, () => {
                const overlay = document.querySelector('.dashboard-overlay');
                if (overlay && overlay.classList.contains('active')) {
                    overlay.click();
                }
            });
        }

        if (navMenu) {
            handleSwipe(navMenu, () => {
                const overlay = document.querySelector('.nav-overlay');
                if (overlay && overlay.style.display === 'block') {
                    overlay.click();
                }
            });
        }

        console.log('✅ Touch swipe initialized');
    }

    // ========================================
    // VIEWPORT HEIGHT FIX (MOBILE)
    // ========================================
    
    function fixViewportHeight() {
        // Fix for mobile browsers where 100vh includes address bar
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);

        console.log('✅ Viewport height fix applied');
    }

    // ========================================
    // INITIALIZE ALL
    // ========================================
    
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('🚀 Initializing mobile menu...');

        // Initialize features
        initDashboardMobileMenu();
        initNavigationMobileMenu();
        makeTablesResponsive();
        makeImagesResponsive();
        initTouchSwipe();
        fixViewportHeight();

        console.log('✅ Mobile menu initialization complete');
    }

    // Start initialization
    init();

})();
