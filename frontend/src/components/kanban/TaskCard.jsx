



import { Draggable } from "react-beautiful-dnd"
import { memo } from "react"
import { TagIcon, CalendarDaysIcon, UserCircleIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Memoize TaskCard to prevent unnecessary re-renders
const TaskCard = memo(({ task, index, onClick }) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": 
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
      case "medium": 
        return <ClockIcon className="w-4 h-4 text-yellow-500" />
      case "low": 
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      default: 
        return <ClockIcon className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-50 text-red-700 border-red-200",
      medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
      low: "bg-green-50 text-green-700 border-green-200",
    }
    return colors[priority] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => !snapshot.isDragging && onClick()}
          className={`mb-3 rounded-lg border ${
            snapshot.isDragging 
              ? "shadow-lg border-blue-300 z-50" 
              : "shadow-sm border-gray-200 hover:border-gray-300 hover:shadow"
          } bg-white transition-all`}
          style={{
            ...provided.draggableProps.style,
            // Simple rotation instead of complex animations
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform} rotate(${Math.random() > 0.5 ? 1 : -1}deg)`
              : provided.draggableProps.style?.transform,
            zIndex: snapshot.isDragging ? 9999 : 'auto'
          }}
        >
          <div className="p-3">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800 text-sm line-clamp-2 flex-1 pr-2">
                {task.title}
              </h4>
              <div className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getPriorityColor(task.priority)} shrink-0`}>
                {getPriorityIcon(task.priority)}
                <span className="capitalize">{task.priority}</span>
              </div>
            </div>

            {task.description && (
              <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center truncate">
                <UserCircleIcon className="w-3 h-3 mr-1 shrink-0" />
                <span className="truncate max-w-[120px]">
                  {task.assigned_to?.full_name || "Unassigned"}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {task.due_date && (
                  <div className="flex items-center shrink-0 bg-gray-50 px-2 py-1 rounded">
                    <CalendarDaysIcon className="w-3 h-3 mr-1" />
                    <span>{new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}

                {task.tags?.length > 0 && (
                  <div className="flex items-center shrink-0 bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                    <TagIcon className="w-3 h-3 mr-1" />
                    <span className="truncate max-w-[60px]">{task.tags[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="h-1 w-full rounded-b-lg overflow-hidden">
            <div 
              className={
                task.status === "completed" ? "bg-green-500 h-full" :
                task.status === "in_progress" ? "bg-indigo-500 h-full w-1/2" :
                "bg-gray-200 h-full"
              }
            ></div>
          </div>
        </div>
      )}
    </Draggable>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for memo - only re-render if these props change
  return prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.index === nextProps.index;
});

export default TaskCard;