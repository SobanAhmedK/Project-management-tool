"use client"

import { Droppable } from "react-beautiful-dnd"
import TaskCard from "./TaskCard"
import { motion } from "framer-motion"

const TaskColumn = ({ column, tasks, onTaskClick }) => {
  return (
    <motion.div 
      className="flex-1 bg-gray-50 rounded-lg p-4 flex flex-col min-w-[300px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-semibold text-lg mb-4 text-gray-700 sticky top-0 bg-gray-50 py-2 z-10">
        {column.title} <span className="text-gray-500">({tasks.length})</span>
      </h2>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 transition-colors duration-200 rounded-md p-2 overflow-y-auto ${
              snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={() => onTaskClick(task.id)}
              />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-center text-gray-400 py-4 text-sm">
                No tasks in this column
              </div>
            )}
          </div>
        )}
      </Droppable>
    </motion.div>
  )
}

export default TaskColumn