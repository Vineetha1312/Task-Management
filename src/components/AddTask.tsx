import React, { useState } from "react";
import { BsCalendar } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import addIcon from "../assets/images/plus.svg"
import EnterIcon from "../assets/images/enter.svg"

interface AddTaskProps {
  onTaskAdd: (newTask: { title: string; dueDate: string; status: string; category: string }) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onTaskAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<string>("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleAddTask = () => {
    if (newTaskTitle.trim() === "") return;

    const newTask = {
      title: newTaskTitle,
      dueDate: newTaskDate || "Today",
      status: newTaskStatus,
      category: newTaskCategory || "WORK",
    };

    onTaskAdd(newTask);
    setIsExpanded(false);
    setNewTaskTitle("");
    setNewTaskDate("");
    setNewTaskStatus("todo");
    setNewTaskCategory("");
  };

  return (
    <div className="w-full mx-auto font-urbanist ">
      <div
        className="p-3 border-b-2 border-gray-300 flex items-center justify-start cursor-pointer hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img src={addIcon} alt="plus" className="h-5 w-5" />
        <span className="text-text_primary font-semibold text-sm">ADD TASK</span>
      </div>

      {/* Expanded Form */}
      {isExpanded && (
        <div className="p-4  mt-2">
          <div className="grid grid-cols-4 gap-3 items-center justify-between w-full">
            {/* Task Title Input */}
            <input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="col-span-1 p-2 border rounded-md outline-none bg-transparent border-transparent"
            />

            {/* Date Picker */}
            <div className="relative">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center "
                onClick={() => setDatePickerOpen(!datePickerOpen)}
              >
                <BsCalendar className="mr-2" /> {newTaskDate || "Add date"}
              </button>
              {datePickerOpen && (
                <div className="absolute left-0 mt-2  shadow-lg rounded-md">
                  <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => {
                      setNewTaskDate(e.target.value);
                      setDatePickerOpen(false);
                    }}
                    className="p-2 outline-none"
                  />
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="p-2 border rounded-md border-gray-300 flex items-center"
              >
                {newTaskStatus === "" ? <BsThreeDotsVertical /> : newTaskStatus}
              </button>
              {statusDropdownOpen && (
                <div className="absolute left-0 mt-2 w-36 bg-white shadow-lg rounded-md text-sm">
                  {["todo", "in-progress", "completed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setNewTaskStatus(status as "todo" | "in-progress" | "completed");
                        setStatusDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 hover:bg-gray-200 text-gray-700"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="p-2 border rounded-md border-gray-300  flex items-center"
              >
                {newTaskCategory ? newTaskCategory : <BsThreeDotsVertical />}
              </button>
              {categoryDropdownOpen && (
                <div className="absolute left-[-55px] mt-2 w-28 bg-white shadow-lg rounded-md text-sm">
                  {["WORK", "PERSONAL"].map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setNewTaskCategory(category);
                        setCategoryDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 hover:bg-gray-200 text-gray-700"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2 col-span-5 mt-2">
            <button
              onClick={handleAddTask}
              className="bg-purple-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-700 transition flex items-center"
            >
              ADD <img src={EnterIcon} alt="Add Icon" className="ml-2 stroke-2" />
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTask;