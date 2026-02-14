// Minimal main.js - removed unused Three.js and GSAP code for better performance
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mobile menu toggle
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

navbarToggle?.addEventListener('click', () => {
    const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
    navbarToggle.setAttribute('aria-expanded', (!isExpanded).toString());
    navbarMenu?.classList.toggle('active');
});

// Export for other modules
export { app, db };
