import React, { useState, useCallback, useMemo} from 'react';
import { FaCheckCircle } from "react-icons/fa";
import { DndContext, DragEndEvent, useDroppable, useDraggable } from "@dnd-kit/core";
import Accordion from "./Accordion";
import TaskSelectionPanel from "./TaskSelectionPanel";
import AddTask from "./AddTask";
import Dropdown from "./Dropdown";
import moreIcon from "../assets/images/more_icon.svg";
import SortIcon from "../assets/images/Sort.svg";
import Dragicon from "../assets/images/drag_icon.svg"
import EditTaskModal from './EditTaskModal';

import { updateTaskStatus,updateTask, deleteTask } from "../redux/tasks/tasks.actions";
import { useDispatch, useSelector } from "react-redux";
import { ITask } from "../model/ITask";
import { TaskState } from "../redux/tasks/tasks.reducer";

interface Task {
  status: string;
  dueDate: string; 
}  

interface ListViewProps {
  tasks: ITask[];
  onTaskDelete: (id: string) => void;
  onTaskStatusChange: (id: string, newStatus: ITask["status"]) => void;
  onTaskAdd: (task: ITask) => void; 
  onTaskUpdate: (task: ITask) => void; 
}

const generateUniqueId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const ListView: React.FC<ListViewProps> =  ({onTaskDelete, onTaskStatusChange, onTaskAdd, onTaskUpdate }) => {
  const tasks = useSelector((state: { tasks: TaskState }) => state.tasks.tasks);
  if (!tasks || tasks.length === 0) {
  return <div>Loading tasks...</div>;
}

console.log("Current tasks:", tasks);  



  const dispatch = useDispatch();

  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null); 

  const [sortConfig, setSortConfig] = useState<{ key: keyof ITask; direction: 'asc' | 'desc' }>({
    key: 'dueDate',
    direction: 'asc',
  });
 

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onTaskStatusChange(active.id as string, over.id as ITask["status"]);
    }
  }, [onTaskStatusChange]);

  const handleSort = useCallback((key: keyof ITask) => {
    setSortConfig((current) => ({
        key,
        direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
}, []);


const handleTaskSelect = useCallback((taskId: string) => {
  setSelectedTasks((current) => {
    const newSelected = new Set(current);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    console.log("Selected Tasks:", newSelected); 
    return newSelected;
  });
}, []); 

const handleBulkStatusChange = useCallback((newStatus: string) => {
  selectedTasks.forEach((taskId) => {
    onTaskStatusChange(taskId, newStatus as ITask["status"]);
    dispatch(updateTaskStatus(taskId, newStatus));
  });
  setSelectedTasks(new Set());
}, [selectedTasks, onTaskStatusChange]);



const handleEditTask = (task: ITask) => {
  setTaskToEdit(task); 
  setIsEditModalOpen(true); 
};

const handleCellClick = (e: React.MouseEvent) => {
  if (!(e.target as HTMLElement).closest('input, .cursor-drag')) {
    setSelectedTasks(new Set());
  }
};


const handleBulkDelete = () => {
  selectedTasks.forEach((taskId) => {
    dispatch(deleteTask(taskId)); 
  });
  setSelectedTasks(new Set());
};
  
const handleTaskUpdate = useCallback((updatedTask: ITask) => {
  dispatch(updateTask(updatedTask)); 
}, [dispatch]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="space-y-2">
        {/* Header Row */}
        <div className="grid grid-cols-1 text-cell_status_bg sm:grid-cols-4 gap-4 px-4 py-2 border-t-2 font-medium max-sm:hidden ">
    {(['title', 'dueDate', 'status', 'category'] as (keyof ITask)[]).map((key) => (
        <div
            key={key}
            className={`cursor-pointer flex items-center justify-between ${key === 'dueDate' ? 'w-20' : ''}`} 
            onClick={() => handleSort(key)} 
        >
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            {key === 'dueDate' && (
              <img
            src={SortIcon}
            alt="Sort"
            className={`ml-2 w-3 h-3 ${sortConfig.key === 'dueDate' ? '' : ''}`} 
        />            )}
        </div>
    ))}
</div>



{["todo", "in-progress", "completed"].map((status) => (
  <Droppable key={status} id={status}>
    {/* Pass status to Accordion component */}
    <Accordion title={status.charAt(0).toUpperCase() + status.slice(1)} status={status}>
      
      {/* Only show AddTask in the "todo" section */}
      {status === "todo" && (
        <AddTask
          onTaskAdd={(task) =>
            onTaskAdd({
              ...task,
              id: generateUniqueId(), 
            })
          }
        />
      )}

      {/* Sorting for Due Date */}
      <div
        className="cursor-pointer flex items-center justify-between"
        onClick={() => handleSort('dueDate')} 
      >
      </div>

      {/* Display tasks based on status */}
      {(tasks as Task[]).filter((task) => task.status === status).length === 0 ? (
        <div className="text-center text-gray-500">No Tasks in {status}</div>
      ) : (
        
        tasks
          .filter((task) => task.status === status)
          .sort((a, b) => {
            const direction = sortConfig.direction === 'asc' ? 1 : -1;
            const aDate = new Date(a.dueDate); 
            const bDate = new Date(b.dueDate); 

            return (aDate.getTime() - bDate.getTime()) * direction; 
          })
          .map((task) => (
            <DraggableTask
              key={task.id}
              task={task}
              onDelete={onTaskDelete}
              isSelected={selectedTasks.has(task.id)}
              onSelect={handleTaskSelect}
              handleCellClick={handleCellClick}
              onEdit={handleEditTask}
            />
          ))
      )}
    </Accordion>
  </Droppable>
))}



        {/* Selection Panel */}
        {selectedTasks.size > 0 && (
          <TaskSelectionPanel
            selectedTaskCount={selectedTasks.size}
          selectedTasks={selectedTasks}  
          onClearSelection={() => setSelectedTasks(new Set())}
          onDeleteSelected={handleBulkDelete}
          onChangeStatus={handleBulkStatusChange}
          />
        )}
      </div>
      {/* Edit Task Modal */}
      {isEditModalOpen && taskToEdit && (
        <EditTaskModal
          task={taskToEdit}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)} 
          onUpdate={handleTaskUpdate}
        />
      )}
    </DndContext>
  );
};

