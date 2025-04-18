"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MenuIcon, BellIcon, SearchIcon, UserCircleIcon } from "@heroicons/react/outline"
import { useAuth } from "../../context/AuthContext"

const Navbar = ({ title }) => {
  const { currentUser, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button className="lg:hidden mr-2 text-gray-500 hover:text-gray-700">
            <MenuIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>

        <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1.5 flex-1 max-w-md mx-4">
          <SearchIcon className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none w-full text-sm"
          />
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
            <BellIcon className="w-6 h-6" />
          </button>

          <div className="relative">
            <button className="flex items-center space-x-2" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                {currentUser?.name?.charAt(0) || <UserCircleIcon className="w-8 h-8 text-gray-500" />}
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">{currentUser?.name || "User"}</span>
            </button>

            {isProfileOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Your Profile
                </a>
                <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={logout}
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
