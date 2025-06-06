import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const TaskColumn = ({ column, tasks, onTaskClick }) => {
  const getColumnColors = () => {
    const colors = {
      todo: {
        header: "text-cyan-800",
        bg: "bg-cyan-50",
        dragHover: "bg-cyan-100",
        border: "border-cyan-200",
      },
      "in-progress": {
        header: "text-indigo-800",
        bg: "bg-indigo-50",
        dragHover: "bg-indigo-100",
        border: "border-indigo-200",
      },
      done: {
        header: "text-green-800",
        bg: "bg-green-50",
        dragHover: "bg-green-100",
        border: "border-green-200",
      },
    };
    return colors[column.id] || colors.todo;
  };

  const colors = getColumnColors();

  return (
    <div className={`flex-1 ${colors.bg} rounded-xl shadow-sm border ${colors.border} flex flex-col min-w-[320px] min-h-[600px] max-w-sm`}>
      <h2 className={`font-semibold text-lg p-4 ${colors.header} sticky top-0 ${colors.bg} rounded-t-xl z-10 flex justify-between items-center border-b ${colors.border}`}>
        {column.title}
        <span className="text-sm font-normal bg-white border border-gray-200 px-2 py-1 rounded-full shadow-sm">
          {tasks.length}
        </span>
      </h2>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 transition-colors duration-100 rounded-b-xl p-3 overflow-y-auto ${
              snapshot.isDraggingOver ? `${colors.dragHover}` : ""
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
              <div className="text-center text-gray-400 py-6 px-2 my-2 border border-dashed border-gray-200 rounded-lg">
                <p className="text-sm">No tasks in this column</p>
                <p className="text-xs mt-1">Drag tasks here</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;