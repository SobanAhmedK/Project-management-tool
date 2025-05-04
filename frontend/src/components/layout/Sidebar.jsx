import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  HomeModernIcon as HomeIcon,
  Squares2X2Icon as ViewBoardsIcon,
  BuildingOffice2Icon as OrganizationIcon,
  ChevronDownIcon,
  Cog6ToothIcon as CogIcon,
  UserIcon,
  UsersIcon,
  SunIcon,
  ChatBubbleLeftEllipsisIcon as ChatIcon,
} from "@heroicons/react/24/outline"
import { useProject } from "@context/ProjectContext"
import { useOrganization } from "@context/OrganizationContext"
import { useAuth } from "@context/AuthContext"
import LOGO from "../../assets/LOGO.png"

const Sidebar = () => {
  const location = useLocation()
  const {currentOrganization, setOrganization} = useOrganization()
  const { orgId, projectId } = useParams()
  const { currentUser } = useAuth()
  const { getProjects } = useProject()
  const { getOrganizations } = useOrganization()
  
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({
    projects: true,
    organizations: true,
  })
  const [visibleProjects, setVisibleProjects] = useState(5)
  const [visibleOrgs, setVisibleOrgs] = useState(5)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Get data
  const allProjects = getProjects()
  const allOrganizations = getOrganizations()

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSettingsDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset visible counts when data changes
  useEffect(() => {
    setVisibleProjects(5)
    setVisibleOrgs(5)
  }, [allProjects.length, allOrganizations.length])

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }))
  }

  const showMoreProjects = () => setVisibleProjects(prev => prev + 5)
  const showMoreOrgs = () => setVisibleOrgs(prev => prev + 5)

  const isActive = (path) => location.pathname === path
  const isSettingsActive = location.pathname.includes('/settings')
  const isConversationsActive = location.pathname === '/conversations'

  return (
    <motion.div
      className={`bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", damping: 20 }}
      ref={dropdownRef}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
            <img src={LOGO} alt="TaskSync" className="w-40 " />
            </Link>
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg hover:bg-gray-100 ${isCollapsed ? "mx-auto" : ""}`}
        >
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isCollapsed ? "rotate-90" : "-rotate-90"
            }`}
          />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {/* Dashboard */}
          <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2.5 rounded-lg ${
                isActive("/dashboard")
                  ? "bg-gradient-to-r from-cyan-50 to-indigo-50 text-cyan-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <HomeIcon className="w-5 h-5 mr-3 text-cyan-500" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/conversations"
              className={`flex items-center px-3 py-2.5 rounded-lg ${
                isConversationsActive
                  ? "bg-gradient-to-r from-cyan-50 to-indigo-50 text-cyan-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ChatIcon className="w-5 h-5 mr-3 text-blue-500 " />
              {!isCollapsed && <span>Conversations</span>}
            </Link>
          </motion.li>

          {/* Projects Section */}
          <li className="mt-4">
            <div
              onClick={() => !isCollapsed && toggleMenu("projects")}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer ${
                !isCollapsed ? "text-gray-600 hover:bg-gray-50" : "justify-center"
              }`}
            >
              <div className="flex items-center">
                <ViewBoardsIcon className="w-5 h-5 mr-3 text-green-500" />
                {!isCollapsed && <span>Projects ({allProjects.length})</span>}
              </div>
              {!isCollapsed && (
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${
                    expandedMenus.projects ? "rotate-180" : ""
                  }`}
                />
              )}
            </div>

            <AnimatePresence>
              {!isCollapsed && expandedMenus.projects && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1 pl-8 space-y-1 overflow-hidden"
                >
                  {allProjects.slice(0, visibleProjects).map((project) => (
                    <motion.li
                      key={project.id}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        to={`/organization/${project.organization.id}/projects/${project.id}`}
                        onClick={() => setOrganization(project.organization.name)
                           }
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
                          projectId === project.id
                            ? "bg-indigo-50 text-indigo-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
                        <span className="truncate">{project.name}</span>
                      </Link>
                    </motion.li>
                  ))}
                  {allProjects.length > visibleProjects && (
                    <motion.li whileHover={{ x: 5 }} className="mt-1">
                      <button
                        onClick={showMoreProjects}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 w-full"
                      >
                        <span className="text-xs mr-2">
                          +{allProjects.length - visibleProjects} more
                        </span>
                      </button>
                    </motion.li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          {/* Organizations Section */}
          <li className="mt-4">
            <div
              onClick={() => !isCollapsed && toggleMenu("organizations")}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer ${
                !isCollapsed ? "text-gray-600 hover:bg-gray-50" : "justify-center"
              }`}
            >
              <div className="flex items-center">
                <OrganizationIcon className="w-5 h-5 mr-3 text-pink-500" />
                {!isCollapsed && <span>Organizations ({allOrganizations.length})</span>}
              </div>
              {!isCollapsed && (
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${
                    expandedMenus.organizations ? "rotate-180" : ""
                  }`}
                />
              )}
            </div>

            <AnimatePresence>
              {!isCollapsed && expandedMenus.organizations && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1 pl-8 space-y-1 overflow-hidden"
                >
                  {allOrganizations.slice(0, visibleOrgs).map((org) => (
                    <motion.li
                      key={org.id}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        to={`/organization/${org.id}`}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
                          orgId === org.id && !location.pathname.includes('settings')
                            ? "bg-cyan-50 text-cyan-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2" />
                        <span className="truncate">{org.name}</span>
                      </Link>
                    </motion.li>
                  ))}
                  {allOrganizations.length > visibleOrgs && (
                    <motion.li whileHover={{ x: 5 }} className="mt-1">
                      <button
                        onClick={showMoreOrgs}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 w-full"
                      >
                        <span className="text-xs mr-2">
                          +{allOrganizations.length - visibleOrgs} more
                        </span>
                      </button>
                    </motion.li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </div>

      {/* Settings Section */}
      <div className="p-4 border-t border-gray-200 relative">
        <button
          onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
          className={`flex items-center w-full px-3 py-2.5 rounded-lg ${
            isSettingsActive
              ? "bg-gradient-to-r from-cyan-50 to-indigo-50 text-cyan-600 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <CogIcon className="w-5 h-5 mr-3" />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {/* Settings Dropdown */}
        {!isCollapsed && showSettingsDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-4 right-4 bottom-full mb-2 bg-white rounded-lg shadow-lg z-50 border border-gray-200"
          >
            <Link
              to="/profile/settings"
              className="flex items-center px-4 py-2 hover:bg-gray-50 text-sm"
              onClick={() => setShowSettingsDropdown(false)}
            >
              <UserIcon className="w-4 h-4 mr-2" />
              User Profile
            </Link>
            <Link
              to="/app-preferences"
              className="flex items-center px-4 py-2 hover:bg-gray-50 text-sm"
              onClick={() => setShowSettingsDropdown(false)}
            >
              <SunIcon className="w-4 h-4 mr-2" />
              App Preferences
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Sidebar