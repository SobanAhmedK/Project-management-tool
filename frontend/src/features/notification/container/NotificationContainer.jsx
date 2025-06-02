import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationToast from './toast/NotificationToast';

const NotificationContainer = ({ toasts, dismissNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-[99999] space-y-2 w-80">
      <AnimatePresence>
        {toasts.map((toast) => (
          <NotificationToast 
            key={toast.id} 
            toast={toast} 
            dismissNotification={dismissNotification} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;