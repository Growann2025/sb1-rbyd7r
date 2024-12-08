import { useState, useEffect } from 'react';
import { NotificationService, Notification } from '../services/notification/NotificationService';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(NotificationService.getNotifications());
  const [unreadCount, setUnreadCount] = useState<number>(NotificationService.getUnreadCount());

  useEffect(() => {
    const unsubscribe = NotificationService.subscribe(updatedNotifications => {
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    });

    return unsubscribe;
  }, []);

  const markAsRead = (notificationId: string) => {
    NotificationService.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    NotificationService.markAllAsRead();
  };

  const clearAll = () => {
    NotificationService.clearAll();
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll
  };
}