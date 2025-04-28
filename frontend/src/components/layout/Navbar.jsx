
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@context/AuthContext"
import { MagnifyingGlassIcon, BellAlertIcon, UserIcon } from "@heroicons/react/24/outline"

const Navbar = ({ title }) => {
  const { currentUser, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const profileRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    // Add listener when dropdown is open
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isProfileOpen])

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-[8888]">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>

        <motion.div
          className="hidden md:flex items-center bg-white rounded-lg px-3 py-2 flex-1 max-w-xl mx-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          whileHover={{ y: -1 }}
        >
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </motion.div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
          >
            <BellAlertIcon className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-100 to-indigo-100 flex items-center justify-center text-cyan-600 font-medium shadow-sm">
                {currentUser?.name?.charAt(0) || <UserIcon className="w-8 h-8 text-gray-500" />}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-700">{currentUser?.name || "User"}</span>
                <span className="text-xs text-gray-500">{currentUser?.role || "Member"}</span>
              </div>
            </motion.button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-[8888] border border-gray-100"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{currentUser?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser?.email || "user@example.com"}</p>
                  </div>
                  <a 
                    href="/profile" 
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Your Profile
                  </a>
                  <a 
                    href="profile/settings" 
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </a>
                  <button
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsProfileOpen(false)
                      logout()
                    }}
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar