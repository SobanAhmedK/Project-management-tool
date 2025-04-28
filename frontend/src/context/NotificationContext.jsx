"use client"

import { createContext, useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Create context
const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = (notification) => {
    const id = Date.now().toString()
    setNotifications([...notifications, { ...notification, id }])

    // Auto-dismiss after timeout
    if (notification.timeout !== false) {
      setTimeout(() => {
        dismissNotification(id)
      }, notification.timeout || 5000)
    }

    return id
  }

  const dismissNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const notify = (message, type = "info") => {
    return addNotification({ message, type })
  }

  const value = {
    notifications,
    addNotification,
    dismissNotification,
    notify,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} dismissNotification={dismissNotification} />
    </NotificationContext.Provider>
  )
}

const NotificationContainer = ({ notifications, dismissNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-50  z-[99999]  space-y-2 w-80">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`p-4 rounded-md shadow-md ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : notification.type === "error"
                  ? "bg-red-500 text-white' :  ? 'bg-green-500 text-white"
                  : notification.type === "error"
                    ? "bg-red-500 text-white"
                    : notification.type === "warning"
                      ? "bg-yellow-500 text-white"
                      : "bg-blue-500 text-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm">{notification.message}</p>
              </div>
              <button
                className="text-white opacity-70 hover:opacity-100"
                onClick={() => dismissNotification(notification.id)}
              >
                &times;
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export const useNotification = () => {
  return useContext(NotificationContext)
}
