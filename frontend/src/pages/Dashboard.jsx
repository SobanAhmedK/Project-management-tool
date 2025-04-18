"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

// Using path aliases for cleaner imports
import Navbar from "@layouts/Navbar"
import Sidebar from "@layouts/Sidebar"
import { useProject } from "@context/ProjectContext"
import { useOrganization } from "@context/OrganizationContext"
import { useAuth } from "@context/AuthContext"
import { formatDate } from "@utils"

const Dashboard = () => {
  const { getProjects } = useProject()
  const { getOrganizations } = useOrganization()
  const { currentUser } = useAuth()
  const [projects, setProjects] = useState([])
  const [organizations, setOrganizations] = useState([])

  useEffect(() => {
    // Fetch projects and organizations
    setProjects(getProjects())
    setOrganizations(getOrganizations())
  }, [getProjects, getOrganizations])

  // Get tasks assigned to current user
  const assignedTasks = projects.flatMap((project) =>
    project.tasks.filter((task) => task.assignee?.id === currentUser?.id),
  )

  // Get recent activity (would normally come from an API)
  const recentActivity = [
    {
      id: "activity1",
      type: "task_created",
      user: { id: "user2", name: "Jane Smith" },
      project: { id: "project1", name: "Website Redesign" },
      task: { id: "task2", title: "Design mockups" },
      timestamp: "2023-06-16T09:00:00Z",
    },
    {
      id: "activity2",
      type: "comment_added",
      user: { id: "user2", name: "Jane Smith" },
      project: { id: "project1", name: "Website Redesign" },
      task: { id: "task1", title: "Create wireframes" },
      timestamp: "2023-06-10T14:30:00Z",
    },
    {
      id: "activity3",
      type: "task_status_changed",
      user: { id: "user2", name: "Jane Smith" },
      project: { id: "project1", name: "Website Redesign" },
      task: { id: "task1", title: "Create wireframes" },
      oldStatus: "in-progress",
      newStatus: "done",
      timestamp: "2023-06-10T14:35:00Z",
    },
  ]

  // Format timestamp - now using our utility function
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  // Get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case "task_created":
        return "🆕"
      case "comment_added":
        return "💬"
      case "task_status_changed":
        return "🔄"
      default:
        return "📝"
    }
  }

  // Get activity description
  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case "task_created":
        return `${activity.user.name} created task "${activity.task.title}" in ${activity.project.name}`
      case "comment_added":
        return `${activity.user.name} commented on "${activity.task.title}" in ${activity.project.name}`
      case "task_status_changed":
        return `${activity.user.name} moved "${activity.task.title}" from ${activity.oldStatus} to ${activity.newStatus}`
      default:
        return "Unknown activity"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Dashboard" />

        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome back, {currentUser?.name || "User"}!</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">My Tasks</h2>
                  {assignedTasks.length > 0 ? (
                    <ul className="space-y-3">
                      {assignedTasks.map((task) => (
                        <li key={task.id} className="flex items-start">
                          <span
                            className={`w-2 h-2 mt-1.5 rounded-full mr-2 ${
                              task.priority === "high"
                                ? "bg-red-500"
                                : task.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          ></span>
                          <div>
                            <Link
                              to={`/project/${task.projectId}`}
                              className="text-sm font-medium text-gray-800 hover:text-indigo-600"
                            >
                              {task.title}
                            </Link>
                            <p className="text-xs text-gray-500">Due: {formatDate(task.dueDate)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No tasks assigned to you.</p>
                  )}
                </div>

                <div className="card">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">My Organizations</h2>
                  {organizations.length > 0 ? (
                    <ul className="space-y-3">
                      {organizations.map((org) => (
                        <li key={org.id}>
                          <Link
                            to={`/organization/${org.id}`}
                            className="text-sm font-medium text-gray-800 hover:text-indigo-600 flex items-center"
                          >
                            <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 mr-2">
                              {org.name.charAt(0)}
                            </div>
                            {org.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">You don't belong to any organizations.</p>
                  )}
                </div>

                <div className="card">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">My Projects</h2>
                  {projects.length > 0 ? (
                    <ul className="space-y-3">
                      {projects.map((project) => (
                        <li key={project.id}>
                          <Link
                            to={`/project/${project.id}`}
                            className="text-sm font-medium text-gray-800 hover:text-indigo-600"
                          >
                            {project.name}
                          </Link>
                          <p className="text-xs text-gray-500">{project.tasks.length} tasks</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">You don't have any projects.</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <div className="card">
                {recentActivity.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {recentActivity.map((activity) => (
                      <li key={activity.id} className="py-3 flex">
                        <span className="text-xl mr-3">{getActivityIcon(activity.type)}</span>
                        <div>
                          <p className="text-sm text-gray-800">{getActivityDescription(activity)}</p>
                          <p className="text-xs text-gray-500">{formatTime(activity.timestamp)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No recent activity.</p>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
