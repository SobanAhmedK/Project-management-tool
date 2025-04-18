"use client"

import { createContext, useContext, useState } from "react"

// Create context
const ProjectContext = createContext()

// Mock project data - in a real app, this would come from an API
const mockProjects = [
  {
    id: "project1",
    name: "Website Redesign",
    description: "Redesign the company website with a modern look and feel",
    organizationId: "org1",
    members: [
      { id: "user1", name: "John Doe", role: "Project Manager" },
      { id: "user2", name: "Jane Smith", role: "Designer" },
    ],
    tasks: [
      {
        id: "task1",
        title: "Create wireframes",
        description: "Design initial wireframes for homepage and product pages",
        status: "done",
        priority: "high",
        assignee: { id: "user2", name: "Jane Smith" },
        dueDate: "2023-06-15",
        comments: [
          {
            id: "comment1",
            text: "I've completed the homepage wireframes",
            author: { id: "user2", name: "Jane Smith" },
            createdAt: "2023-06-10T14:30:00Z",
          },
        ],
        createdAt: "2023-06-01T10:00:00Z",
      },
      {
        id: "task2",
        title: "Design mockups",
        description: "Create high-fidelity mockups based on approved wireframes",
        status: "in-progress",
        priority: "medium",
        assignee: { id: "user2", name: "Jane Smith" },
        dueDate: "2023-06-30",
        comments: [],
        createdAt: "2023-06-16T09:00:00Z",
      },
      {
        id: "task3",
        title: "Develop homepage",
        description: "Implement the homepage design in HTML/CSS/JS",
        status: "todo",
        priority: "medium",
        assignee: null,
        dueDate: "2023-07-15",
        comments: [],
        createdAt: "2023-06-16T09:30:00Z",
      },
      {
        id: "task4",
        title: "Content migration",
        description: "Move content from old site to new site",
        status: "todo",
        priority: "low",
        assignee: null,
        dueDate: "2023-07-30",
        comments: [],
        createdAt: "2023-06-16T10:00:00Z",
      },
    ],
  },
  {
    id: "project2",
    name: "Mobile App",
    description: "Develop a mobile app for iOS and Android",
    organizationId: "org2",
    members: [{ id: "user1", name: "John Doe", role: "Project Manager" }],
    tasks: [
      {
        id: "task5",
        title: "App architecture",
        description: "Design the app architecture and technology stack",
        status: "in-progress",
        priority: "high",
        assignee: { id: "user1", name: "John Doe" },
        dueDate: "2023-06-20",
        comments: [],
        createdAt: "2023-06-05T11:00:00Z",
      },
      {
        id: "task6",
        title: "UI Design",
        description: "Create UI design for the mobile app",
        status: "todo",
        priority: "medium",
        assignee: null,
        dueDate: "2023-07-10",
        comments: [],
        createdAt: "2023-06-05T11:30:00Z",
      },
    ],
  },
]

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(mockProjects)

  const getProjects = () => {
    return projects
  }

  const getProject = (projectId) => {
    return projects.find((project) => project.id === projectId)
  }

  const addProject = (newProject) => {
    setProjects([...projects, { ...newProject, id: Date.now().toString() }])
  }

  const updateProject = (updatedProject) => {
    setProjects(projects.map((project) => (project.id === updatedProject.id ? updatedProject : project)))
  }

  const deleteProject = (projectId) => {
    setProjects(projects.filter((project) => project.id !== projectId))
  }

  const addTask = (projectId, newTask) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: [...project.tasks, newTask],
          }
        }
        return project
      }),
    )
  }

  const updateTask = (updatedTask) => {
    setProjects(
      projects.map((project) => {
        if (project.tasks.some((task) => task.id === updatedTask.id)) {
          return {
            ...project,
            tasks: project.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
          }
        }
        return project
      }),
    )
  }

  const updateTaskStatus = (taskId, newStatus) => {
    setProjects(
      projects.map((project) => {
        if (project.tasks.some((task) => task.id === taskId)) {
          return {
            ...project,
            tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)),
          }
        }
        return project
      }),
    )
  }

  const deleteTask = (taskId) => {
    setProjects(
      projects.map((project) => {
        if (project.tasks.some((task) => task.id === taskId)) {
          return {
            ...project,
            tasks: project.tasks.filter((task) => task.id !== taskId),
          }
        }
        return project
      }),
    )
  }

  const value = {
    getProjects,
    getProject,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export const useProject = () => {
  return useContext(ProjectContext)
}
