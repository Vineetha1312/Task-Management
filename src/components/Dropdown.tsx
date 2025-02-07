import React from "react";
import { ITask } from '../model/ITask';
import editIcon from '../assets/images/edit_icon.svg';
import deleteIcon from '../assets/images/delete_icon.svg';

interface DropdownProps {
  task: ITask;
  onDelete: () => void;
  onEdit: () => void;
  closeDropdown: () => void; 
}

const Dropdown: React.FC<DropdownProps> = ({ onDelete, onEdit, closeDropdown }) => {
  
  const handleDelete = () => {
    closeDropdown(); 
    onDelete(); 
  };

  const handleEdit = () => {
    closeDropdown(); 
    onEdit();
  };

  return (
    <div className="absolute right-6 top-0 bg-background rounded-md shadow-lg border border-gray-300 bg-white w-[130px]">
      <button
        onClick={handleDelete}
        className="w-full py-2 px-4 text-red-500 hover:bg-red-100 hover:rounded-t-md transition-all duration-200 flex items-center space-x-2"
      >
        <img src={deleteIcon} className="h-5 w-5"/>
        <span className="text-accent_red text-sm font-semibold">Delete</span>
      </button>
      <button
        onClick={handleEdit}
        className="flex items-center w-full py-2 px-4 text-blue-500 hover:rounded-b-md hover:bg-gray-100 transition-all duration-200 space-x-2"
      >
        <img src={editIcon} className="h-5 w-5" />
        <span className="text-text_primary text-sm font-semibold">Edit</span>
      </button>
    </div>
  );
};

export default Dropdown;