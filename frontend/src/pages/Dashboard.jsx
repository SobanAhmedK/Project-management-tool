

import { useState, useEffect, useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useProject } from "@context/ProjectContext"
import { useOrganization } from "@context/OrganizationContext"
import { useAuth } from "@context/AuthContext"
import { formatDate, formatTime, getActivityDescription, getActivityIcon } from "@utils"
import {
  HomeIcon as HomeIconV2,
  BriefcaseIcon as JobIconV2,
  Squares2X2Icon as ViewBoardsIconV2,
  UserGroupIcon as UserGroupIconV2,
  ChatBubbleLeftEllipsisIcon as ChatIconV2,
  CalendarDaysIcon as CalendarIconV2,
  Cog6ToothIcon as CogIconV2,
  BellAlertIcon as BellIconV2,
  MagnifyingGlassIcon as SearchIconV2,
  UserCircleIcon as UserCircleIconV2,
  ChevronDownIcon as ChevronDownIconV2,
  PlusIcon as PlusIconV2,
  CheckCircleIcon as CheckCircleIconV2,
  ClockIcon as ClockIconV2,
  ExclamationTriangleIcon as ExclamationCircleIconV2,
  BuildingOffice2Icon as BuildingOfficeIconV2,
  UserIcon as UserIconV2,
  DocumentTextIcon as DocumentTextIconV2
} from "@heroicons/react/24/outline"

import Sidebar from "@components/layout/Sidebar"
import Navbar from "@components/layout/Navbar"

