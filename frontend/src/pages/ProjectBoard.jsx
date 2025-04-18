"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { DragDropContext } from "react-beautiful-dnd"
import { motion } from "framer-motion"
import TaskColumn from "../components/kanban/TaskColumn"
import TaskDetail from "../components/kanban/TaskDetail"
import Navbar from "../components/layout/Navbar"
import Sidebar from "../components/layout/Sidebar"
import { useProject } from "../context/ProjectContext"
import AddTaskButton from "../components/kanban/AddTaskButton"

const ProjectBoard = () => {
  const { projectId } = useParams()
  const { getProject, updateTaskStatus } = useProject()
  const project = getProject(projectId)
  const [columns, setColumns] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  // Initialize and sync columns with project data
  const initializeColumns = useCallback(() => {
    if (!project?.tasks) return null

    return {
      todo: {
        id: "todo",
        title: "To Do",
        taskIds: project.tasks
          .filter(task => task.status === "todo")
          .sort((a, b) => a.position - b.position)
          .map(task => task.id),
      },
      "in-progress": {
        id: "in-progress",
        title: "In Progress",
        taskIds: project.tasks
          .filter(task => task.status === "in-progress")
          .sort((a, b) => a.position - b.position)
          .map(task => task.id),
      },
      done: {
        id: "done",
        title: "Done",
        taskIds: project.tasks
          .filter(task => task.status === "done")
          .sort((a, b) => a.position - b.position)
          .map(task => task.id),
      },
    }
  }, [project])

  useEffect(() => {
    if (project) {
      setColumns(initializeColumns())
    }
  }, [project, initializeColumns])

  const handleDragEnd = async (result) => {
    if (!result.destination || !columns) return

    const { source, destination, draggableId } = result

    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const startColumn = columns[source.droppableId]
    const finishColumn = columns[destination.droppableId]

    // Moving within the same column
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      }

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      })

      // Update positions in the database
      await updateTaskPositions(newColumn.taskIds)
    } else {
      // Moving to a different column
      const startTaskIds = Array.from(startColumn.taskIds)
      startTaskIds.splice(source.index, 1)
      const newStart = {
        ...startColumn,
        taskIds: startTaskIds,
      }

      const finishTaskIds = Array.from(finishColumn.taskIds)
      finishTaskIds.splice(destination.index, 0, draggableId)
      const newFinish = {
        ...finishColumn,
        taskIds: finishTaskIds,
      }

      setColumns({
        ...columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      })

      // Update both status and positions
      await Promise.all([
        updateTaskStatus(draggableId, finishColumn.id),
        updateTaskPositions(newStart.taskIds, startColumn.id),
        updateTaskPositions(newFinish.taskIds, finishColumn.id),
      ])
    }
  }

  const updateTaskPositions = async (taskIds, columnId) => {
    // Implement this function in your ProjectContext to update task positions
    // This should update the 'position' field of each task based on their index
  }

  const handleTaskClick = (taskId) => {
    const task = project.tasks.find(t => t.id === taskId)
    setSelectedTask(task)
  }

  const closeTaskDetail = () => {
    setSelectedTask(null)
  }

  if (!project || !columns) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={project.name} />
        <motion.div
          className="flex-1 overflow-x-auto p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{project.name} Board</h1>
            <AddTaskButton projectId={projectId} />
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex space-x-4 h-[calc(100vh-180px)] min-w-max">
              {Object.values(columns).map((column) => {
                const tasks = column.taskIds
                  .map(taskId => project.tasks.find(task => task.id === taskId))
                  .filter(Boolean)
                return (
                  <TaskColumn
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    onTaskClick={handleTaskClick}
                  />
                )
              })}
            </div>
          </DragDropContext>
        </motion.div>
      </div>

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={closeTaskDetail}
          onStatusChange={(newStatus) => {
            updateTaskStatus(selectedTask.id, newStatus)
            closeTaskDetail()
          }}
        />
      )}
    </div>
  )
}

export default ProjectBoard