// Enhanced Student Tracking System
// Replace loadStudents function in dashboard.html with this code

async function loadStudents() {
    console.log('Loading students...');
    const studentsList = document.getElementById('studentsList');
    if (!studentsList) return;
    
    try {
        // Load all users from Firestore
        const usersSnapshot = await window.firebase.firestore.getDocs(
            window.firebase.firestore.collection(db, 'users')
        );
        const students = [];
        
        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            
            // Only include students (not teachers)
            if (userData.role !== 'teacher' && userData.role !== 'admin') {
                // Get student's exam results
                const examResultsQuery = window.firebase.firestore.query(
                    window.firebase.firestore.collection(db, 'examResults'),
                    window.firebase.firestore.where('userId', '==', userDoc.id)
                );
                const examResultsSnapshot = await window.firebase.firestore.getDocs(examResultsQuery);
                
                // Get student's video watches
                const videoWatchesQuery = window.firebase.firestore.query(
                    window.firebase.firestore.collection(db, 'videoWatches'),
                    window.firebase.firestore.where('userId', '==', userDoc.id)
                );
                const videoWatchesSnapshot = await window.firebase.firestore.getDocs(videoWatchesQuery);
                
                // Calculate statistics
                const totalExams = examResultsSnapshot.size;
                const passedExams = examResultsSnapshot.docs.filter(doc => doc.data().passed).length;
                const totalVideos = videoWatchesSnapshot.size;
                
                // Calculate average score
                let averageScore = 0;
                if (totalExams > 0) {
                    const totalScore = examResultsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().score || 0), 0);
                    averageScore = Math.round(totalScore / totalExams);
                }
                
                // Get last activity
                let lastActivity = userData.createdAt || userData.lastLogin || new Date().toISOString();
                
                students.push({
                    id: userDoc.id,
                    name: userData.name || userData.displayName || 'طالب',
                    email: userData.email || '',
                    joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('ar-EG') : 'غير محدد',
                    lastActivity: new Date(lastActivity).toLocaleDateString('ar-EG'),
                    totalExams: totalExams,
                    passedExams: passedExams,
                    totalVideos: totalVideos,
                    averageScore: averageScore,
                    status: userData.active !== false ? 'نشط' : 'معلق'
                });
            }
        }
        
        if (students.length === 0) {
            studentsList.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #94a3b8;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
                    <p>لا يوجد طلاب مسجلين حالياً</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">سيظهر الطلاب هنا عند تسجيلهم في المنصة</p>
                </div>
            `;
            return;
        }
        
        // Sort by last activity (most recent first)
        students.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
        
        studentsList.innerHTML = students.map(student => `
            <div class="content-card" style="cursor: pointer;" onclick="viewStudentDetails('${student.id}')">
                <div class="card-header">
                    <div>
                        <h3 style="color: #3b82f6; margin-bottom: 0.5rem;">👤 ${student.name}</h3>
                        <p style="color: #94a3b8; font-size: 0.9rem;">📧 ${student.email}</p>
                    </div>
                    <span class="badge ${student.status === 'نشط' ? 'badge-success' : 'badge-warning'}">${student.status}</span>
                </div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1rem 0;">
                        <div style="background: rgba(59, 130, 246, 0.1); padding: 0.75rem; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #3b82f6;">${student.totalVideos}</div>
                            <div style="font-size: 0.875rem; color: #94a3b8;">فيديو مشاهد</div>
                        </div>
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 0.75rem; border-radius: 8px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #10b981;">${student.passedExams}/${student.totalExams}</div>
                            <div style="font-size: 0.875rem; color: #94a3b8;">امتحان ناجح</div>
                        </div>
                    </div>
                    <div style="background: rgba(139, 92, 246, 0.1); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #a78bfa;">${student.averageScore}%</div>
                        <div style="font-size: 0.875rem; color: #94a3b8;">متوسط الدرجات</div>
                    </div>
                    <div class="card-meta">
                        <span>📅 انضم: ${student.joinDate}</span>
                        <span>🕐 آخر نشاط: ${student.lastActivity}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Update students count if element exists
        const totalStudentsEl = document.getElementById('totalStudents');
        if (totalStudentsEl) {
            totalStudentsEl.textContent = students.length;
        }
        
        console.log('✅ Loaded students:', students.length);
        
    } catch (error) {
        console.error('Error loading students:', error);
        studentsList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #f87171;">
                <p>حدث خطأ في تحميل الطلاب</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">${error.message}</p>
            </div>
        `;
    }
}

// View student details
window.viewStudentDetails = async function(studentId) {
    try {
        // Get student data
        const studentDoc = await window.firebase.firestore.getDoc(
            window.firebase.firestore.doc(db, 'users', studentId)
        );
        
        if (!studentDoc.exists()) {
            showToast('الطالب غير موجود', 'error');
            return;
        }
        
        const student = studentDoc.data();
        
        // Get exam results
        const examResultsQuery = window.firebase.firestore.query(
            window.firebase.firestore.collection(db, 'examResults'),
            window.firebase.firestore.where('userId', '==', studentId),
            window.firebase.firestore.orderBy('completedAt', 'desc')
        );
        const examResultsSnapshot = await window.firebase.firestore.getDocs(examResultsQuery);
        
        // Get video watches
        const videoWatchesQuery = window.firebase.firestore.query(
            window.firebase.firestore.collection(db, 'videoWatches'),
            window.firebase.firestore.where('userId', '==', studentId),
            window.firebase.firestore.orderBy('watchedAt', 'desc')
        );
        const videoWatchesSnapshot = await window.firebase.firestore.getDocs(videoWatchesQuery);
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>📊 تفاصيل الطالب</h2>
                    <button class="modal-close">×</button>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #3b82f6; font-size: 1.5rem; margin-bottom: 0.5rem;">👤 ${student.name || 'طالب'}</h3>
                    <p style="color: #94a3b8;">📧 ${student.email || ''}</p>
                    <p style="color: #94a3b8; font-size: 0.875rem; margin-top: 0.5rem;">
                        📅 انضم: ${student.createdAt ? new Date(student.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}
                    </p>
                </div>
                
                <!-- Statistics -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 12px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #3b82f6;">${videoWatchesSnapshot.size}</div>
                        <div style="color: #94a3b8; font-size: 0.875rem;">فيديو مشاهد</div>
                    </div>
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 12px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #10b981;">${examResultsSnapshot.size}</div>
                        <div style="color: #94a3b8; font-size: 0.875rem;">امتحان محلول</div>
                    </div>
                    <div style="background: rgba(139, 92, 246, 0.1); padding: 1rem; border-radius: 12px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #a78bfa;">
                            ${examResultsSnapshot.size > 0 ? Math.round(examResultsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().score || 0), 0) / examResultsSnapshot.size) : 0}%
                        </div>
                        <div style="color: #94a3b8; font-size: 0.875rem;">متوسط الدرجات</div>
                    </div>
                </div>
                
                <!-- Exam Results -->
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #3b82f6; margin-bottom: 1rem;">📝 نتائج الامتحانات</h3>
                    ${examResultsSnapshot.empty ? 
                        '<p style="color: #94a3b8; text-align: center; padding: 1rem;">لم يحل أي امتحان بعد</p>' :
                        examResultsSnapshot.docs.map(doc => {
                            const result = doc.data();
                            return `
                                <div style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; border-right: 4px solid ${result.passed ? '#10b981' : '#ef4444'};">
                                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                                        <div style="flex: 1; min-width: 200px;">
                                            <h4 style="color: #f1f5f9; margin-bottom: 0.25rem;">${result.examTitle}</h4>
                                            <p style="color: #94a3b8; font-size: 0.875rem;">
                                                📅 ${new Date(result.completedAt).toLocaleDateString('ar-EG')} - 
                                                ${result.correctAnswers}/${result.totalQuestions} صحيح
                                            </p>
                                        </div>
                                        <div style="text-align: left;">
                                            <div style="font-size: 1.5rem; font-weight: bold; color: ${result.passed ? '#10b981' : '#ef4444'};">
                                                ${result.score}%
                                            </div>
                                            <span class="badge ${result.passed ? 'badge-success' : 'badge-danger'}">
                                                ${result.passed ? '✅ ناجح' : '❌ راسب'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')
                    }
                </div>
                
                <!-- Video Watches -->
                <div>
                    <h3 style="color: #3b82f6; margin-bottom: 1rem;">🎥 الفيديوهات المشاهدة</h3>
                    ${videoWatchesSnapshot.empty ? 
                        '<p style="color: #94a3b8; text-align: center; padding: 1rem;">لم يشاهد أي فيديو بعد</p>' :
                        videoWatchesSnapshot.docs.slice(0, 10).map(doc => {
                            const watch = doc.data();
                            return `
                                <div style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; border-right: 4px solid #3b82f6;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                                        <div style="flex: 1; min-width: 200px;">
                                            <h4 style="color: #f1f5f9; margin-bottom: 0.25rem;">${watch.videoTitle}</h4>
                                            <p style="color: #94a3b8; font-size: 0.875rem;">
                                                📅 ${watch.watchedAt ? new Date(watch.watchedAt.toDate()).toLocaleDateString('ar-EG') : 'غير محدد'}
                                            </p>
                                        </div>
                                        <span class="badge badge-success">✅ مكتمل</span>
                                    </div>
                                </div>
                            `;
                        }).join('')
                    }
                    ${videoWatchesSnapshot.size > 10 ? `<p style="color: #94a3b8; text-align: center; margin-top: 1rem; font-size: 0.875rem;">وأكثر من ${videoWatchesSnapshot.size - 10} فيديو آخر...</p>` : ''}
                </div>
                
                <div class="form-actions" style="margin-top: 2rem;">
                    <button type="button" class="btn btn-secondary close-modal">إغلاق</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.close-modal');
        const overlay = modal.querySelector('.modal-overlay');
        
        const closeModal = () => modal.remove();
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
    } catch (error) {
        console.error('Error viewing student details:', error);
        showToast('خطأ في عرض تفاصيل الطالب: ' + error.message, 'error');
    }
};
