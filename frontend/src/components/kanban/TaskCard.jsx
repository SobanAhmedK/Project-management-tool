import { Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import { 
  TagIcon, 
  CalendarDaysIcon, 
  UserCircleIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  TrashIcon,
  PencilSquareIcon,
  ChatBubbleLeftIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';
import { useProject } from "@context/ProjectContext";
import { useAuth } from "@context/AuthContext";
import ConfirmModal from "@components/modals/ConfirmationModal";
import { formatDistanceToNow, parseISO, isPast, isToday } from 'date-fns';

const TaskCard = ({ task, index, onClick, projectId }) => {
  const { deleteTask, getProject } = useProject();
  const { currentUser } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get current user's role in this project
  const getUserRoleInProject = () => {
    if (!currentUser) return null;
    const project = getProject(projectId);
    if (!project) return null;
    const member = project.members.find(m => m.id === currentUser.id);
    return member?.role || null;
  };

  const canDeleteTask = () => {
    const userRole = getUserRoleInProject();
    return userRole === 'Admin' || userRole === 'Manager' || task.created_by.id === currentUser?.id;
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": 
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case "medium": 
        return <ClockIcon className="w-4 h-4" />;
      case "low": 
        return <CheckCircleIcon className="w-4 h-4" />;
      default: 
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
      medium: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white",
      low: "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
    };
    return colors[priority] || "bg-gray-100 text-gray-700";
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Format dates for display
  const formatDateDisplay = (dateString) => {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  };

  // Check if due date is overdue or today
  const getDueDateStatus = (dateString) => {
    if (!dateString) return null;
    const date = parseISO(dateString);
    if (isPast(date) && !isToday(date)) return "overdue";
    if (isToday(date)) return "today";
    return "upcoming";
  };

  const dueDateStatus = getDueDateStatus(task.due_date);
  const dueDateClasses = {
    overdue: "bg-red-50 text-red-700 border-red-200",
    today: "bg-blue-50 text-blue-700 border-blue-200",
    upcoming: "bg-gray-50 text-gray-700 border-gray-200"
  };

  const getStatusBackground = (status) => {
    switch(status) {
      case "completed": return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "in_progress": return "bg-gradient-to-r from-blue-500 to-indigo-500";
      case "pending": return "bg-gradient-to-r from-gray-300 to-gray-400";
      default: return "bg-gradient-to-r from-gray-200 to-gray-300";
    }
  };

  const getStatusCompletion = (status) => {
    switch(status) {
      case "completed": return "w-full";
      case "in_progress": return "w-3/5";
      case "pending": return "w-1/5";
      default: return "w-0";
    }
  };

  const commentCount = task.comments?.length || 0;

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => !snapshot.isDragging && onClick()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`mb-4 rounded-xl border ${
              snapshot.isDragging 
                ? "shadow-2xl border-blue-300 z-50 scale-[1.02]" 
                : `shadow hover:shadow-md ${isHovered ? "border-blue-200" : "border-gray-200"}`
            } bg-white transition-all relative group overflow-hidden`}
            style={{
              ...provided.draggableProps.style,
              transform: snapshot.isDragging 
                ? `${provided.draggableProps.style?.transform} rotate(${Math.random() > 0.5 ? 1.5 : -1.5}deg)`
                : provided.draggableProps.style?.transform,
              zIndex: snapshot.isDragging ? 9999 : 'auto'
            }}
          >
            {/* Status indicator line */}
            <div className="h-1 w-full">
              <div 
                className={`${getStatusBackground(task.status)} h-full ${getStatusCompletion(task.status)} transition-all duration-300`}
              ></div>
            </div>
            
            {/* Task content */}
            <div className="p-4">
              {/* Priority indicator and title */}
              <div className="flex justify-between items-start mb-3">
                <h4 className={`font-medium text-gray-800 text-sm line-clamp-2 flex-1 pr-2 ${isHovered ? "text-blue-600" : ""}`}>
                  {task.title}
                </h4>
                <div className={`text-xs px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-sm ${getPriorityColor(task.priority)} shrink-0`}>
                  {getPriorityIcon(task.priority)}
                  <span className="capitalize font-medium">{task.priority}</span>
                </div>
              </div>

              {/* Description section */}
              {task.description && (
                <p className="text-gray-600 text-xs mb-3 line-clamp-2 italic bg-gray-50 p-2 rounded-md">
                  {task.description}
                </p>
              )}

              {/* Action buttons - only visible on hover */}
              <div className={`flex items-center justify-end space-x-2 overflow-hidden transition-all duration-300 ${isHovered ? "h-8 opacity-100 mb-2" : "h-0 opacity-0"}`}>
                <button 
                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
                  title="Expand task details"
                >
                  <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
                </button>
                
                {commentCount > 0 && (
                  <button 
                    className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-md transition-colors flex items-center"
                    title="View comments"
                  >
                    <ChatBubbleLeftIcon className="w-3.5 h-3.5 mr-1" />
                    <span className="text-xs font-medium">{commentCount}</span>
                  </button>
                )}
                
                {canDeleteTask() && (
                  <button
                    onClick={handleDeleteClick}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                    title="Delete task"
                    aria-label="Delete task"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Task metadata section */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                {/* Assignee */}
                <div className="flex items-center truncate bg-gray-50 px-2 py-1 rounded-lg">
                  <UserCircleIcon className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  <span className="truncate max-w-[120px] font-medium">
                    {task.assigned_to?.full_name || "Unassigned"}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Due date */}
                  {task.due_date && (
                    <div className={`flex items-center shrink-0 px-2 py-1 rounded-lg border ${dueDateClasses[dueDateStatus] || dueDateClasses.upcoming}`}>
                      <CalendarDaysIcon className="w-3.5 h-3.5 mr-1.5" />
                      <span className="font-medium">{new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}

            
                </div>
              </div>

              {/* Creation info section */}
              <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <PencilSquareIcon className="w-3 h-3 mr-1" />
                    <span>By {task.created_by?.full_name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.created_at && (
                      <span title={`Created ${new Date(task.created_at).toLocaleString()}`}>
                        {formatDateDisplay(task.created_at)}
                      </span>
                    )}
                    {task.updated_at && task.created_at !== task.updated_at && (
                      <span title={`Updated ${new Date(task.updated_at).toLocaleString()}`}>
                        • Edited {formatDateDisplay(task.updated_at)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        description={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmButtonText={isDeleting ? "Deleting..." : "Delete"}
      />
    </>
  );
};

export default TaskCard;
