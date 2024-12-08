import { StorageService } from '../storage/StorageService';

export type NotificationType = 'status_change' | 'stage_change' | 'contact_added' | 'placement_added';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  data: any;
  read: boolean;
  createdAt: string;
}

export class NotificationService {
  private static STORAGE_KEY = 'notifications';
  private static listeners: ((notifications: Notification[]) => void)[] = [];

  static subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notify() {
    const notifications = this.getNotifications();
    this.listeners.forEach(listener => listener(notifications));
  }

  static getNotifications(): Notification[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  static sendNotification(type: NotificationType, message: string, data: any = {}) {
    try {
      const notifications = this.getNotifications();
      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        message,
        data,
        read: false,
        createdAt: new Date().toISOString()
      };

      notifications.unshift(newNotification);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications.slice(0, 100))); // Keep last 100
      this.notify();
      
      return newNotification;
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  static markAsRead(notificationId: string) {
    try {
      const notifications = this.getNotifications().map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
      this.notify();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  static markAllAsRead() {
    try {
      const notifications = this.getNotifications().map(notification => ({
        ...notification,
        read: true
      }));
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
      this.notify();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  static getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.read).length;
  }

  static clearAll() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      this.notify();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }
}