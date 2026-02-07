"use strict";
const firebaseConfig = {
    apiKey: "AIzaSyCxKJoFBDVdEOExjVFbLhKrKHAjHxSKvWY",
    authDomain: "mentor-teach.firebaseapp.com",
    projectId: "mentor-teach",
    storageBucket: "mentor-teach.appspot.com",
    messagingSenderId: "654631576444",
    appId: "1:654631576444:web:f4e1e58b46f65ef9206be0"
};
let app;
let auth;
let db;
function initFirebase() {
    if (window.firebase && window.firebase.app) {
        app = window.firebase.initializeApp(firebaseConfig);
        auth = window.firebase.auth(app);
        db = window.firebase.firestore(app);
        console.log('✅ Firebase initialized successfully');
        return true;
    }
    return false;
}
let retries = 0;
const firebaseInitInterval = setInterval(() => {
    if (initFirebase()) {
        clearInterval(firebaseInitInterval);
    }
    else if (retries++ > 10) {
        clearInterval(firebaseInitInterval);
        console.error('❌ Firebase failed to load');
    }
}, 100);
let currentUser = null;
function generateInitials(name) {
    return name
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    }[type];
    toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
    if (!document.getElementById('toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(30, 41, 59, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        border-left: 4px solid;
      }
      
      .toast-success { border-left-color: #10b981; }
      .toast-error { border-left-color: #ef4444; }
      .toast-info { border-left-color: #3b82f6; }
      
      .toast-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #f1f5f9;
      }
      
      .toast-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
      }
      
      .toast-message {
        flex: 1;
        font-size: 0.95rem;
      }
      
      .toast-close {
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
      }
      
      .toast-close:hover {
        background: rgba(148, 163, 184, 0.2);
        color: #f1f5f9;
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
        document.head.appendChild(styles);
    }
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}
function extractNameFromEmail(email) {
    const namePart = email.split('@')[0];
    return namePart
        .replace(/[._]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
function updateProfileUI(name, email) {
    console.log('🔄 updateProfileUI called with:', { name, email });
    if (!name || name.trim().length < 1) {
        name = extractNameFromEmail(email);
    }
    const nameEl = document.getElementById('userName');
    const emailEl = document.getElementById('userEmail');
    const initialsEl = document.getElementById('userInitials');
    console.log('📋 Found elements:', { nameEl: !!nameEl, emailEl: !!emailEl, initialsEl: !!initialsEl });
    const attempts = [0, 50, 100, 200, 500];
    attempts.forEach(delay => {
        setTimeout(() => {
            const nameEl = document.getElementById('userName');
            const emailEl = document.getElementById('userEmail');
            const initialsEl = document.getElementById('userInitials');
            console.log(`[${delay}ms] Attempt to update:`, { nameEl: !!nameEl, emailEl: !!emailEl, initialsEl: !!initialsEl });
            if (nameEl) {
                nameEl.textContent = name;
                console.log(`✅ Updated userName to: ${name}`);
            }
            if (emailEl) {
                emailEl.textContent = email;
                console.log(`✅ Updated userEmail to: ${email}`);
            }
            if (initialsEl) {
                initialsEl.textContent = generateInitials(name);
                console.log(`✅ Updated userInitials to: ${generateInitials(name)}`);
            }
        }, delay);
    });
}
async function checkAuth() {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (!auth)
                return;
            clearInterval(checkInterval);
            auth.onAuthStateChanged(async (user) => {
                if (!user) {
                    const storedEmail = localStorage.getItem('currentUserEmail');
                    const storedUser = localStorage.getItem('currentUser');
                    if (storedEmail && storedUser) {
                        try {
                            const userData = JSON.parse(storedUser);
                            const displayName = userData.name || extractNameFromEmail(storedEmail);
                            currentUser = {
                                uid: userData.uid || 'local-user',
                                name: displayName,
                                email: storedEmail,
                                role: localStorage.getItem('userRole') || 'student',
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            };
                            updateProfileUI(displayName, storedEmail);
                            showToast(`مرحباً ${displayName.split(' ')[0]}`, 'success');
                            resolve();
                            return;
                        }
                        catch (error) {
                            console.error('Error parsing stored user:', error);
                        }
                    }
                    showToast('يجب تسجيل الدخول', 'error');
                    setTimeout(() => {
                        window.location.href = '/public/pages/login.html';
                    }, 2000);
                    resolve();
                    return;
                }
                try {
                    const userRef = window.firebase.firestore.doc(db, 'users', user.uid);
                    const snap = await window.firebase.firestore.getDoc(userRef);
                    if (!snap.exists()) {
                        const displayName = user.displayName || extractNameFromEmail(user.email || '');
                        const newUser = {
                            uid: user.uid,
                            name: displayName,
                            email: user.email || '',
                            role: 'student',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        };
                        await window.firebase.firestore.setDoc(userRef, newUser);
                        currentUser = newUser;
                    }
                    else {
                        currentUser = snap.data();
                    }
                    if (currentUser.role === 'teacher') {
                        window.location.href = '/public/pages/dashboard.html';
                        resolve();
                        return;
                    }
                    updateProfileUI(currentUser.name, currentUser.email);
                    showToast(`مرحباً ${currentUser.name.split(' ')[0]}`, 'success');
                    resolve();
                }
                catch (err) {
                    console.error(err);
                    showToast('خطأ في تحميل بيانات المستخدم', 'error');
                    resolve();
                }
            });
        }, 50);
    });
}
async function saveProfileData(data) {
    if (!currentUser) {
        showToast('لم يتم العثور على المستخدم', 'error');
        return;
    }
    try {
        const userRef = window.firebase.firestore.doc(db, 'users', currentUser.uid);
        await window.firebase.firestore.updateDoc(userRef, {
            name: data.name,
            phone: data.phone || '',
            bio: data.bio || '',
            updatedAt: new Date().toISOString(),
        });
        currentUser.name = data.name;
        updateProfileUI(currentUser.name, currentUser.email);
        showToast('تم حفظ البيانات بنجاح', 'success');
    }
    catch (e) {
        console.error('Error saving profile:', e);
        showToast('فشل حفظ البيانات', 'error');
    }
}
async function loadTodos() {
    if (!currentUser)
        return;
    const list = document.getElementById('todoList');
    if (!list)
        return;
    list.innerHTML = '';
    try {
        const q = window.firebase.firestore.query(window.firebase.firestore.collection(db, 'todos'), window.firebase.firestore.where('userId', '==', currentUser.uid));
        const snap = await window.firebase.firestore.getDocs(q);
        if (snap.empty) {
            list.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 2rem;">لا توجد مهام حالياً</p>';
            return;
        }
        snap.forEach((docSnap) => {
            const todo = docSnap.data();
            const div = document.createElement('div');
            div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            div.innerHTML = `
        <div class="todo-checkbox">
          <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${docSnap.id}">
        </div>
        <div class="todo-content">
          <h4 class="todo-title">${todo.title}</h4>
          ${todo.description ? `<p class="todo-description">${todo.description}</p>` : ''}
        </div>
        <div class="todo-actions">
          <button class="delete-todo" data-id="${docSnap.id}" aria-label="حذف المهمة">🗑️</button>
        </div>
      `;
            const checkbox = div.querySelector('input[type="checkbox"]');
            const deleteBtn = div.querySelector('.delete-todo');
            checkbox.addEventListener('change', async () => {
                try {
                    const todoRef = window.firebase.firestore.doc(db, 'todos', docSnap.id);
                    await window.firebase.firestore.updateDoc(todoRef, {
                        completed: checkbox.checked,
                        updatedAt: new Date().toISOString()
                    });
                    div.classList.toggle('completed');
                    showToast(checkbox.checked ? 'تم إكمال المهمة' : 'تم إلغاء الإكمال', 'success');
                }
                catch (error) {
                    console.error('Error updating todo:', error);
                    showToast('حدث خطأ في تحديث المهمة', 'error');
                }
            });
            deleteBtn.addEventListener('click', async () => {
                if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
                    try {
                        const todoRef = window.firebase.firestore.doc(db, 'todos', docSnap.id);
                        await window.firebase.firestore.deleteDoc(todoRef);
                        div.remove();
                        showToast('تم حذف المهمة بنجاح', 'success');
                    }
                    catch (error) {
                        console.error('Error deleting todo:', error);
                        showToast('حدث خطأ في حذف المهمة', 'error');
                    }
                }
            });
            list.appendChild(div);
        });
    }
    catch (error) {
        console.error('Error loading todos:', error);
        list.innerHTML = '<p style="color: #ef4444;">حدث خطأ في تحميل المهام</p>';
    }
}
async function addTodo(title, description, priority = 'medium') {
    if (!currentUser) {
        showToast('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    if (!title.trim()) {
        showToast('يرجى إدخال عنوان المهمة', 'error');
        return;
    }
    try {
        await window.firebase.firestore.addDoc(window.firebase.firestore.collection(db, 'todos'), {
            userId: currentUser.uid,
            title: title.trim(),
            description: description?.trim() || '',
            completed: false,
            priority,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        showToast('تم إضافة المهمة بنجاح', 'success');
        loadTodos();
    }
    catch (error) {
        console.error('Error adding todo:', error);
        showToast('حدث خطأ في إضافة المهمة', 'error');
    }
}
function initializeEventListeners() {
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('editName');
            const phoneInput = document.getElementById('editPhone');
            const bioInput = document.getElementById('editBio');
            if (!nameInput?.value.trim()) {
                showToast('يرجى إدخال الاسم', 'error');
                return;
            }
            await saveProfileData({
                name: nameInput.value.trim(),
                phone: phoneInput?.value.trim() || '',
                bio: bioInput?.value.trim() || ''
            });
        });
    }
    const addTodoBtn = document.getElementById('addTodoBtn');
    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const title = prompt('عنوان المهمة:');
            if (!title)
                return;
            const description = prompt('الوصف (اختياري):') || undefined;
            addTodo(title, description);
        });
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                try {
                    await auth.signOut();
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('currentUserEmail');
                    localStorage.removeItem('userRole');
                    showToast('تم تسجيل الخروج بنجاح', 'success');
                    setTimeout(() => {
                        window.location.href = '/public/pages/login.html';
                    }, 1000);
                }
                catch (error) {
                    console.error('Logout error:', error);
                    showToast('حدث خطأ في تسجيل الخروج', 'error');
                }
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing profile page...');
    try {
        await checkAuth();
        if (currentUser) {
            console.log('✅ User authenticated');
            await loadTodos();
            initializeEventListeners();
            console.log('🎉 Profile page ready');
        }
    }
    catch (error) {
        console.error('❌ Error initializing:', error);
        showToast('حدث خطأ في تحميل الصفحة', 'error');
    }
});
