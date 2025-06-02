import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  PlusIcon, 
  XMarkIcon, 
  CheckIcon,
  ArrowPathIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  Bars3Icon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline"
import { useProject } from "@/context/ProjectContext"
import { useAuth } from "@/context/AuthContext"

const AddTaskButton = ({ projectId }) => {
  const { addTask, getProject } = useProject()
  const { currentUser } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [expandedSection, setExpandedSection] = useState("basic")

  const project = getProject(projectId)
  const members = project?.members || []

  // Improved state management with single handler
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assigned_to: currentUser ? { 
      id: currentUser.id, 
      full_name: currentUser.full_name 
    } : null,
    due_date: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setTaskData(prev => ({ ...prev, [name]: value }))
  }

  const handleMemberSelect = (e) => {
    const selectedMember = members.find(m => m.id === e.target.value)
    setTaskData(prev => ({
      ...prev,
      assigned_to: selectedMember ? { 
        id: selectedMember.id, 
        full_name: selectedMember.full_name 
      } : null
    }))
  }

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-red-100 text-red-800" }
  ]

  const statusOptions = [
    { value: "todo", label: "To Do", color: "bg-gray-100 text-gray-800" },
    { value: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
    { value: "completed", label: "Done", color: "bg-green-100 text-green-800" }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!taskData.title.trim()) return

    setIsSubmitting(true)

    try {
      await addTask(projectId, {
        ...taskData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        order: project?.tasks?.length || 0,
        created_by: {
          id: currentUser?.id || "user1",
          full_name: currentUser?.name || "Current User",
        },
        updated_at: new Date().toISOString()
      })

      setIsSuccess(true)
      
      setTimeout(() => {
        setIsSubmitting(false)
        setIsSuccess(false)
        setIsModalOpen(false)
        setTaskData({
          title: "",
          description: "",
          status: "todo",
          priority: "medium",
          assigned_to: currentUser ? { 
            id: currentUser.id, 
            full_name: currentUser.full_name 
          } : null,
          due_date: "",
        })
        setExpandedSection("basic")
      }, 1000)
    } catch (error) {
      setIsSubmitting(false)
      console.error("Error adding task:", error)
    }
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <>
      {/* Floating Add Button - Keeping your beautiful design */}
      <motion.button
        className="z-[9999] fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-cyan-400 to-indigo-800 text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      > 
        <div className="font-bold">Add Task </div>
        <PlusIcon className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="z-[9999] fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Create New Task</h2>
                  <button 
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    onClick={() => !isSubmitting && setIsModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <motion.div 
                  className="flex space-x-2 mt-4 overflow-x-auto pb-2 scrollbar-hide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {["basic", "details", "assign"].map((section) => (
                    <button
                      key={section}
                      onClick={() => toggleSection(section)}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        expandedSection === section 
                          ? "bg-white text-blue-600" 
                          : "bg-white/20 hover:bg-white/30"
                      }`}
                    >
                      {section === "basic" && "Basic Info"}
                      {section === "details" && "Details"}
                      {section === "assign" && "Assignment"}
                    </button>
                  ))}
                </motion.div>
              </div>

              <form onSubmit={handleSubmit} className="p-5">
                {/* Basic Info Section */}
                <motion.div
                  animate={{
                    height: expandedSection === "basic" ? "auto" : 0,
                    opacity: expandedSection === "basic" ? 1 : 0,
                    marginBottom: expandedSection === "basic" ? "1.5rem" : 0
                  }}
                  transition={{ type: "spring", damping: 25 }}
                  className="overflow-hidden"
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="title"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pl-10"
                        value={taskData.title}
                        onChange={handleChange}
                        placeholder="What needs to be done?"
                        required
                        disabled={isSubmitting}
                        autoFocus
                      />
                      <Bars3Icon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
                      value={taskData.description}
                      onChange={handleChange}
                      placeholder="Add details (optional)"
                      disabled={isSubmitting}
                    />
                  </div>
                </motion.div>

                {/* Details Section */}
                <motion.div
                  animate={{
                    height: expandedSection === "details" ? "auto" : 0,
                    opacity: expandedSection === "details" ? 1 : 0,
                    marginBottom: expandedSection === "details" ? "1.5rem" : 0
                  }}
                  transition={{ type: "spring", damping: 25 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <div className="relative">
                        <select
                          name="status"
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition pr-8"
                          value={taskData.status}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <ArrowDownIcon className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <div className="relative">
                        <select
                          name="priority"
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition pr-8"
                          value={taskData.priority}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        >
                          {priorityOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <ArrowDownIcon className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Assignment Section */}
                <motion.div
                  animate={{
                    height: expandedSection === "assign" ? "auto" : 0,
                    opacity: expandedSection === "assign" ? 1 : 0,
                    marginBottom: expandedSection === "assign" ? "1.5rem" : 0
                  }}
                  transition={{ type: "spring", damping: 25 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                      <div className="relative">
                        <select
                          className="w-full pt-3.5 p-3 pl-9 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition pr-8"
                          value={taskData.assigned_to?.id || ""}
                          onChange={handleMemberSelect}
                          disabled={isSubmitting}
                        >
                          <option value="">Unassigned</option>
                          {members.map(member => (
                            <option key={member.id} value={member.id}>
                              {member.full_name}
                            </option>
                          ))}
                        </select>
                        <UserCircleIcon className="absolute left-2 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="due_date"
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pl-10"
                          value={taskData.due_date}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <CalendarDaysIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <motion.button
                    type="button"
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg flex items-center"
                    onClick={() => {
                      const sections = ["basic", "details", "assign"]
                      const currentIndex = sections.indexOf(expandedSection)
                      const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null
                      if (prevSection) setExpandedSection(prevSection)
                    }}
                    whileHover={{ x: -2 }}
                    disabled={expandedSection === "basic" || isSubmitting}
                  >
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                    Previous
                  </motion.button>

                  {expandedSection === "assign" ? (
                    <motion.button 
                      type="submit" 
                      className={`px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center min-w-[120px] ${
                        isSubmitting 
                          ? 'bg-blue-400' 
                          : isSuccess 
                            ? 'bg-green-500' 
                            : 'bg-blue-500 hover:bg-blue-600'
                      } transition-colors shadow-md`}
                      whileHover={!isSubmitting && !isSuccess ? { scale: 1.03 } : {}}
                      whileTap={!isSubmitting && !isSuccess ? { scale: 0.97 } : {}}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckIcon className="w-5 h-5 mr-1" />
                          Task Created!
                        </>
                      ) : (
                        <>
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Create Task
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl flex items-center justify-center shadow-md hover:bg-blue-600"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const sections = ["basic", "details", "assign"];
                        const currentIndex = sections.indexOf(expandedSection);
                        const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;
                        if (nextSection) setExpandedSection(nextSection);
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Next
                      <ArrowDownIcon className="w-4 h-4 ml-2" />
                    </motion.button>
                  )}
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