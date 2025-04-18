"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PlusIcon, XIcon } from "@heroicons/react/outline"
import { useProject } from "../../context/ProjectContext"

const AddTaskButton = ({ projectId }) => {
  const { addTask } = useProject()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignee: null,
    dueDate: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!newTask.title.trim()) return

    addTask(projectId, {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    })

    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignee: null,
      dueDate: "",
    })

    setIsModalOpen(false)
  }

  return (
    <>
      <motion.button
        className="btn-primary flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
      >
        <PlusIcon className="w-5 h-5 mr-1" />
        Add Task
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Add New Task</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="input"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="input min-h-[100px]"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="input"
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      className="input"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                    <select
                      className="input"
                      value={newTask.assignee?.id || ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          setNewTask({
                            ...newTask,
                            assignee: {
                              id: e.target.value,
                              name: e.target.options[e.target.selectedIndex].text,
                            },
                          })
                        } else {
                          setNewTask({
                            ...newTask,
                            assignee: null,
                          })
                        }
                      }}
                    >
                      <option value="">Unassigned</option>
                      <option value="user1">John Doe</option>
                      <option value="user2">Jane Smith</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      className="input"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AddTaskButton
