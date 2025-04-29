

import { createContext, useContext, useState } from "react";

// Create context
const ProjectContext = createContext();

// Mock data aligned with your Django models
const mockProjects = [
  {
    id: "project1",
    name: "Website Redesign",
    description: "Redesign the company website with a modern look and feel",
    organization: {
      id: "org1",
      name: "Acme Corp",
    },
    created_by: {
      id: "user1",
      full_name: "John Doe",
      email: "john@example.com",
    },
    members: [
      { id: "user1", full_name: "John Doe", role: "manager" },
      { id: "user2", full_name: "Jane Smith", role: "employee" },
      { id: "user3", full_name: "Jane Smith", role: "employee" },
    ],
    tasks: [
      {
        id: "task1",
        title: "Create wireframes",
        description: "Design wireframes for homepage and product pages",
        status: "completed",
        priority: "high",
        assigned_to: { id: "user2", full_name: "Jane Smith" },
        created_by: { id: "user1", full_name: "John Doe" },
        due_date: "2023-06-15",
        order: 0,
        created_at: "2023-06-01T10:00:00Z",
        updated_at: "2023-06-10T14:30:00Z",
        comments: [
          {
            id: "comment1",
            comment_text: "I've completed the homepage wireframes",
            commented_by: { id: "user2", full_name: "Jane Smith" },
            created_at: "2023-06-10T14:30:00Z",
          },
        ],
      },
      {
        id: "task2",
        title: "Design mockups",
        description: "High-fidelity mockups based on wireframes",
        status: "in_progress",
        priority: "medium",
        assigned_to: { id: "user2", full_name: "Jane Smith" },
        created_by: { id: "user1", full_name: "John Doe" },
        due_date: "2023-06-30",
        order: 1,
        created_at: "2023-06-16T09:00:00Z",
        updated_at: "2023-06-17T09:00:00Z",
        comments: [],
      },
    ],
  },
  {
    id: "project2",
    name: "Mobile App",
    description: "iOS and Android app development",
    organization: {
      id: "org2",
      name: "TechFlow",
    },
    created_by: {
      id: "user1",
      full_name: "John Doe",
    },
    members: [{ id: "user1", full_name: "John Doe", role: "admin" }],
    tasks: [
      {
        id: "task3",
        title: "App architecture",
        description: "Plan architecture and stack",
        status: "in_progress",
        priority: "low",
        assigned_to: { id: "user1", full_name: "John Doe" },
        created_by: { id: "user1", full_name: "John Doe" },
        due_date: "2023-06-20",
        order: 0,
        created_at: "2023-06-05T11:00:00Z",
        updated_at: "2023-06-06T11:00:00Z",
        comments: [],
      },
    ],
  },
];

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(mockProjects);

  const getProjects = () => projects || [];

  const getProject = (projectId) =>
    projects.find((project) => project.id === projectId);

  const addProject = (newProject) => {
    if (!newProject.name || !newProject.organization?.id) {
      throw new Error("Project name and organization ID are required");
    }
    const id = `project-${Date.now()}`;
    const createdProject = {
      id,
      name: newProject.name,
      description: newProject.description || "",
      organization: {
        id: newProject.organization.id,
        name: newProject.organization.name || "Unknown Organization",
      },
      created_by: newProject.created_by || {
        id: "user1",
        full_name: "Unknown User",
        email: "unknown@example.com",
      },
      members: newProject.members || [],
      tasks: newProject.tasks || [],
    };
    setProjects([...projects, createdProject]);
    return createdProject;
  };

  const updateProject = (updatedProject) => {
    if (!updatedProject.id || !updatedProject.name) {
      throw new Error("Project ID and name are required for update");
    }
    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    return updatedProject;
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter((p) => p.id !== projectId));
  };

  const addTask = (projectId, newTask) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: [...project.tasks, newTask],
            }
          : project
      )
    );
  };

  const updateTask = (updatedTask) => {
    setProjects(
      projects.map((project) => {
        if (project.tasks.some((task) => task.id === updatedTask.id)) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          };
        }
        return project;
      })
    );
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setProjects(
      projects.map((project) => {
        if (project.tasks.some((task) => task.id === taskId)) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === taskId ? { ...task, status: newStatus } : task
            ),
          };
        }
        return project;
      })
    );
  };

  const deleteTask = (taskId) => {
    setProjects(
      projects.map((project) =>
        project.tasks.some((task) => task.id === taskId)
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            }
          : project
      )
    );
  };

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
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);