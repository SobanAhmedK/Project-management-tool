import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "@heroicons/react/24/outline";
import { useTaskForm } from "../../hooks/useTaskForm";
import { priorityOptions, statusOptions, formSections } from "@constants/TaskConstants";

export const AddTaskModal = ({ projectId, isModalOpen, setIsModalOpen }) => {
  const {
    taskData,
    isSubmitting,
    isSuccess,
    expandedSection,
    members,
    handleChange,
    handleMemberSelect,
    handleSubmit,
    toggleSection,
    resetForm
  } = useTaskForm(projectId);

  const closeModal = () => {
    if (!isSubmitting) {
      resetForm();
      setIsModalOpen(false);
    }
  };

  const navigateSection = (direction) => {
    const currentIndex = formSections.findIndex(s => s.id === expandedSection);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < formSections.length) {
      toggleSection(formSections[newIndex].id);
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="z-[9999] fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
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
                  onClick={closeModal}
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
                {formSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      expandedSection === section.id 
                        ? "bg-white text-blue-600" 
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    {section.label}
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
                  onClick={() => navigateSection('prev')}
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
                      navigateSection('next');
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
  );
};