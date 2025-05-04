import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import TaskColumn from "../components/kanban/TaskColumn";
import TaskDetail from "../components/kanban/TaskDetail";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useProject } from "../context/ProjectContext";
import AddTaskButton from "../components/kanban/AddTaskButton";
import { useOrganization } from "../context/OrganizationContext";
import ProjectMembers from "../components/kanban/ProjectMembers";
import ProjectSettings from "../components/kanban/ProjectSettings";
import { useAuth } from "../context/AuthContext";

const ProjectBoard = () => {
  const { projectId } = useParams();
  const { getProject, updateTaskStatus, updateTaskPositions, getProjectTasks } = useProject();
  const { currentOrganization } = useOrganization();
  const { currentUser } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState("board");
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render trigger
  const [project, setProject] = useState(null);

  // Fetch fresh project data
  useEffect(() => {
    const fetchProjectData = () => {
      const currentProject = getProject(projectId);
      setProject(currentProject);
    };
    
    fetchProjectData();
  }, [projectId, getProject, forceUpdate]);

  const isAdminOrManager =
    project?.members?.find((m) => m.id === currentUser?.id)?.role === "Admin" ||
    project?.members?.find((m) => m.id === currentUser?.id)?.role === "Manager";

  // Memoize columns with project.tasks dependency
  const columns = useMemo(() => {
    if (!project?.tasks) return null;

    return {
      todo: {
        id: "todo",
        title: "To Do",
        taskIds: project.tasks
          .filter((task) => task.status === "todo")
          .sort((a, b) => a.order - b.order)
          .map((task) => task.id),
      },
      "in-progress": {
        id: "in-progress",
        title: "In Progress",
        taskIds: project.tasks
          .filter((task) => task.status === "in_progress")
          .sort((a, b) => a.order - b.order)
          .map((task) => task.id),
      },
      done: {
        id: "done",
        title: "Done",
        taskIds: project.tasks
          .filter((task) => task.status === "completed")
          .sort((a, b) => a.order - b.order)
          .map((task) => task.id),
      },
    };
  }, [project?.tasks]); 

  // Compute columnTasks with columns and project.tasks dependency
  const columnTasks = useMemo(() => {
    if (!columns || !project?.tasks) return {};

    const result = {};
    Object.keys(columns).forEach((columnId) => {
      result[columnId] = columns[columnId].taskIds
        .map((taskId) => project.tasks.find((task) => task.id === taskId))
        .filter(Boolean);
    });
    return result;
  }, [columns, project?.tasks]);

  const handleDragEnd = useCallback(
    async (result) => {
      if (!result.destination || !columns) return;

      const { source, destination, draggableId } = result;

      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      const startColumn = columns[source.droppableId];
      const finishColumn = columns[destination.droppableId];

      if (startColumn === finishColumn) {
        const newTaskIds = Array.from(startColumn.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);
        await updateTaskPositions(newTaskIds, startColumn.id);
      } else {
        const startTaskIds = Array.from(startColumn.taskIds);
        startTaskIds.splice(source.index, 1);
        const finishTaskIds = Array.from(finishColumn.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);

        const statusMap = {
          todo: "todo",
          "in-progress": "in_progress",
          done: "completed",
        };
        await Promise.all([
          updateTaskStatus(draggableId, statusMap[finishColumn.id]),
          updateTaskPositions(startTaskIds, startColumn.id),
          updateTaskPositions(finishTaskIds, finishColumn.id),
        ]);
      }
      setForceUpdate(prev => prev + 1); // Force re-render after drag
    },
    [columns, updateTaskStatus, updateTaskPositions]
  );

  const handleTaskClick = useCallback(
    (taskId) => {
      // Always get the most current version of the task from the project
      const task = project?.tasks.find((t) => t.id === taskId);
      setSelectedTask(task);
    },
    [project?.tasks]
  );

  const closeTaskDetail = useCallback(() => {
    setSelectedTask(null);
  }, []);

  const handleTaskUpdate = useCallback((updatedTask) => {
    // Update the local selectedTask state
    setSelectedTask(updatedTask);
    
    // Trigger a refresh of the whole project data
    setForceUpdate(prev => prev + 1);
    
    // If the task is currently selected, make sure we have the latest version
    if (selectedTask && selectedTask.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  }, [selectedTask]);

  if (!project || !columns) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ">
        <Navbar
          title={
            currentOrganization
              ? ` Organization ${currentOrganization}`
              : project.name
          }
        />
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("board")}
              className={`py-4 ${
                activeTab === "board" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`py-4 ${
                activeTab === "members" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              Members
            </button>
            {isAdminOrManager && (
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-4 ${
                  activeTab === "settings" ? "border-b-2 border-blue-500" : ""
                }`}
              >
                Settings
              </button>
            )}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "board" ? (
            <>
              <div className="flex justify-between mb-6">
                <h1 className="font-[700]">{project.name} Board</h1>
                <AddTaskButton projectId={projectId} />
              </div>
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex space-x-4">
                  {Object.values(columns).map((column) => (
                    <TaskColumn
                      key={column.id}
                      column={column}
                      tasks={columnTasks[column.id] || []}
                      onTaskClick={handleTaskClick}
                    />
                  ))}
                </div>
              </DragDropContext>
            </>
          ) : activeTab === "members" ? (
            <ProjectMembers />
          ) : (
            <ProjectSettings project={project} />
          )}
        </div>
      </div>
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => {
            closeTaskDetail();
            setForceUpdate(prev => prev + 1);
          }}
          onStatusChange={(newStatus) => {
            updateTaskStatus(selectedTask.id, newStatus);
            setForceUpdate(prev => prev + 1);
          }}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default ProjectBoard;