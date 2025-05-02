import { useState, useEffect, useCallback, useMemo } from "react";
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
  const { getProject, updateTaskStatus, updateTaskPositions } = useProject();
  const { currentOrganization } = useOrganization();
  const { currentUser } = useAuth();
  const project = getProject(projectId);
  const [columns, setColumns] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState("board");

  const isAdminOrManager = project?.members?.find(m => m.id === currentUser?.id)?.role === "Admin" || 
                          project?.members?.find(m => m.id === currentUser?.id)?.role === "Manager";

  const initialColumns = useMemo(() => {
    if (!project?.tasks) return null;

    return {
      todo: {
        id: "todo",
        title: "To Do",
        taskIds: project.tasks
          .filter(task => task.status === "todo")
          .sort((a, b) => a.order - b.order)
          .map(task => task.id),
      },
      "in-progress": {
        id: "in-progress",
        title: "In Progress",
        taskIds: project.tasks
          .filter(task => task.status === "in_progress")
          .sort((a, b) => a.order - b.order)
          .map(task => task.id),
      },
      done: {
        id: "done",
        title: "Done",
        taskIds: project.tasks
          .filter(task => task.status === "completed")
          .sort((a, b) => a.order - b.order)
          .map(task => task.id),
      },
    };
  }, [project]);

  // Update columns when project changes
  useEffect(() => {
    if (initialColumns) {
      setColumns(initialColumns);
    }
  }, [initialColumns]);

  const handleDragStart = () => {
    // Minimal operations during drag start
  };

  const handleDragEnd = useCallback(async (result) => {
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

    // Moving within the same column
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      setColumns(prev => ({
        ...prev,
        [newColumn.id]: newColumn,
      }));

      setTimeout(() => {
        updateTaskPositions(newColumn.taskIds);
      }, 10);
    } else {
      // Moving to a different column
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finishColumn.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finishColumn,
        taskIds: finishTaskIds,
      };

      setColumns(prev => ({
        ...prev,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      }));

      const statusMap = {
        "todo": "todo",
        "in-progress": "in_progress",
        "done": "completed"
      };
      
      setTimeout(() => {
        const taskToUpdate = project.tasks.find(t => t.id === draggableId);
        if (taskToUpdate) {
          taskToUpdate.status = statusMap[finishColumn.id];
        }
        
        Promise.all([
          updateTaskStatus(draggableId, statusMap[finishColumn.id]),
          updateTaskPositions(newStart.taskIds, startColumn.id),
          updateTaskPositions(newFinish.taskIds, finishColumn.id),
        ]);
      }, 10);
    }
  }, [columns, project, updateTaskStatus, updateTaskPositions]);

  const handleTaskClick = useCallback((taskId) => {
    const task = project?.tasks.find(t => t.id === taskId);
    setSelectedTask(task);
  }, [project]);

  const closeTaskDetail = useCallback(() => {
    setSelectedTask(null);
  }, []);

  // Memoize task lookup for better performance
  const columnTasks = useMemo(() => {
    if (!columns || !project?.tasks) return {};
    
    const result = {};
    Object.keys(columns).forEach(columnId => {
      result[columnId] = columns[columnId].taskIds
        .map(taskId => project.tasks.find(task => task.id === taskId))
        .filter(Boolean);
    });
    
    return result;
  }, [columns, project]);

  if (!project || !columns) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          title={currentOrganization 
            ? `${currentOrganization.name} / ${project.name}` 
            : project.name
          } 
        />
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("board")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "board"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Board
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "members"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Members
              </button>
              {isAdminOrManager && (
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "settings"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Settings
                </button>
              )}
            </nav>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === "board" ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-bold text-gray-800">
                    {project.name} Board
                  </h1>
                  <AddTaskButton projectId={projectId} />
                </div>

                <div className="mb-8">
                  <DragDropContext 
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex space-x-4 h-[calc(100vh-180px)] min-w-max pb-6">
                      {Object.values(columns).map((column, index) => (
                        <TaskColumn
                          key={column.id}
                          column={column}
                          tasks={columnTasks[column.id] || []}
                          onTaskClick={handleTaskClick}
                          index={index}
                        />
                      ))}
                    </div>
                  </DragDropContext>
                </div>
              </>
            ) : activeTab === "members" ? (
              <ProjectMembers />
            ) : (
              <ProjectSettings project={project} />
            )}
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={closeTaskDetail}
          project={project}
          onStatusChange={(newStatus) => {
            const statusMap = {
              "todo": "todo",
              "in-progress": "in_progress",
              "done": "completed"
            };
            updateTaskStatus(selectedTask.id, statusMap[newStatus]);
            closeTaskDetail();
          }}
        />
      )}
    </div>
  );
};

export default ProjectBoard;