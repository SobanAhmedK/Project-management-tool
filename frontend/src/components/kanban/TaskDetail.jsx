"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { XIcon, UserIcon, CalendarIcon, ChatIcon, PaperClipIcon } from "@heroicons/react/outline"
import { useProject } from "../../context/ProjectContext"

const TaskDetail = ({ task, onClose }) => {
  const { updateTask } = useProject()
  const [editMode, setEditMode] = useState(false)
  const [editedTask, setEditedTask] = useState({ ...task })
  const [comment, setComment] = useState("")

  const handleSave = () => {
    updateTask(editedTask)
    setEditMode(false)
  }

  const handleAddComment = () => {
    if (!comment.trim()) return

    const newComment = {
      id: Date.now().toString(),
      text: comment,
      author: { id: "current-user", name: "Current User" }, // Replace with actual user
      createdAt: new Date().toISOString(),
    }

    const updatedTask = {
      ...editedTask,
      comments: [...(editedTask.comments || []), newComment],
    }

    setEditedTask(updatedTask)
    updateTask(updatedTask)
    setComment("")
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editMode ? (
              <input
                type="text"
                className="input"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              />
            ) : (
              task.title
            )}
          </h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              {editMode ? (
                <select
                  className="input"
                  value={editedTask.status}
                  onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              ) : (
                <div className="text-sm bg-gray-100 p-2 rounded">
                  {task.status === "todo" && "To Do"}
                  {task.status === "in-progress" && "In Progress"}
                  {task.status === "review" && "Review"}
                  {task.status === "done" && "Done"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              {editMode ? (
                <select
                  className="input"
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <div className="text-sm bg-gray-100 p-2 rounded">{task.priority}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              {editMode ? (
                <select
                  className="input"
                  value={editedTask.assignee?.id || ""}
                  onChange={(e) => {
                    // This would normally fetch user details from a list
                    setEditedTask({
                      ...editedTask,
                      assignee: { id: e.target.value, name: e.target.options[e.target.selectedIndex].text },
                    })
                  }}
                >
                  <option value="">Unassigned</option>
                  <option value="user1">John Doe</option>
                  <option value="user2">Jane Smith</option>
                </select>
              ) : (
                <div className="text-sm bg-gray-100 p-2 rounded flex items-center">
                  <UserIcon className="w-4 h-4 mr-1" />
                  {task.assignee?.name || "Unassigned"}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            {editMode ? (
              <textarea
                className="input min-h-[100px]"
                value={editedTask.description || ""}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              />
            ) : (
              <div className="text-sm bg-gray-100 p-3 rounded min-h-[60px]">
                {task.description || "No description provided."}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            {editMode ? (
              <input
                type="date"
                className="input"
                value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split("T")[0] : ""}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
              />
            ) : (
              <div className="text-sm bg-gray-100 p-2 rounded flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Comments</h3>
            <div className="space-y-3 mb-4">
              {(task.comments || []).map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{comment.author.name}</span>
                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))}

              {(task.comments || []).length === 0 && <p className="text-sm text-gray-500 italic">No comments yet.</p>}
            </div>

            <div className="flex">
              <input
                type="text"
                className="input flex-1 mr-2"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button className="btn-primary flex items-center" onClick={handleAddComment}>
                <ChatIcon className="w-4 h-4 mr-1" />
                Comment
              </button>
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-between">
          {editMode ? (
            <>
              <button
                className="btn-secondary"
                onClick={() => {
                  setEditedTask({ ...task })
                  setEditMode(false)
                }}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary flex items-center">
                <PaperClipIcon className="w-4 h-4 mr-1" />
                Attach
              </button>
              <button className="btn-primary" onClick={() => setEditMode(true)}>
                Edit Task
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TaskDetail
