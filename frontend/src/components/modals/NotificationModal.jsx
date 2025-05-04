import { motion, AnimatePresence } from "framer-motion";
import { BellAlertIcon, XMarkIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNotification } from "@context/NotificationContext";

const NotificationModal = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationIcon,
    formatNotificationTime,
    getNotificationUrl
  } = useNotification();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end pt-16">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-white shadow-xl rounded-tl-lg rounded-bl-lg flex flex-col h-[calc(100vh-4rem)]"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 30 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={markAllAsRead}
                  className="p-1 text-gray-500 hover:text-cyan-600 transition-colors"
                  title="Mark all as read"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
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
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                  <BellAlertIcon className="w-10 h-10 mb-2 opacity-50" />
                  <p className="text-center">No notifications yet</p>
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
                          {/* Replace with your icon component */}
                          <span className="text-sm font-medium">
                            {String.fromCharCode(getNotificationIcon(notification.notification_type).charCodeAt(0))}
                          </span>
                        </div>
                        
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.message}
                            </p>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-gray-400 hover:text-cyan-600 transition-colors"
                                title="Mark as read"
                              >
                                <CheckIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {formatNotificationTime(notification.created_at)}
                            </span>
                            <a
                              href={getNotificationUrl(notification)}
                              className="text-xs text-cyan-600 hover:underline"
                              onClick={onClose}
                            >
                              View
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-2 text-center">
              <button
                onClick={onClose}
                className="text-sm text-cyan-600 hover:text-cyan-800 font-medium"
              >
                Close notifications
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;