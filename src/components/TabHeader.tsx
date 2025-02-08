import React, { useState } from "react";
import chevronDownIcon from '../assets/images/chevron-down.svg';
import CustomCalendar from "./CustomCalendar";
import searchIcon from '../assets/images/search_icon.svg';
import CreateTask from './CreateTask';
import { ITask } from "../model/ITask";

interface TabHeaderProps {
  onCategoryChange: (category: string) => void;
  onDateChange: (date: string | null) => void;
  onSearchChange: (query: string) => void;
  onAddTask: (task: Omit<ITask, 'id'>) => void;
}

const TabHeader: React.FC<TabHeaderProps> = ({ onCategoryChange, onDateChange, onSearchChange, onAddTask }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isCreateTaskModelOpen, setIsCreateTaskModelOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
    onDateChange(date);
  };
  
  const toggleCategoryDropdown = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category); 
    setIsCategoryOpen(false); 
  };

  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query); // Call the onSearchChange prop
  };

  return (
    <React.Fragment>
      <div className="py-2 font-urbanist flex flex-col-reverse md:flex-row md:justify-between items-center md:items-center w-full">
        {/* Left Section */}
        <div className="flex flex-col items-start md:items-center md:flex-row md:space-x-2 space-y-2 p-0 max-sm:w-full">
          <p className="text-secondary text-xs md:mt-2 mt-2">Filter by:</p>
          <div className="flex items-center space-x-2">
            {/* Category Dropdown */}
            <div className="relative">
              <button onClick={toggleCategoryDropdown} className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-300 text-secondary">
                <span className="text-secondary text-xs">Category</span>
                <img src={chevronDownIcon} className="h-4 w-4" />
              </button>
              {isCategoryOpen && (
                <ul className="absolute right-100 mt-2 w-30 bg-background rounded-xl shadow-lg border border-gray-300 z-1000 bg-white">
                  <li onClick={() => handleCategorySelect("all")} className="cursor-pointer text-primary text-xs py-2 px-4 hover:bg-gray-100 font-bold">ALL</li>
                  <li onClick={() => handleCategorySelect("work")} className="cursor-pointer text-primary text-xs py-2 px-4 hover:bg-gray-100 font-bold">WORK</li>
                  <li onClick={() => handleCategorySelect("personal")} className="cursor-pointer text-primary text-xs py-2 px-4 hover:bg-gray-100 font-bold">PERSONAL</li>
                </ul>
              )}
            </div>

            {/* Date Filter using Custom Calendar */}
            <CustomCalendar onDateSelect={handleDateSelect} />
          </div>
        </div>

        {/* Right Section (Search & Add Task) */}
        <div className="flex items-center justify-end sm:justify-start space-x-2 w-full md:w-auto">
          <div className="border border-gray-300 rounded-xl flex flex-row items-center px-4 py-2  text-secondary text-xs whitespace-nowrap space-x-1 hidden sm:flex">
            <img src={searchIcon} className="h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="border-none focus:outline-none bg-transparent w-full"
            />
          </div>
          <button className="bg-btn_primary text-white rounded-xl px-4 py-2 text-xs" onClick={() => setIsCreateTaskModelOpen(true)}>ADD TASK</button>
        </div>




      </div>
      <div className="border border-gray-300 rounded-xl flex flex-row items-center px-4 py-2 text-secondary text-xs whitespace-nowrap space-x-1 max-sm:visible sm:hidden mb-2">
      <img src={searchIcon} className="h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="border-none focus:outline-none bg-transparent w-full"
            />
          </div>
      {/* Task Creation Modal */}
      {isCreateTaskModelOpen && <CreateTask onClose={() => setIsCreateTaskModelOpen(false)} 
          onAddTask={onAddTask} />}
    </React.Fragment>
  );
};

export default TabHeader;
