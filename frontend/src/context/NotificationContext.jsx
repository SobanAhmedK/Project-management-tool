import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const isAuthenticated = !!currentUser;
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  // Mock data for development
  const mockNotifications = [
    {
      id: 1,
      notification_type: 'task_assigned',
      message: 'You have been assigned to task "Implement user authentication"',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      task: 123,
      project: 456,
      url: '/projects/456/tasks/123'
    },
    {
      id: 2,
      notification_type: 'task_commented',
      message: 'John commented on task "Update dashboard UI"',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      task: 124,
      project: 456,
      url: '/projects/456/tasks/124'
    },
    {
      id: 3,
      notification_type: 'organization_invite',
      message: 'You have been invited to join "Acme Corp" organization',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      organization: 789,
      url: '/organizations/789/invites'
    },
    {
      id: 4,
      notification_type: 'chat_message',
      message: 'New message from Sarah in "Project Discussion"',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      chat_room: 101,
      url: '/chat/101'
    },
    {
      id: 5,
      notification_type: 'video_call',
      message: 'Incoming video call from Team Standup',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
      video_call: 'abc123',
      url: '/video-call/abc123'
    }
  ];

  // Fetch all notifications for the logged-in user - MOCKED for development
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(notif => !notif.is_read).length);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Mark a notification as read - MOCKED for development
  const markAsRead = useCallback(async (notificationId) => {
    if (!isAuthenticated) return;
    
    try {
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, [isAuthenticated]);

  // Mark all notifications as read - MOCKED for development
  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({ ...notif, is_read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, [isAuthenticated]);

  // Delete a notification - MOCKED for development
  const deleteNotification = useCallback(async (notificationId) => {
    if (!isAuthenticated) return;
    
    try {
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notif => notif.id !== notificationId)
      );
      
      // Update unread count if needed
      const wasUnread = notifications.find(n => n.id === notificationId)?.is_read === false;
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, [isAuthenticated, notifications]);

  // Mock WebSocket connection for real-time notifications
  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) return;

    console.log('Mock WebSocket connection established for notifications');
    setSocketConnected(true);
    
    // Simulate receiving a new notification after 5 seconds
    const newNotificationTimer = setTimeout(() => {
      const newNotification = {
        id: Math.floor(Math.random() * 1000) + 10, // Random ID
        notification_type: 'task_updated',
        message: 'Task "Fix login bug" has been updated by Alex',
        is_read: false,
        created_at: new Date().toISOString(),
        task: 125,
        project: 456,
        url: '/projects/456/tasks/125'
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      showBrowserNotification(newNotification);
    }, 5000);
    
    return () => {
      clearTimeout(newNotificationTimer);
      console.log('Mock WebSocket disconnected');
      setSocketConnected(false);
    };
  }, [isAuthenticated, currentUser?.id]);

  // Initial fetch of notifications
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, fetchNotifications]);

  // Browser notifications
  const showBrowserNotification = (notification) => {
    if (!('Notification' in window)) {
      return; // Browser doesn't support notifications
    }
    
    if (Notification.permission === 'granted') {
      const title = getNotificationTitle(notification);
      const options = {
        body: notification.message,
        icon: '/notification-icon.png', // Add your notification icon
      };
      
      new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };
  
  // Generate meaningful notification titles based on notification type
  const getNotificationTitle = (notification) => {
    switch (notification.notification_type) {
      case 'task_assigned':
        return 'New Task Assigned';
      case 'task_updated':
        return 'Task Updated';
      case 'task_commented':
        return 'New Comment on Task';
      case 'status_changed':
        return 'Task Status Changed';
      case 'organization_invite':
        return 'Organization Invitation';
      case 'chat_message':
        return 'New Message';
      case 'video_call':
        return 'Incoming Video Call';
      default:
        return 'New Notification';
    }
  };

  // Get notification icon based on notification type
  const getNotificationIcon = (notificationType) => {
    switch (notificationType) {
      case 'task_assigned':
        return 'assignment';
      case 'task_updated':
        return 'update';
      case 'task_commented':
        return 'comment';
      case 'status_changed':
        return 'swap_horiz';
      case 'organization_invite':
        return 'group_add';
      case 'chat_message':
        return 'chat';
      case 'video_call':
        return 'videocam';
      default:
        return 'notifications';
    }
  };

  // Format notification timestamp
  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get the correct navigation URL for a notification
  const getNotificationUrl = (notification) => {
    if (notification.url) {
      return notification.url;
    }
    
    switch (notification.notification_type) {
      case 'task_assigned':
      case 'task_updated':
      case 'task_commented':
      case 'status_changed':
        if (notification.task) {
          return `/projects/${notification.project}/tasks/${notification.task}`;
        }
        break;
      case 'organization_invite':
        if (notification.organization) {
          return `/organizations/${notification.organization}/invites`;
        }
        break;
      case 'chat_message':
        if (notification.chat_room) {
          return `/chat/${notification.chat_room}`;
        }
        break;
      case 'video_call':
        if (notification.video_call) {
          return `/video-call/${notification.video_call}`;
        }
        break;
      default:
        return '/notifications';
    }
    
    return '/dashboard'; // Fallback
  };

  // Accept organization invite - MOCKED for development
  const handleOrganizationInvite = async (notificationId, accept = true) => {
    if (!isAuthenticated) return;
    
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification || notification.notification_type !== 'organization_invite') {
        return;
      }
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mark as read and update the message
      const updatedNotification = {
        ...notification,
        is_read: true,
        message: accept ? 'You accepted the invitation' : 'You declined the invitation'
      };
      
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === notificationId ? updatedNotification : notif
        )
      );
      
      // Update unread count if needed
      if (!notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      return true;
    } catch (err) {
      console.error('Error handling organization invite:', err);
      return false;
    }
  };

  // Accept incoming video call - MOCKED for development
  const acceptVideoCall = async (notificationId) => {
    if (!isAuthenticated) return;
    
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification || notification.notification_type !== 'video_call') {
        return null;
      }
      
      // Mark as read
      await markAsRead(notificationId);
      
      // Return call details for the UI to handle
      return {
        videoCallId: notification.video_call,
        url: getNotificationUrl(notification)
      };
    } catch (err) {
      console.error('Error accepting video call:', err);
      return null;
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    socketConnected,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationIcon,
    formatNotificationTime,
    getNotificationUrl,
    handleOrganizationInvite,
    acceptVideoCall
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;