import React, { useState, useEffect, useRef } from "react";
import { ITask } from "../model/ITask";
import { useDraggable } from "@dnd-kit/core";  
import Dropdown from "./Dropdown"; 
import EditTaskModal, { Task } from "./EditTaskModal"; 
import MoreIcon from "../assets/images/more_icon.svg";

interface TaskProps {
  task: ITask;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: "todo" | "in-progress" | "completed") => void;
  onEdit: (task: ITask) => void;
}

const TaskComponent: React.FC<TaskProps> = ({ task, onDelete, onUpdateStatus, onEdit }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const dropdownRef = useRef<HTMLDivElement>(null); 
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id, 
  });

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : {};

  const handleStatusChange = () => {
    const newStatus: "todo" | "in-progress" | "completed" =
      task.status === "todo" ? "in-progress" :
      task.status === "in-progress" ? "completed" : "todo";

    onUpdateStatus(task.id, newStatus);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    setIsDropdownOpen(false); 
  };

  const handleUpdateTask = (updatedTask: ITask) => {
    onEdit(updatedTask); 
    setIsEditModalOpen(false); 
  };

  return (
    <div
      style={style} 
      className="bg-white p-4 rounded-xl border mb-6"
    >
      <div className="flex justify-between items-center mb-12">
        {/* Drag Handle */}
        <div
          ref={setNodeRef} 
          {...listeners} 
          {...attributes} 
          className="cursor-move w-full" 
        >
          <h3 className={`font-semibold text-xl text-black w-full ${task.status === "completed" ? "line-through text-gray-500" : ""}`}>
            {task.title}
          </h3>
        </div>

        <div
          className="relative w-8 h-8 flex justify-center items-center cursor-pointer z-90"
          onClick={(e) => {
            e.stopPropagation(); 
            setIsDropdownOpen((prev) => !prev);
          }}
        >
          <button className="text-gray-600 hover:text-gray-800 focus:outline-none text-2xl w-4 h-4">
            <img src={MoreIcon} alt="more-icon" />
          </button>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md"
              onClick={(e) => e.stopPropagation()} 
            >
              <Dropdown
                task={task} 
                onDelete={() => {
                  onDelete(task.id); 
                  setIsDropdownOpen(false); 
                }}
                onEdit={handleEditClick} 
                closeDropdown={() => setIsDropdownOpen(false)} 
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
        <p className="text-gray-400">{task.category}</p> 
        <p>Due: {task.dueDate}</p> 
      </div>

      <EditTaskModal
        task={task as Task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
};

export default TaskComponent;