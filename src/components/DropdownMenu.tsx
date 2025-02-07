import React, { useState, useEffect, useRef } from "react";
import moreIcon from "../assets/images/more_icon.svg";
import editIcon from "../assets/images/edit_icon.svg";
import deleteIcon from "../assets/images/delete_icon.svg";

const DropdownMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);


  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button to Open Dropdown */}
      <button
        onClick={handleToggleDropdown}
        className="text-gray-600 hover:text-gray-800"
      >
        <img src={moreIcon} className="h-4 w-4" alt="More options" />
      </button>

      {/* Dropdown Menu (Visible when isDropdownOpen is true) */}
      {isDropdownOpen && (
        <ul className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-300 z-10">
          <li
            className="cursor-pointer text-primary text-xs py-2 px-4 hover:bg-gray-100 font-bold flex items-center"
            onClick={() => {
              console.log("Edit clicked"); 
              setIsDropdownOpen(false);
            }}
          >
            <img src={editIcon} className="h-4 w-4 mr-2" alt="Edit" />
            <span className="text-text_primary">Edit</span>
          </li>
          <li
            className="cursor-pointer text-xs py-2 px-4 hover:bg-gray-100 font-bold flex items-center text-red-500"
            onClick={() => {
              console.log("Delete clicked"); 
              setIsDropdownOpen(false);
            }}
          >
            <img src={deleteIcon} className="h-4 w-4 mr-2" alt="Delete" />
            <span>Delete</span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
