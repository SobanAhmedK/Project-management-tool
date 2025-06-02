import React from 'react';
import { motion } from 'framer-motion';

const NotificationToast = ({ toast, dismissNotification }) => {
  const getToastColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`p-4 rounded-md shadow-md text-white ${getToastColor()}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">
            {toast.title || toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
          </h4>
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
  );
};

export default NotificationToast;