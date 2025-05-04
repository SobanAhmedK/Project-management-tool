import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@context/AuthContext";
import { useNotification } from "@context/NotificationContext";
import { MagnifyingGlassIcon, BellAlertIcon, UserIcon } from "@heroicons/react/24/outline";
import NotificationModal from "@components/modals/NotificationModal";

const Navbar = ({ title }) => {
  const { currentUser, logout } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    // Add listener when dropdown is open
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  // Handle logout
  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    navigate("/login");
  };

  // Handle navigation to different profile pages
  const handleProfileNavigation = (path) => {
    setIsProfileOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 sticky top-0 z-[100]">
        <div className="flex justify-between items-center">
          <Link to="/dashboard">
            <h1 
              className="text-xl md:text-2xl font-semibold text-cyan-500 font-[800] transition-all duration-300 ease-in-out tracking-tight hover:scale-105 cursor-pointer"
            >
              {title}
            </h1>
          </Link>

          <form 
            className="hidden md:flex items-center bg-white rounded-lg px-3 py-2 flex-1 max-w-xl mx-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            onSubmit={handleSearch}
            ref={searchRef}
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
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>

          <div className="flex items-center space-x-2 md:space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full text-gray-500 hover:text-cyan-600 hover:bg-gray-100"
              onClick={() => setIsNotificationOpen(true)}
              aria-label="Notifications"
            >
              <BellAlertIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>

            <div className="relative" ref={profileRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="User menu"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-100 to-indigo-100 flex items-center justify-center text-cyan-600 font-medium shadow-sm">
                  {currentUser?.name?.charAt(0) || <UserIcon className="w-5 h-5 text-cyan-600" />}
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
                    <button 
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => handleProfileNavigation("/profile")}
                    >
                      Your Profile
                    </button>
                    <button 
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => handleProfileNavigation("/profile/settings")}
                    >
                      Settings
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={handleLogout}
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

      <NotificationModal 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </>
  );
};

export default Navbar;