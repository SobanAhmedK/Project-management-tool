"use client"

import { Draggable } from "react-beautiful-dnd"
import { motion } from "framer-motion"
import { CalendarIcon, UserIcon, TagIcon } from "@heroicons/react/outline"

const TaskCard = ({ task, index, onClick }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    }
    return colors[priority] || "bg-gray-100 text-gray-800"
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`mb-3 rounded-lg border ${
            snapshot.isDragging 
              ? "shadow-xl bg-white border-blue-400" 
              : "bg-white border-gray-200 hover:border-gray-300"
          } transition-all duration-150`}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: snapshot.isDragging ? 1.05 : 1,
            boxShadow: snapshot.isDragging 
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
              : "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
          }}
          transition={{ 
            type: "spring",
            damping: 20,
            stiffness: 300,
            opacity: { duration: 0.2 }
          }}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform} rotate(1deg)`
              : provided.draggableProps.style?.transform,
          }}
          layout
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800 text-sm line-clamp-2">
                {task.title}
              </h4>
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)} shrink-0`}>
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p className="text-gray-600 text-xs mb-3 line-clamp-3">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 space-x-2">
              <div className="flex items-center truncate">
                <UserIcon className="w-3 h-3 mr-1 shrink-0" />
                <span className="truncate">{task.assignee?.name || "Unassigned"}</span>
              </div>

              <div className="flex items-center space-x-2">
                {task.dueDate && (
                  <div className="flex items-center shrink-0">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}

                {task.tags?.length > 0 && (
                  <div className="flex items-center shrink-0">
                    <TagIcon className="w-3 h-3 mr-1" />
                    <span className="truncate max-w-[80px]">{task.tags[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </Draggable>
  )
}

export default TaskCard