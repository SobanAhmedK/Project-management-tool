import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon, DocumentIcon } from "@heroicons/react/24/outline"

const ProjectModal = ({ isOpen, onClose, onSave, formData, setFormData, isEditing }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-indigo-50">
                  <DocumentIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditing ? "Edit Project" : "Add Project"}
                </h2>
              </div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={onSave} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Project name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Project description"
                    rows="3"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  {isEditing ? "Save Changes" : "Create Project"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProjectModal