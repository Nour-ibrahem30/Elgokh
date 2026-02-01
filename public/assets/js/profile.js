import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, getDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;
let currentFilter = 'all';
const logoutBtn = document.getElementById('logoutBtn');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
async function checkAuth() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = '/login.html';
                resolve(null);
                return;
            }
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                window.location.href = '/login.html';
                resolve(null);
                return;
            }
            const userData = userDoc.data();
            if (userData.role === 'teacher') {
                window.location.href = '/dashboard.html';
                resolve(null);
                return;
            }
            currentUser = userData;
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userEmail').textContent = userData.email;
            resolve(userData);
        });
    });
}
async function loadProgress() {
    if (!currentUser)
        return;
    try {
        const [videosSnap, examsSnap, progressSnap] = await Promise.all([
            getDocs(collection(db, 'lessons')),
            getDocs(collection(db, 'exams')),
            getDocs(query(collection(db, 'progress'), where('studentId', '==', currentUser.uid)))
        ]);
        const totalVideos = videosSnap.size;
        const totalExams = examsSnap.size;
        let completedVideos = 0;
        let completedExams = 0;
        progressSnap.forEach((doc) => {
            const progress = doc.data();
            completedVideos += progress.lessonsCompleted?.length || 0;
            completedExams += progress.examsCompleted?.length || 0;
        });
        document.getElementById('completedVideos').textContent = completedVideos.toString();
        document.getElementById('completedExams').textContent = completedExams.toString();
        document.getElementById('totalVideosCount').textContent = totalVideos.toString();
        document.getElementById('totalExamsCount').textContent = totalExams.toString();
        document.getElementById('watchedVideos').textContent = completedVideos.toString();
        document.getElementById('passedExams').textContent = completedExams.toString();
        const videoProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
        const examProgress = totalExams > 0 ? Math.round((completedExams / totalExams) * 100) : 0;
        document.getElementById('videoProgress').textContent = `${videoProgress}%`;
        document.getElementById('examProgress').textContent = `${examProgress}%`;
        const videoBar = document.getElementById('videoProgressBar');
        const examBar = document.getElementById('examProgressBar');
        videoBar.style.width = `${videoProgress}%`;
        examBar.style.width = `${examProgress}%`;
        videoBar.parentElement?.setAttribute('aria-valuenow', videoProgress.toString());
        examBar.parentElement?.setAttribute('aria-valuenow', examProgress.toString());
    }
    catch (error) {
        console.error('Error loading progress:', error);
    }
}
async function loadTodos() {
    if (!currentUser || !todoList)
        return;
    try {
        const todosQuery = query(collection(db, 'todos'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(todosQuery);
        if (snapshot.empty) {
            todoList.innerHTML = '<div class="empty-state"><p>لا توجد مهام</p></div>';
            return;
        }
        todoList.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const todo = { id: docSnap.id, ...docSnap.data() };
            if (shouldShowTodo(todo)) {
                const item = createTodoItem(todo);
                todoList.appendChild(item);
            }
        });
        if (todoList.children.length === 0) {
            todoList.innerHTML = '<div class="empty-state"><p>لا توجد مهام</p></div>';
        }
    }
    catch (error) {
        console.error('Error loading todos:', error);
        todoList.innerHTML = '<div class="error-state"><p>حدث خطأ</p></div>';
    }
}
function shouldShowTodo(todo) {
    if (currentFilter === 'all')
        return true;
    if (currentFilter === 'completed')
        return todo.completed;
    if (currentFilter === 'pending')
        return !todo.completed;
    return true;
}
function createTodoItem(todo) {
    const div = document.createElement('div');
    div.className = `todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`;
    const dueDate = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('ar-EG') : '';
    div.innerHTML = `
    <div class="todo-checkbox">
      <input type="checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
    </div>
    <div class="todo-content">
      <h4 class="todo-title">${todo.title}</h4>
      ${todo.description ? `<p class="todo-description">${todo.description}</p>` : ''}
      <div class="todo-meta">
        <span class="todo-priority">${getPriorityLabel(todo.priority)}</span>
        ${dueDate ? `<span class="todo-due">📅 ${dueDate}</span>` : ''}
      </div>
    </div>
    <div class="todo-actions">
      <button class="btn-icon delete-todo" data-id="${todo.id}" aria-label="حذف">🗑️</button>
    </div>
  `;
    const checkbox = div.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => handleToggleTodo(todo.id, checkbox.checked));
    const deleteBtn = div.querySelector('.delete-todo');
    deleteBtn.addEventListener('click', () => handleDeleteTodo(todo.id));
    return div;
}
function getPriorityLabel(priority) {
    const labels = {
        high: 'عالية',
        medium: 'متوسطة',
        low: 'منخفضة'
    };
    return labels[priority] || 'متوسطة';
}
async function handleToggleTodo(id, completed) {
    try {
        await updateDoc(doc(db, 'todos', id), { completed });
        loadTodos();
    }
    catch (error) {
        console.error('Error toggling todo:', error);
    }
}
async function handleDeleteTodo(id) {
    if (!confirm('هل أنت متأكد من حذف هذه المهمة؟'))
        return;
    try {
        await deleteDoc(doc(db, 'todos', id));
        loadTodos();
    }
    catch (error) {
        console.error('Error deleting todo:', error);
    }
}
function showAddTodoModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <h2 class="modal-title">إضافة مهمة جديدة</h2>
      <form id="addTodoForm" class="form">
        <div class="form-group">
          <label for="todoTitle" class="form-label">العنوان</label>
          <input type="text" id="todoTitle" class="form-input" required>
        </div>
        <div class="form-group">
          <label for="todoDescription" class="form-label">الوصف (اختياري)</label>
          <textarea id="todoDescription" class="form-input" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="todoPriority" class="form-label">الأولوية</label>
          <select id="todoPriority" class="form-input">
            <option value="low">منخفضة</option>
            <option value="medium" selected>متوسطة</option>
            <option value="high">عالية</option>
          </select>
        </div>
        <div class="form-group">
          <label for="todoDueDate" class="form-label">تاريخ الاستحقاق (اختياري)</label>
          <input type="date" id="todoDueDate" class="form-input">
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">إضافة</button>
          <button type="button" class="btn btn-secondary close-modal">إلغاء</button>
        </div>
      </form>
    </div>
  `;
    document.body.appendChild(modal);
    const form = modal.querySelector('#addTodoForm');
    const closeBtn = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('todoTitle').value;
        const description = document.getElementById('todoDescription').value;
        const priority = document.getElementById('todoPriority').value;
        const dueDate = document.getElementById('todoDueDate').value;
        const todo = {
            userId: currentUser.uid,
            title,
            description: description || undefined,
            completed: false,
            priority,
            dueDate: dueDate || undefined,
            createdAt: new Date().toISOString()
        };
        try {
            await addDoc(collection(db, 'todos'), todo);
            modal.remove();
            loadTodos();
        }
        catch (error) {
            console.error('Error adding todo:', error);
            alert('حدث خطأ أثناء إضافة المهمة');
        }
    });
    closeBtn.addEventListener('click', () => modal.remove());
    overlay.addEventListener('click', () => modal.remove());
}
async function loadExamResults() {
    if (!currentUser)
        return;
    try {
        const resultsQuery = query(collection(db, 'examResults'), where('studentId', '==', currentUser.uid), orderBy('completedAt', 'desc'));
        const snapshot = await getDocs(resultsQuery);
        const container = document.getElementById('examResults');
        if (snapshot.empty) {
            container.innerHTML = '<div class="empty-state"><p>لا توجد نتائج</p></div>';
            return;
        }
        container.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const result = docSnap.data();
            const percentage = Math.round((result.score / result.totalQuestions) * 100);
            const passed = percentage >= 50;
            const item = document.createElement('div');
            item.className = `result-item ${passed ? 'passed' : 'failed'}`;
            item.innerHTML = `
        <div class="result-info">
          <h4>امتحان</h4>
          <p>${new Date(result.completedAt).toLocaleDateString('ar-EG')}</p>
        </div>
        <div class="result-score">
          <span class="score-value">${percentage}%</span>
          <span class="score-label">${result.score}/${result.totalQuestions}</span>
        </div>
        <div class="result-status">
          <span class="${passed ? 'badge-success' : 'badge-danger'}">
            ${passed ? 'ناجح' : 'راسب'}
          </span>
        </div>
      `;
            container.appendChild(item);
        });
    }
    catch (error) {
        console.error('Error loading exam results:', error);
    }
}
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter') || 'all';
        loadTodos();
    });
});
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        document.querySelectorAll('.incomplete-content').forEach(content => {
            content.classList.toggle('active', content.id === `incomplete${tab?.charAt(0).toUpperCase()}${tab?.slice(1)}`);
        });
    });
});
addTodoBtn?.addEventListener('click', showAddTodoModal);
logoutBtn?.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = '/';
    }
    catch (error) {
        console.error('Logout error:', error);
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    if (currentUser) {
        loadProgress();
        loadTodos();
        loadExamResults();
    }
});
//# sourceMappingURL=profile.js.map