// Droppable Component
const Droppable: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef} className="w-full">{children}</div>;
};

// Draggable Task Component
const DraggableTask: React.FC<{
  task: ITask;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  handleCellClick: (e: React.MouseEvent) => void;
  onEdit: (task: ITask) => void; 
}> = ({ task, onDelete, isSelected, onSelect, handleCellClick, onEdit }) => {

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dragIconRef = setNodeRef;

  const style = transform
  ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      opacity: isDragging ? 0.9 : 1,
      boxShadow: isDragging ? '0px 8px 20px rgba(0, 0, 0, 0.15)' : 'none',
      cursor: 'move',
    }
  : undefined;


  return (
    <div
      style={style}
      onClick={handleCellClick}
      className={`grid grid-cols-1 font-Mulish sm:grid-cols-4 items-center gap-4 p-4 border-b-2 border-gray-300 rounded-none hover:border-b hover:bg-white hover:rounded-lg hover:shadow-md bg-form_input_bg ${isSelected ? 'bg-purple-50' : ''}`}
    >
      <div className="flex items-center space-x-2 ">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(task.id)}
          className="w-4 h-4 cursor-pointer"
        />
        <span {...listeners} ref={dragIconRef} className="cursor-drag text-gray-500 max-sm:hidden">
          < img src={Dragicon}  className='w-7 h-7' />
        </span>
        <FaCheckCircle
          className={`ml-2 ${task.status === "completed" ? "text-green-500" : "text-gray-400"}`}
          size={18}
        />
        <span   className={`${task.status === "completed" ? "line-through text-gray-500" : ""} whitespace-nowrap truncate`}
        >
          {task.title}
        </span>
      </div>
      <div className='max-sm:hidden'>{task.dueDate}</div>
      <div className='max-sm:hidden'>{task.status}</div>
      <div className="flex items-center justify-between max-sm:hidden">
        <span>{task.category}</span>
        <div className="relative">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setIsDropdownOpen(!isDropdownOpen);
    }}
    className="p-2 hover:bg-gray-100 rounded-md"
  >
    <img src={moreIcon} className="h-4 w-4" />
</button>

  {isDropdownOpen && (
    <Dropdown
    task={task}
    onDelete={() => {
      onDelete(task.id);
      setIsDropdownOpen(false); 
    }}
    onEdit={() => {
      onEdit(task); 
      setIsDropdownOpen(false); 
    }}
    closeDropdown={() => setIsDropdownOpen(false)} 
    />
  )}
</div>

      </div>
    </div>
  );
};

export default ListView;

