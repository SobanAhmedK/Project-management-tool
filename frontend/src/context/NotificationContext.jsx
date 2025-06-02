import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@context/AuthContext';

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
  const [toasts, setToasts] = useState([]);

  const mockNotifications = [
    {
      id: 1,
      notification_type: 'task_assigned',
      message: 'You have been assigned to task "Implement user authentication"',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      task: 123,
      project: 456,
      url: '/projects/456/tasks/123'
    },
    {
      id: 2,
      notification_type: 'task_commented',
      message: 'John commented on task "Update dashboard UI"',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      task: 124,
      project: 456,
      url: '/organization/org1/projects/project1'
    },
    {
      id: 3,
      notification_type: 'organization_invite',
      message: 'You have been invited to join "Acme Corp" organization',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      organization: 789,
      url: '/organizations/789/invites'
    },
    {
      id: 4,
      notification_type: 'chat_message',
      message: 'New message from Sarah in "Project Discussion"',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      chat_room: 101,
      url: '/chat/101'
    },
    {
      id: 5,
      notification_type: 'video_call',
      message: 'Incoming video call from Team Standup',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      video_call: 'abc123',
      url: '/video-call/abc123'
    }
  ];

  // Toast notification functions (from old context)
  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...notification, id }]);

    if (notification.timeout !== false) {
      setTimeout(() => {
        dismissNotification(id);
      }, notification.timeout || 3000);
    }

    return id;
  }, []);

  const dismissNotification = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((message, type = 'info') => {
    return addNotification({ message, type });
  }, [addNotification]);

  // Persistent notification functions
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(notif => !notif.is_read).length);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
      notify('Failed to fetch notifications', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, notify]);

  const markAsRead = useCallback(async (notificationId) => {
    if (!isAuthenticated) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      notify('Error marking notification as read', 'error');
    }
  }, [isAuthenticated, notify]);

  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
      notify('All notifications marked as read', 'success');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      notify('Error marking all notifications as read', 'error');
    }
  }, [isAuthenticated, notify]);

  const deleteNotification = useCallback(async (notificationId) => {
    if (!isAuthenticated) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      setNotifications(prevNotifications => 
        prevNotifications.filter(notif => notif.id !== notificationId)
      );
      const wasUnread = notifications.find(n => n.id === notificationId)?.is_read === false;
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      notify('Notification deleted', 'success');
    } catch (err) {
      console.error('Error deleting notification:', err);
      notify('Error deleting notification', 'error');
    }
  }, [isAuthenticated, notifications, notify]);

  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) return;

    console.log('Mock WebSocket connection established for notifications');
    setSocketConnected(true);
    
    const newNotificationTimer = setTimeout(() => {
      const newNotification = {
        id: Math.floor(Math.random() * 1000) + 10,
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
      notify('New task update received', 'info');
    }, 5000);
    
    return () => {
      clearTimeout(newNotificationTimer);
      console.log('Mock WebSocket disconnected');
      setSocketConnected(false);
    };
  }, [isAuthenticated, currentUser?.id, notify]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, fetchNotifications]);

  const showBrowserNotification = (notification) => {
    if (!('Notification' in window)) {
      return;
    }
    
    if (Notification.permission === 'granted') {
      const title = getNotificationTitle(notification);
      const options = {
        body: notification.message,
        icon: '/notification-icon.png',
      };
      
      new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

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
    
    return '/dashboard';
  };

  const handleOrganizationInvite = async (notificationId, accept = true) => {
    if (!isAuthenticated) return;
    
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification || notification.notification_type !== 'organization_invite') {
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
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
      
      if (!notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      notify(accept ? 'Invitation accepted' : 'Invitation declined', 'success');
      return true;
    } catch (err) {
      console.error('Error handling organization invite:', err);
      notify('Error handling organization invite', 'error');
      return false;
    }
  };

  const acceptVideoCall = async (notificationId) => {
    if (!isAuthenticated) return;
    
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification || notification.notification_type !== 'video_call') {
        return null;
      }
      
      await markAsRead(notificationId);
      notify('Video call accepted', 'success');
      return {
        videoCallId: notification.video_call,
        url: getNotificationUrl(notification)
      };
    } catch (err) {
      console.error('Error accepting video call:', err);
      notify('Error accepting video call', 'error');
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
    acceptVideoCall,
    toasts,
    addNotification,
    dismissNotification,
    notify
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer toasts={toasts} dismissNotification={dismissNotification} />
    </NotificationContext.Provider>
  );
};

// Toast notification container (from old context)
const NotificationContainer = ({ toasts, dismissNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-[99999] space-y-2 w-80">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`p-4 rounded-md shadow-md text-white ${
              toast.type === 'success'
                ? 'bg-green-500'
                : toast.type === 'error'
                ? 'bg-red-500'
                : toast.type === 'warning'
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{toast.title || toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}</h4>
                <p className="text-sm">{toast.message}</p>
              </div>
              <button
                className="text-white opacity-70 hover:opacity-100"
                onClick={() => dismissNotification(toast.id)}
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContext;