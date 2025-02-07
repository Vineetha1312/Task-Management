import React, { useState, useEffect, useRef } from "react";
import { CgClose } from "react-icons/cg";
import { useDispatch } from "react-redux";  
import SelectIcon from "../assets/images/select-all.svg";
import { updateTaskStatus } from "../redux/tasks/tasks.actions";  

interface TaskSelectionPanelProps {
  selectedTaskCount: number;
  selectedTasks: Set<string>;  
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onChangeStatus: (newStatus: string) => void; 
}

const TaskSelectionPanel: React.FC<TaskSelectionPanelProps> = ({
  selectedTaskCount,
  selectedTasks,
  onClearSelection, 
  onDeleteSelected,
}) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch(); 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusClick = (status: string) => {
    selectedTasks.forEach((taskId) => {
      dispatch(updateTaskStatus(taskId, status));  
    });

    setIsStatusDropdownOpen(false); 
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white shadow-lg rounded-xl p-4 flex items-center  w-auto max-lg max-sm:w-full max-lg:w-[500px] flex max-md:justify-between gap-4 max-sm:gap-0">
      <div className="relative flex items-center space-x-2 border border-gray-600 px-4 py-2 rounded-xl">
        <label className="flex items-center space-x-2 trunket whitespace-nowrap min-sm:w-[130px]">
          <span className="font-medium max-sm:text-sm">{selectedTaskCount} Tasks Selected</span>
        </label>    
        <button
          onClick={onClearSelection} 
          className="text-gray-500 hover:text-gray-700 focus:outline-none" >
          <CgClose />
        </button>
      </div>
      <img
        src={SelectIcon}
        alt="Select Icon"
        className={`w-6 h-6 ${selectedTaskCount > 0 ? 'text-green-500' : 'text-gray-500'}`}
      />

      {/* Status Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
          className="flex items-center space-x-6 hover:bg-gray-700 text-white bg-gray-800 border border-gray-600 px-4 py-2 rounded-xl" >
          <span className="max-sm:text-xs ">Status</span>
        </button>

        {/* Dropdown Content (Always visible and closes on outside click) */}
        {isStatusDropdownOpen && (
          <div className="absolute bottom-full left-0 mb-4 bg-gray-800 text-white rounded-md shadow-md w-auto min-w-[150px] max-w-[350px]">
            <button
              onClick={() => handleStatusClick("TO-DO")}
              className="w-full text-left py-2 px-3 hover:bg-gray-700 rounded-md" >
              To-Do
            </button>
            <button
              onClick={() => handleStatusClick("IN-PROGRESS")}
              className="w-full text-left py-2 px-3 hover:bg-gray-700 ">
              In-Progress
            </button>
            <button
              onClick={() => handleStatusClick("COMPLETED")}
              className="w-full text-left py-2 px-3 hover:bg-gray-700 rounded-md">
              Completed
            </button>
          </div>
        )}
      </div>

      {/* Delete Button */}
      <button
        onClick={onDeleteSelected}
        className="bg-[rgba(225, 56, 56, 0.14)] text-red-700 opacity:20 hover:bg-red-300 focus:outline-none border border-[#E13838] px-4 py-2 rounded-xl text-sm max-sm:text-xs font-semibold" >
        Delete
      </button>
    </div>
  );
};

export default TaskSelectionPanel;
