import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  status: "todo" | "in-progress" | "completed"; 
}

const Accordion: React.FC<AccordionProps> = ({ title, children, status }) => {
  const [isOpen, setIsOpen] = useState(true);

  const headerColors = {
    todo: "bg-todo_purple",  
    "in-progress": "bg-in_progress_blue", 
    completed: "bg-completed_green",  
  };

  const bodyColor = "bg-form_input_bg";

  return (
    <div className="border-2 rounded-md pb-2 mb-4 bg-gray-100  ">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex justify-between items-center cursor-pointer ${headerColors[status]} p-2 rounded-t-md`} 
      >
        <h2 className="font-semibold text-lg text-text_primary">{title}</h2>
        {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </div>
      {isOpen && (
        <div className={` ${bodyColor} p-2 `}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;