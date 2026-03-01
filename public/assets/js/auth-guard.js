/**
 * Auth Guard - Protect pages from unauthorized access
 */

(function() {
    'use strict';

    // Check if user is authenticated
    function checkAuth() {
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        const currentUser = localStorage.getItem('currentUser');
        
        if (!currentUserEmail || !currentUser) {
            console.log('⚠️ User not authenticated');
            return false;
        }
        
        console.log('✅ User authenticated:', currentUserEmail);
        
        // Make sure page is visible
        if (document.body) {
            document.body.style.visibility = 'visible';
        }
        
        return true;
    }

    // Run auth check immediately
    checkAuth();
})();
