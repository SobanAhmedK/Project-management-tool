import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  XMarkIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  TrashIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  FlagIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from "@heroicons/react/24/outline"
import { SparklesIcon, FireIcon, BoltIcon } from "@heroicons/react/24/solid"
import { useProject } from "@context/ProjectContext" // Adjust import path as needed

const Avatar = ({ name, size = "md" }) => {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base"
  }
  
  return (
    <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium ${sizes[size]}`}>
      {name}
    </div>
  )
}

const TaskDetail = ({ task, onClose, onStatusChange, onTaskUpdate }) => {
  const { updateTask, getProject, currentUser } = useProject()
  const [editMode, setEditMode] = useState(false)
  const [editedTask, setEditedTask] = useState({ ...task })
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDeletingComment, setIsDeletingComment] = useState(null)
  const [activeTab, setActiveTab] = useState("details")

  // Status mapping
  const statusMap = {
    "todo": "todo",
    "in-progress": "in_progress",
    "done": "completed"
  }

  const reverseStatusMap = {
    "todo": "todo",
    "in_progress": "in-progress",
    "completed": "done"
  }

  const statusData = {
    "todo": {
      color: "bg-gray-100 text-gray-700 ring-gray-200",
      icon: <ClockIcon className="w-4 h-4" />
    },
    "in-progress": {
      color: "bg-blue-100 text-blue-700 ring-blue-200",
      icon: <BoltIcon className="w-4 h-4 text-blue-500" />
    },
    "done": {
      color: "bg-green-100 text-green-700 ring-green-200",
      icon: <CheckCircleIcon className="w-4 h-4 text-green-500" />
    }
  }

  const priorityData = {
    "low": {
      color: "bg-emerald-100 text-emerald-700 ring-emerald-200",
      icon: <ArrowDownCircleIcon className="w-4 h-4 text-emerald-500" />
    },
    "medium": {
      color: "bg-amber-100 text-amber-700 ring-amber-200",
      icon: <FlagIcon className="w-4 h-4 text-amber-500" />
    },
    "high": {
      color: "bg-rose-100 text-rose-700 ring-rose-200",
      icon: <FireIcon className="w-4 h-4 text-rose-500" />
    }
  }

  // Update editedTask when task prop changes
  useEffect(() => {
    setEditedTask({ ...task })
  }, [task])

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const taskToUpdate = {
        ...editedTask,
        status: statusMap[editedTask.status] || editedTask.status,
        updated_at: new Date().toISOString()
      }
      
      const updatedTask = await updateTask(taskToUpdate)
      
      // Notify parent component of the update
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask)
      }
      
      setIsSuccess(true)
      setTimeout(() => {
        setEditMode(false)
        setIsSubmitting(false)
        setIsSuccess(false)
        
        // Notify parent if status changed
        if (task.status !== editedTask.status && onStatusChange) {
          onStatusChange(updatedTask.status)
        }
      }, 800)
    } catch (error) {
      setIsSubmitting(false)
      console.error("Error updating task:", error)
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return

    const newComment = {
      id: `comment-${Date.now()}`,
      comment_text: comment,
      commented_by: { 
        id: currentUser.id, 
        full_name: currentUser.full_name,
        avatar: currentUser.avatar
      },
      created_at: new Date().toISOString(),
    }

    const updatedTask = {
      ...editedTask,
      comments: [...(editedTask.comments || []), newComment],
      updated_at: new Date().toISOString()
    }

    try {
      setIsSubmitting(true)
      const savedTask = await updateTask(updatedTask)
      setEditedTask(savedTask)
      setComment("")
      
      // Notify parent component of the update
      if (onTaskUpdate) {
        onTaskUpdate(savedTask)
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    setIsDeletingComment(commentId)
    try {
      const updatedComments = (editedTask.comments || []).filter(
        c => c.id !== commentId
      )
      const updatedTask = {
        ...editedTask,
        comments: updatedComments,
        updated_at: new Date().toISOString()
      }
      
      const savedTask = await updateTask(updatedTask)
      setEditedTask(savedTask)
      
      // Notify parent component of the update
      if (onTaskUpdate) {
        onTaskUpdate(savedTask)
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
    } finally {
      setIsDeletingComment(null)
    }
  }

  const project = getProject(task.projectId)
  const members = project?.members || []

  const canDeleteComment = (comment) => {
    return currentUser.id === comment.commented_by.id || currentUser.role === 'admin'
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center z-[9999] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800 dark:bg-gray-900"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
              <DocumentTextIcon className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {editMode ? (
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                />
              ) : (
                <span className="truncate max-w-[80%] block">{task.title}</span>
              )}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={onClose}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100 dark:border-gray-800">
          <div className="flex px-6">
            <button
              className={`px-4 py-3 text-sm font-medium relative ${activeTab === "details" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
              onClick={() => setActiveTab("details")}
            >
              Details
              {activeTab === "details" && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                  layoutId="tabIndicator"
                />
              )}
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium relative ${activeTab === "comments" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
              onClick={() => setActiveTab("comments")}
            >
              Comments ({task.comments?.length || 0})
              {activeTab === "comments" && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                  layoutId="tabIndicator"
                />
              )}
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium relative ${activeTab === "activity" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
              onClick={() => setActiveTab("activity")}
            >
              Activity
              {activeTab === "activity" && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                  layoutId="tabIndicator"
                />
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "details" && (
            <>
              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Status</label>
                  {editMode ? (
                    <select
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={editedTask.status}
                      onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  ) : (
                    <div className={`text-sm px-3 py-2 rounded-lg font-medium ring-1 flex items-center space-x-2 ${statusData[reverseStatusMap[task.status]]?.color || 'bg-gray-100 text-gray-700 ring-gray-200'}`}>
                      {statusData[reverseStatusMap[task.status]]?.icon || <ClockIcon className="w-4 h-4" />}
                      <span>
                        {reverseStatusMap[task.status] === "todo" && "To Do"}
                        {reverseStatusMap[task.status] === "in-progress" && "In Progress"}
                        {reverseStatusMap[task.status] === "done" && "Done"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Priority</label>
                  {editMode ? (
                    <select
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={editedTask.priority}
                      onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  ) : (
                    <div className={`text-sm px-3 py-2 rounded-lg font-medium ring-1 flex items-center space-x-2 ${priorityData[task.priority]?.color || 'bg-gray-100 text-gray-700 ring-gray-200'}`}>
                      {priorityData[task.priority]?.icon || <FlagIcon className="w-4 h-4" />}
                      <span>{task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || 'Medium'}</span>
                    </div>
                  )}
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Assignee</label>
                  {editMode ? (
                    <select
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={editedTask.assigned_to?.id || ""}
                      onChange={(e) => {
                        const selectedMember = members.find(m => m.id === e.target.value)
                        setEditedTask({
                          ...editedTask,
                          assigned_to: selectedMember ? { 
                            id: selectedMember.id, 
                            full_name: selectedMember.full_name,
                            avatar: selectedMember.avatar
                          } : null
                        })
                      }}
                    >
                      <option value="">Unassigned</option>
                      {members.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.full_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700">
                      {task.assigned_to ? (
                        <>
                          <Avatar name={task.assigned_to.avatar || task.assigned_to.full_name?.charAt(0)} size="sm" />
                          <span className="ml-2 text-gray-700 dark:text-gray-200">{task.assigned_to.full_name}</span>
                        </>
                      ) : (
                        <>
                          <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-500 dark:text-gray-400">Unassigned</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Due Date</label>
                  {editMode ? (
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={editedTask.due_date ? new Date(editedTask.due_date).toISOString().split("T")[0] : ""}
                      onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center text-sm px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700">
                      <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-200">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) : "No due date"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</label>
                  {!editMode && (
                    <button 
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
                      onClick={() => setEditMode(true)}
                    >
                      <PencilSquareIcon className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                  )}
                </div>
                {editMode ? (
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[150px] resize-y"
                    value={editedTask.description || ""}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    placeholder="Add a detailed description..."
                  />
                ) : (
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700">
                    {task.description ? (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{task.description}</p>
                    ) : (
                      <p className="text-gray-400 dark:text-gray-500 italic">No description provided</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "comments" && (
            <div className="space-y-6">
              {/* Comment List */}
              <div className="space-y-4">
                {(editedTask.comments || []).length > 0 ? (
                  (editedTask.comments || []).map((comment) => (
                    <motion.div 
                      key={comment.id} 
                      className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm relative group hover:shadow-md transition-all"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar name={comment.commented_by.avatar || comment.commented_by.full_name?.charAt(0)} size="sm" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                {comment.commented_by.full_name}
                              </span>
                              {comment.commented_by.id === currentUser.id && (
                                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">You</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(comment.created_at).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{comment.comment_text}</p>
                        </div>
                      </div>
                      
                      {canDeleteComment(comment) && (
                        <button
                          className="absolute top-10 right-4 p-1.5 rounded-full opacity-100 transition-all text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={isDeletingComment === comment.id}
                        >
                          {isDeletingComment === comment.id ? (
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                          ) : (
                            <TrashIcon className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="p-6 text-center rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Comment Form */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar name={currentUser.avatar || currentUser.full_name?.charAt(0)} size="sm" />
                  <div className="flex-1">
                    <textarea
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                      placeholder="Write a comment..."
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !isSubmitting) {
                          e.preventDefault()
                          handleAddComment()
                        }
                      }}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    className={`px-4 py-2 rounded-xl flex items-center font-medium transition-all ${
                      isSubmitting
                        ? 'bg-indigo-400 text-white cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                    onClick={handleAddComment}
                    disabled={isSubmitting || !comment.trim()}
                  >
                    {isSubmitting ? (
                      <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                    )}
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <div className="p-6 text-center rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <SparklesIcon className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Activity log coming soon</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-800/50">
          {editMode ? (
            <div className="flex justify-between gap-3">
              <button
                className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium flex items-center"
                onClick={() => {
                  setEditedTask({ ...task })
                  setEditMode(false)
                }}
                disabled={isSubmitting}
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button 
                className={`px-5 py-2.5 rounded-xl text-white font-medium flex items-center transition-all ${
                  isSubmitting 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : isSuccess 
                      ? 'bg-green-500' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex justify-between gap-3">
              <button 
                className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium flex items-center"
                onClick={() => {
                  // Attachment functionality would go here
                }}
              >
                <PaperClipIcon className="w-4 h-4 mr-2" />
                Attach File
              </button>
              <button 
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium flex items-center"
                onClick={() => setEditMode(true)}
              >
                <PencilSquareIcon className="w-4 h-4 mr-2" />
                Edit Task
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TaskDetail