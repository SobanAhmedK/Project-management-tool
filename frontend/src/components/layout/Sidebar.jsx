"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import {
  HomeIcon,
  ViewBoardsIcon,
  UserGroupIcon,
  ChatIcon,
  CalendarIcon,
  CogIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline"

const Sidebar = () => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({
    projects: true,
    organizations: false,
  })

  const toggleMenu = (menu) => {
    setExpandedMenus({
      ...expandedMenus,
      [menu]: !expandedMenus[menu],
    })
  }

  // Mock data - would come from context in a real app
  const projects = [
    { id: "project1", name: "Website Redesign" },
    { id: "project2", name: "Mobile App" },
    { id: "project3", name: "Marketing Campaign" },
  ]

  const organizations = [
    { id: "org1", name: "Design Team" },
    { id: "org2", name: "Development Team" },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <motion.div
      className={`bg-white border-r border-gray-200 flex flex-col ${isCollapsed ? "w-16" : "w-64"}`}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-xl font-bold text-indigo-600">TaskFlow</h1>}
        <button
          className={`p-1 rounded-md hover:bg-gray-100 ${isCollapsed ? "mx-auto" : ""}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/dashboard") ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>

          <li className="mt-4">
            <div
              className={`flex items-center justify-between px-3 py-2 text-gray-500 ${!isCollapsed ? "cursor-pointer hover:bg-gray-100 rounded-md" : ""}`}
              onClick={() => !isCollapsed && toggleMenu("projects")}
            >
              <div className="flex items-center">
                <ViewBoardsIcon className="w-5 h-5 mr-3" />
                {!isCollapsed && <span>Projects</span>}
              </div>
              {!isCollapsed && (
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${expandedMenus.projects ? "rotate-180" : ""}`}
                />
              )}
            </div>

            {!isCollapsed && expandedMenus.projects && (
              <ul className="mt-1 pl-8 space-y-1">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      to={`/project/${project.id}`}
                      className={`block px-3 py-1.5 rounded-md text-sm ${
                        isActive(`/project/${project.id}`)
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {project.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="mt-2">
            <div
              className={`flex items-center justify-between px-3 py-2 text-gray-500 ${!isCollapsed ? "cursor-pointer hover:bg-gray-100 rounded-md" : ""}`}
              onClick={() => !isCollapsed && toggleMenu("organizations")}
            >
              <div className="flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-3" />
                {!isCollapsed && <span>Organizations</span>}
              </div>
              {!isCollapsed && (
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${expandedMenus.organizations ? "rotate-180" : ""}`}
                />
              )}
            </div>

            {!isCollapsed && expandedMenus.organizations && (
              <ul className="mt-1 pl-8 space-y-1">
                {organizations.map((org) => (
                  <li key={org.id}>
                    <Link
                      to={`/organization/${org.id}`}
                      className={`block px-3 py-1.5 rounded-md text-sm ${
                        isActive(`/organization/${org.id}`)
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {org.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="mt-2">
            <Link
              to="/chat"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/chat") ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChatIcon className="w-5 h-5 mr-3" />
              {!isCollapsed && <span>Chat</span>}
            </Link>
          </li>

          <li>
            <Link
              to="/calendar"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/calendar") ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <CalendarIcon className="w-5 h-5 mr-3" />
              {!isCollapsed && <span>Calendar</span>}
            </Link>
          </li>
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Link
          to="/settings"
          className={`flex items-center px-3 py-2 rounded-md ${
            isActive("/settings") ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <CogIcon className="w-5 h-5 mr-3" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </motion.div>
  )
}

export default Sidebar
