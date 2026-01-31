import { ref, onValue, off } from "firebase/database";
import { rtdb } from "./firebase";
import { toast } from 'react-toastify';

class NotificationService {
  constructor() {
    this.notificationsRef = null;
    this.isConnected = false;
  }

  init() {
    if (this.notificationsRef) {
      this.disconnect();
    }

    // الاستماع للإشعارات في Realtime Database
    this.notificationsRef = ref(rtdb, 'notifications');
    
    onValue(this.notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // تحويل البيانات إلى مصفوفة
        const notifications = Object.values(data);
        // جلب آخر إشعار
        const latestNotification = notifications[notifications.length - 1];
        if (latestNotification) {
          this.showNotification(latestNotification);
          
          // إشعار المتصفح إذا كان مدعوماً
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(latestNotification.title, {
              body: latestNotification.courseId ? `في المادة ${latestNotification.courseId}` : '',
              icon: '/logo192.png',
              tag: 'fdk-notification'
            });
          }
        }
      }
      this.isConnected = true;
    });

    // طلب إذن الإشعارات
    this.requestNotificationPermission();
  }

  showNotification(notification) {
    const { title, courseId } = notification;
    
    // عرض إشعار بسيط
    toast.info(`📢 ${title}${courseId ? ` - مادة ${courseId}` : ''}`, {
      position: "top-right",
      autoClose: 5000,
    });
  }
  async requestNotificationPermission() {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('تم منح إذن الإشعارات');
        }
      }
    }
  }

  disconnect() {
    if (this.notificationsRef) {
      off(this.notificationsRef);
      this.notificationsRef = null;
      this.isConnected = false;
    }
  }

  isConnectedToServer() {
    return this.isConnected;
  }
}

export default new NotificationService();