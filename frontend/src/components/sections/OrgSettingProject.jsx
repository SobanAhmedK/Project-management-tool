import { useState } from "react"
import { motion } from "framer-motion"
import {
  PlusIcon as PlusIconV2,
  TrashIcon as TrashIconV2,
  PencilSquareIcon as EditIconV2,
  BuildingOffice2Icon as BuildingOfficeIconV2
} from "@heroicons/react/24/outline"

const OrgSettingProject = ({ projects, onAddProject, onEditProject, onDeleteProject }) => {
  const [visibleCount, setVisibleCount] = useState(2) // Show 2 projects initially

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 2) // Load next 2 projects
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-5"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-2">
            <BuildingOfficeIconV2 className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
        </div>
        <motion.button
          className="flex items-center px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddProject}
        >
          <PlusIconV2 className="w-4 h-4 mr-1.5" />
          Add Project
        </motion.button>
      </div>

      <div className="space-y-3">
        {projects.slice(0, visibleCount).map((project) => (
          <motion.div
            key={project.id}
            className="flex justify-between items-center p-3 border border-gray-100 rounded-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-800">{project.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {project.description || "No description provided"}
              </p>
            </div>
            <div className="flex space-x-2">
              <motion.button
                className="p-1 text-gray-500 hover:text-indigo-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEditProject(project)}
                title="Edit Project"
              >
                <EditIconV2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="p-1 text-gray-500 hover:text-red-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDeleteProject(project)}
                title="Delete Project"
              >
                <TrashIconV2 className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {visibleCount < projects.length && (
        <div className="mt-4 text-center">
          <motion.button
            className="px-4 py-1.5 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewMore}
          >
            View More
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

export default OrgSettingProject