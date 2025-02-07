import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiBold, FiItalic, FiList } from "react-icons/fi";
import { FaListOl } from "react-icons/fa"; 
import OutsideClickListener from './OutsideClickListener';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: "work" | "personal";
  dueDate: string;
  status: "todo" | "in-progress" | "completed";
  attachment?: File | string;
  activity?: { message: string; timestamp: string }[];
  lastUpdated: string;
  createdAt: string;
  lastActivity: string;
}

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [taskData, setTaskData] = useState<Task>(task);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");

  const lastUpdatedTime = new Date();
lastUpdatedTime.setMinutes(lastUpdatedTime.getMinutes() - 1); 
lastUpdatedTime.setSeconds(lastUpdatedTime.getSeconds() - 30); 
const formattedLastUpdatedTime = lastUpdatedTime.toLocaleString(); 

  useEffect(() => {
    if (isOpen) {
      setTaskData(task);
      setCurrentTime(new Date().toLocaleString()); 

      if (!task.createdAt) {
        setTaskData((prevData) => ({
          ...prevData,
          createdAt: new Date().toLocaleString(),
        }));
      }
    }
  }, [isOpen, task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTaskData((prevData) => ({ ...prevData, attachment: file }));
    }
  };

 
const logActivity = (activityMessage: string) => {
  const newActivity = {
    message: activityMessage,
    timestamp: new Date().toLocaleString(), 
  };

  setTaskData((prevData) => ({
    ...prevData,
    activity: [...(prevData.activity || []), newActivity],
  }));
};

  const handleSubmit = () => {
    if (!taskData.title.trim() || !taskData.dueDate.trim()) {
      alert("Title and Due Date are required.");
      return;
    }
    logActivity("Task details updated");
  
    const updatedTask = {
      ...taskData,
      lastUpdated: new Date().toISOString(),
      lastActivity: new Date().toISOString(), 
    };
  
    onUpdate(updatedTask); 
    onClose(); 
  };
  

  if (!isOpen) return null;

  return (
    <OutsideClickListener onOutsideClick={onClose}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="w-full sm:w-[900px] p-6 rounded-t-xl sm:rounded-xl  sm:h-auto transform transition-transform duration-300 sm:relative sm:block absolute bottom-0 left-0 right-0 bg-white rounded-t-xl sm:rounded-xl sm:h-auto sm:transition-none overflow-y-auto  custom-scrollbar">
      {/* Modal Header */}
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xl font-semibold">Edit Task</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black"
              aria-label="Close"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>

          <div className="flex gap-6 flex-col sm:flex-row">
            {/* Left Section (Task Details) */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-200px)]">
            {/* Tab Navigation for Mobile */}
              <div className="sm:hidden flex border-b mb-4">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 text-center py-2 ${activeTab === "details" ? "bg-gray-200" : "bg-white"}`}
                >
                  DETAILS
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`flex-1 text-center py-2 ${activeTab === "activity" ? "bg-gray-200" : "bg-white"}`}
                >
                  ACTIVITY
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "details" ? (
                <div className="1">
                  {/* Task Title Input */}
                  <div>
                    <input
                      type="text"
                      name="title"
                      placeholder="Task title"
                      value={taskData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md mt-2 focus:outline-none mt-8 "
                    />
                  </div>

                  {/* Description Input with Formatting */}
                  <div className="relative mt-0">
                    <textarea
                      name="description"
                      value={taskData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md  h-36 resize-none focus:outline-none"
                      placeholder="Description"
                      rows={4}
                    />
                    {/* Formatting Icons */}
                    <div className="absolute bottom-2 left-2 flex gap-2 p-2">
                      <button
                        className="text-gray-500 hover:text-black"
                        onClick={() => document.execCommand("bold")}
                      >
                        <FiBold />
                      </button>
                      <button
                        className="text-gray-500 hover:text-black"
                        onClick={() => document.execCommand("italic")}
                      >
                        <FiItalic />
                      </button>
                      <button
                        className="text-gray-500 hover:text-black"
                        onClick={() => document.execCommand("insertUnorderedList")}
                      >
                        <FiList />
                      </button>
                      <button
                        className="text-gray-500 hover:text-black"
                        onClick={() => document.execCommand("insertOrderedList")}
                      >
                        <FaListOl />
                      </button>
                    </div>
                  </div>

                  {/* Category, Due Date, and Status */}
                  <div className="flex gap-4 flex-col sm:flex-row justify-between mt-4">
                    <div className="flex-1">
                      <label htmlFor="category" className="text-sm font-medium text-gray-700">
                        Task Category
                      </label>
                      <select
                        name="category"
                        value={taskData.category}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md mt-1 focus:outline-none"
                      >
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                        Due On
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={taskData.dueDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md mt-1"
                      />
                    </div>

                    <div className="flex-1">
                      <label htmlFor="status" className="text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        name="status"
                        value={taskData.status}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="todo">To-Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Attachment Uploader */}
              <div className="mt-4">
              <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
Attachments                      </label>
              <div className=" mb-6 p-3 text-center bg-gray-100 rounded">
                    
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="text-blue-600 cursor-pointer underline"
                    >
                      
                      {taskData.attachment
                        ? "Change File"
                        : <p className="text-sm text-blue-500 border-none"><span className="text-secondary">Drop your files here to </span>Upload</p>}
                    </label>
                    {taskData.attachment && (
                      <div className="mt-2 text-sm text-gray-600">
                        Selected File: {taskData.attachment instanceof File ? taskData.attachment.name : taskData.attachment}
                      </div>
                    )}
                  </div>
              </div>

                </div>
              ) : (
                <div className="space-y-4">
                  {/* Activity Logs */}
                  <div className="text-sm text-gray-600">
                    <div className="font-semibold">Last updated: <span>{taskData.lastUpdated}</span></div>
                    <div>{taskData.lastUpdated}</div>

                    {/* Display activity logs dynamically */}
                    {taskData.activity?.map((log, index) => (
                      <div key={index} className="mt-2">
                        <div className="font-semibold">{log.timestamp}</div>
                        <div>{log.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Section (Activity Logs - Hardcoded for Now) */}
            <div className="bg-gray-50 p-2 rounded-lg  mt-6 sm:mt-0 max-sm:pl-0">
              <div className="font-semibold text-lg mb-4">Activity</div>
              <div className="text-sm text-gray-600">
                <div>You created this task at :<span className="font-semibold ml-7 italic">{taskData.createdAt}</span></div>
                <div className="mt-2">Last Updated At : <span className="font-semibold ml-16 italic max-sm:ml-8">{formattedLastUpdatedTime}</span> </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-4 mt-6 font-semibold">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white border rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-white bg-btn_primary rounded-xl white-s"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </OutsideClickListener>
  );
};

export default EditTaskModal;