const Dashboard = () => {
  const { getProjects } = useProject()
  const { getOrganizations, currentOrganization } = useOrganization()
  const { currentUser } = useAuth()
  const [projects, setProjects] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [activeTab, setActiveTab] = useState("assigned") // Changed to "assigned" | "created"
  const location = useLocation()

  useEffect(() => {
    const loadData = async () => {
      const loadedProjects = getProjects() || []
      const loadedOrgs = getOrganizations() || []
      setProjects(loadedProjects)
      setOrganizations(loadedOrgs)
    }
    loadData()
  }, [getProjects, getOrganizations, location])

  // Memoized computations for better performance
  const { assignedTasks, createdTasks, recentActivity } = useMemo(() => {
    const allTasks = projects.flatMap(project => 
      project.tasks.map(task => ({
        ...task,
        projectId: project.id,
        projectName: project.name,
        organizationId: project.organization?.id,
        organizationName: project.organization?.name
      }))
    )

    const userAssignedTasks = allTasks.filter(task => 
      task.assigned_to?.id === currentUser?.id
    )

    const userCreatedTasks = allTasks.filter(task =>
      task.created_by?.id === currentUser?.id
    )

    // Generate activity feed from task updates
    const activity = allTasks.flatMap(task => [
      {
        id: `task-created-${task.id}`,
        type: 'task_created',
        task: task.title,
        project: task.projectName,
        user: task.created_by?.full_name || 'Unknown',
        timestamp: task.created_at
      },
      ...(task.updated_at !== task.created_at ? [{
        id: `task-updated-${task.id}`,
        type: 'task_updated',
        task: task.title,
        project: task.projectName,
        user: task.assigned_to?.full_name || task.created_by?.full_name || 'Unknown',
        timestamp: task.updated_at
      }] : []),
      ...(task.comments || []).map(comment => ({
        id: `comment-${comment.id}`,
        type: 'comment',
        task: task.title,
        project: task.projectName,
        user: comment.commented_by.full_name,
        text: comment.comment_text,
        timestamp: comment.created_at
      }))
    ]).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10)

    return {
      assignedTasks: userAssignedTasks,
      createdTasks: userCreatedTasks,
      recentActivity: activity
    }
  }, [projects, currentUser])

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": return <ExclamationCircleIconV2 className="w-4 h-4 text-red-500" />
      case "medium": return <ClockIconV2 className="w-4 h-4 text-yellow-500" />
      case "low": return <CheckCircleIconV2 className="w-4 h-4 text-green-500" />
      default: return <ClockIconV2 className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completedAssignedTaskCount = useMemo(() => (
    assignedTasks.filter(t => t.status === 'completed').length
  ), [assignedTasks])

  const completedCreatedTaskCount = useMemo(() => (
    createdTasks.filter(t => t.status === 'completed').length
  ), [createdTasks])

  const activeProjectCount = useMemo(() => (
    projects.filter(p => !p.status || p.status === 'active').length
  ), [projects])

  const activeOrgCount = useMemo(() => (
    organizations.filter(o => o.isActive).length
  ), [organizations])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar organizations={organizations} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          title={currentOrganization 
            ? `${currentOrganization.name} Dashboard` 
            : "Personal Dashboard"
          } 
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Summary Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              {/* Assigned Tasks */}
              <SummaryCard 
                title="Assigned Tasks"
                count={assignedTasks.length}
                active={completedAssignedTaskCount}
                icon={<UserIconV2 className="w-5 h-5 text-cyan-600" />}
                color="cyan"
                description={assignedTasks.length > 0 
                  ? `${completedAssignedTaskCount} completed` 
                  : 'No tasks assigned'}
              />

              {/* Created Tasks */}
              <SummaryCard 
                title="Created Tasks"
                count={createdTasks.length}
                active={completedCreatedTaskCount}
                icon={<DocumentTextIconV2 className="w-5 h-5 text-indigo-600" />}
                color="indigo"
                description={createdTasks.length > 0 
                  ? `${completedCreatedTaskCount} completed` 
                  : 'No tasks created'}
              />

              {/* Projects */}
              <SummaryCard 
                title="My Projects"
                count={projects.length}
                active={activeProjectCount}
                icon={<JobIconV2 className="w-5 h-5 text-green-600" />}
                color="green"
                description={projects.length > 0 
                  ? `${activeProjectCount} active` 
                  : 'No projects'}
              />

              {/* Organizations */}
              <SummaryCard 
                title="Organizations"
                count={organizations.length}
                active={activeOrgCount}
                icon={<BuildingOfficeIconV2 className="w-5 h-5 text-pink-600" />}
                color="pink"
                description={organizations.length > 0 
                  ? `${activeOrgCount} active` 
                  : 'No organizations'}
              />
            </motion.div>

            {/* Tabbed Content */}
            <div className="mb-8">
              <Tabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                tabs={["assigned", "created", "projects", "organizations"]}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {activeTab === "assigned" ? (
                    assignedTasks.length > 0 ? (
                      <TaskList 
                        tasks={assignedTasks} 
                        getPriorityIcon={getPriorityIcon}
                        getStatusBadge={getStatusBadge}
                        showCreator={true}
                      />
                    ) : (
                      <EmptyState 
                        icon={<UserIconV2 className="w-8 h-8 text-gray-400" />} 
                        title="No tasks assigned" 
                        description="Tasks assigned to you will appear here" 
                      />
                    )
                  ) : activeTab === "created" ? (
                    createdTasks.length > 0 ? (
                      <TaskList 
                        tasks={createdTasks} 
                        getPriorityIcon={getPriorityIcon}
                        getStatusBadge={getStatusBadge}
                        showAssignee={true}
                      />
                    ) : (
                      <EmptyState 
                        icon={<DocumentTextIconV2 className="w-8 h-8 text-gray-400" />} 
                        title="No tasks created" 
                        description="Tasks you've created will appear here" 
                      />
                    )
                  ) : activeTab === "projects" ? (
                    projects.length > 0 ? (
                      <ProjectList projects={projects} />
                    ) : (
                      <EmptyState 
                        icon={<ViewBoardsIconV2 className="w-8 h-8 text-gray-400" />} 
                        title="No projects" 
                        description="Projects you create or join will appear here" 
                      />
                    )
                  ) : (
                    organizations.length > 0 ? (
                      <OrganizationList organizations={organizations} />
                    ) : (
                      <EmptyState 
                        icon={<BuildingOfficeIconV2 className="w-8 h-8 text-gray-400" />} 
                        title="No organizations" 
                        description="Organizations you join or create will appear here" 
                      />
                    )
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {recentActivity.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {recentActivity.map((activity) => (
                      <motion.li 
                        key={activity.id}
                        whileHover={{ backgroundColor: "#f9fafb" }}
                        className="p-4 flex items-start"
                      >
                        <div className="mr-3 mt-0.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-100 to-indigo-100 flex items-center justify-center text-cyan-600">
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{getActivityDescription(activity)}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(activity.timestamp)} • {activity.user}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState 
                    icon={<BellIconV2 className="w-8 h-8 text-gray-400" />}
                    title="No recent activity"
                    description="Activity in your projects will appear here"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

const SummaryCard = ({ title, count, icon, color, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-gray-500 font-medium">{title}</h3>
      <div className={`w-10 h-10 rounded-full bg-${color}-50 flex items-center justify-center`}>
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold mt-2 text-gray-800">{count}</p>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </motion.div>
)

const Tabs = ({ activeTab, setActiveTab, tabs }) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-bold text-gray-800 capitalize">{`My ${activeTab}`}</h2>
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-3 py-1 text-sm rounded-md transition-all ${
            activeTab === tab 
              ? "bg-white shadow-sm text-cyan-600 font-medium"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  </div>
)

const TaskList = ({ tasks, getPriorityIcon, getStatusBadge, showCreator = false, showAssignee = false }) => (
  <ul className="divide-y divide-gray-100">
    {tasks.map((task) => (
      <motion.li 
        key={task.id} 
        whileHover={{ backgroundColor: "#f9fafb" }} 
        className="p-4"
      >
        <Link to={`/project/${task.projectId}/`} className="flex items-start">
          <div className="mr-3 mt-0.5">{getPriorityIcon(task.priority)}</div>
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-800">{task.title}</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
                {task.due_date && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {formatDate(task.due_date)}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {task.projectName || "Unknown project"}
              {showCreator && task.created_by && ` • Created by: ${task.created_by.full_name}`}
              {showAssignee && task.assigned_to && ` • Assigned to: ${task.assigned_to.full_name || 'Unassigned'}`}
            </p>
            {task.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </Link>
      </motion.li>
    ))}
  </ul>
)

const ProjectList = ({ projects }) => (
  <ul className="divide-y divide-gray-100">
    {projects.map((project) => (
      <motion.li 
        key={project.id} 
        whileHover={{ backgroundColor: "#f9fafb" }} 
        className="p-4"
      >
        <Link to={`/project/${project.id}`} className="flex items-start">
          <div className="mr-3 mt-0.5">
            <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center">
              <ViewBoardsIconV2 className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-800">{project.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                project.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {project.status || "active"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {project.tasks.length} tasks • {project.members.length} members • 
              Last updated {formatDate(project.updated_at || project.created_at)}
            </p>
            {project.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
        </Link>
      </motion.li>
    ))}
  </ul>
)

const OrganizationList = ({ organizations }) => (
  <ul className="divide-y divide-gray-100">
    {organizations.map((org) => (
      <motion.li 
        key={org.id} 
        whileHover={{ backgroundColor: "#f9fafb" }} 
        className="p-4"
      >
        <Link to={`/organization/${org.id}`} className="flex items-start">
          <div className="mr-3 mt-0.5">
            <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center">
              <BuildingOfficeIconV2 className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-800">{org.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                org.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
              }`}>
                {org.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {org.members?.length || 0} members • {org.projects?.length || 0} projects
            </p>
          </div>
        </Link>
      </motion.li>
    ))}
  </ul>
)

const EmptyState = ({ icon, title, description }) => (
  <div className="p-8 text-center">
    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-gray-500 font-medium">{title}</h3>
    <p className="text-gray-400 text-sm mt-1">{description}</p>
  </div>
)

export default Dashboard