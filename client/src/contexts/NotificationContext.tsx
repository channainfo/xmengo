import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'like' | 'system';
  content: string;
  isRead: boolean;
  createdAt: string;
  relatedUserId?: string;
  relatedMatchId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket, isConnected } = useSocket();
  const { isAuthenticated } = useAuth();

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fetch notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      
      // Show browser notification if supported and permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        const title = getNotificationTitle(notification);
        const options = {
          body: notification.content,
          icon: '/notification-icon.png'
        };
        new Notification(title, options);
      }
    };

    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
    };
  }, [socket, isConnected]);

  // Get notification title based on type
  const getNotificationTitle = (notification: Notification): string => {
    switch (notification.type) {
      case 'match':
        return 'New Match!';
      case 'message':
        return 'New Message';
      case 'like':
        return 'Someone Liked You';
      case 'system':
        return 'Fmengo';
      default:
        return 'Notification';
    }
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.patch('/api/notifications/read-all');
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Export as a named constant instead of a function declaration for better compatibility with Fast Refresh
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
