import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BellAlertIcon, 
  XMarkIcon, 
  CheckIcon, 
  TrashIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  VideoCameraIcon
} from "@heroicons/react/24/outline";
import { useNotification } from "@context/NotificationContext";

const NotificationModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    formatNotificationTime,
    getNotificationUrl,
    handleOrganizationInvite,
    acceptVideoCall
  } = useNotification();

  const getNotificationIcon = (notificationType) => {
    switch (notificationType) {
      case 'task_assigned':
      case 'task_updated':
        return <DocumentTextIcon className="w-5 h-5" />;
      case 'task_commented':
        return <ChatBubbleLeftIcon className="w-5 h-5" />;
      case 'status_changed':
        return <ArrowPathIcon className="w-5 h-5" />;
      case 'organization_invite':
        return <UserGroupIcon className="w-5 h-5" />;
      case 'chat_message':
        return <ChatBubbleLeftIcon className="w-5 h-5" />;
      case 'video_call':
        return <VideoCameraIcon className="w-5 h-5" />;
      default:
        return <BellAlertIcon className="w-5 h-5" />;
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark notification as read
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    
    // Handle different notification types
    if (notification.notification_type === 'video_call') {
      const callInfo = await acceptVideoCall(notification.id);
      if (callInfo) {
        onClose();
        navigate(callInfo.url);
      }
      return;
    }
    
    onClose();
    navigate(getNotificationUrl(notification));
  };

  const handleInviteResponse = async (notificationId, accept) => {
    const success = await handleOrganizationInvite(notificationId, accept);
    if (success) {
      // Maybe navigate to organization page if accepted
      if (accept) {
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && notification.organization) {
          onClose();
          navigate(`/organization/${notification.organization}`);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-white shadow-xl h-full md:h-[calc(100vh-4rem)] md:mt-16 md:rounded-l-lg flex flex-col"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 30 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <BellAlertIcon className="w-5 h-5 text-cyan-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1 text-gray-500 hover:text-cyan-600 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-4">
                  <BellAlertIcon className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-center text-lg">No notifications yet</p>
                  <p className="text-center text-sm mt-2 text-gray-400">
                    New notifications will appear here when you receive them
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <motion.li
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-cyan-50' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg ${!notification.is_read ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-100 text-gray-600'}`}>
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                        
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p 
                                className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'} cursor-pointer hover:text-cyan-600`}
                                onClick={() => handleNotificationClick(notification)}
                              >
                                {notification.message}
                              </p>
                              <span className="text-xs text-gray-500 block mt-1">
                                {formatNotificationTime(notification.created_at)}
                              </span>
                            </div>
                            <div className="flex space-x-2 ml-2 shrink-0">
                              {!notification.is_read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-gray-400 hover:text-cyan-600 transition-colors p-1"
                                  title="Mark as read"
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                title="Delete"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Special actions for specific notification types */}
                          {notification.notification_type === 'organization_invite' && (
                            <div className="mt-2 space-x-2">
                              <button
                                onClick={() => handleInviteResponse(notification.id, true)}
                                className="px-3 py-1 bg-cyan-600 text-white text-xs font-medium rounded hover:bg-cyan-700"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleInviteResponse(notification.id, false)}
                                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                          
                          {notification.notification_type === 'video_call' && (
                            <div className="mt-2">
                              <button
                                onClick={() => handleNotificationClick(notification)}
                                className="px-3 py-1 bg-cyan-600 text-white text-xs font-medium rounded hover:bg-cyan-700 flex items-center"
                              >
                                <VideoCameraIcon className="w-3 h-3 mr-1" />
                                Join Call
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 text-center">
              <button
                onClick={onClose}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 font-medium rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;