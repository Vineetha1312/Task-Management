import React, { useState, useCallback } from 'react';
import { FaCheckCircle } from "react-icons/fa";
import { DndContext, DragEndEvent, useDroppable, useDraggable } from "@dnd-kit/core";
import Accordion from "./Accordion";
import TaskSelectionPanel from "./TaskSelectionPanel";
import AddTask from "./AddTask";
import Dropdown from "./Dropdown";
import moreIcon from "../assets/images/more_icon.svg";
import SortIcon from "../assets/images/Sort.svg";
import Dragicon from "../assets/images/drag_icon.svg";
import EditTaskModal, { Task } from './EditTaskModal';

import { updateTask, deleteTask } from "../redux/tasks/tasks.actions";
import { useDispatch} from "react-redux";
import { ITask } from "../model/ITask";

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

const ListView: React.FC<ListViewProps> = ({ onTaskDelete, onTaskStatusChange, onTaskAdd, tasks }) => {
  const dispatch = useDispatch();

  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
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
      return newSelected;
    });
  }, []); 

  const handleBulkDelete = () => {
    selectedTasks.forEach((taskId) => {
      dispatch(deleteTask(taskId)); 
    });
    setSelectedTasks(new Set());
  };

  const handleEditTask = (task: ITask) => {
    setTaskToEdit(task); 
    setIsEditModalOpen(true); 
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
                />
              )}
            </div>
          ))}
        </div>

        {["todo", "in-progress", "completed"].map((status) => (
          <Droppable key={status} id={status}>
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

              {/* Display tasks based on status */}
              {tasks
                .filter((task) => task.status === status) // Filter tasks by status
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
                    onEdit={handleEditTask}
                  />
                ))}
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
          />
        )}
      </div>

      {/* Edit Task Modal */}
      {isEditModalOpen && taskToEdit && (
        <EditTaskModal
          task={taskToEdit as Task}
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
  onEdit: (task: ITask) => void; 
}> = ({ task, onDelete, isSelected, onSelect, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      className={`grid grid-cols-1 font-Mulish sm:grid-cols-4 items-center gap-4 p-4 border-b-2 border-gray-300 rounded-none hover:border-b hover:bg-white hover:rounded-lg hover:shadow-md bg-form_input_bg ${isSelected ? 'bg-purple-50' : ''}`}
    >
      <div className="flex items-center space-x-2 ">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(task.id)}
          className="w-4 h-4 cursor-pointer"
        />
        <span {...listeners} ref={setNodeRef} className="cursor-drag text-gray-500 max-sm:hidden">
          <img src={Dragicon} className='w-7 h-7' />
        </span>
        <FaCheckCircle
          className={`ml-2 ${task.status === "completed" ? "text-green-500" : "text-gray-400"}`}
          size={18}
        />
        <span className={`${task.status === "completed" ? "line-through text-gray-500" : ""} whitespace-nowrap truncate`}>
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