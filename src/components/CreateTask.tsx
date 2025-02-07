import React, { useState, useRef, useEffect } from "react";
import { ITask } from "../model/ITask";
import closeIcon from '../assets/images/Close Icon.svg'
import TaskList from '../assets/images/tasks-list.svg'
import listNums from '../assets/images/list-numbers.png'
import listMenu from '../assets/images/list-menu.png'
import chevron from '../assets/images/chevron-down.svg'

import { FiBold, FiItalic } from "react-icons/fi";

interface CreateTaskProps {
  onClose: () => void;
  onAddTask: (task: Omit<ITask, "id">) => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onClose, onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"work" | "personal">("work");
  const [dueDate, setDueDate] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(true); 
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"todo" | "in-progress" | "completed">("todo"); 

  useEffect(() => {
    if (descriptionRef.current) {
      if (!description) {
        descriptionRef.current.innerText = "Description";
      }
    }
  }, [description]);

  const handleClose = () => {
    setIsOpen(false); 
    onClose(); 
  };


  const handleRemoveFile = () => {
    setUploadedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const handleSubmit = () => {
    if (!title || !dueDate || !status) {
      alert("Please fill all required fields.");
      return;
    }

    const newTask = {
      title,
      description,
      dueDate,
      category,
      status: status,
      lastUpdated: new Date().toISOString()      
};

    console.log("Adding new task:", newTask); 

    onAddTask(newTask);
    handleClose();  
    onClose(); 
  };


  const applyFormatting = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

  const handleDescriptionInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setDescription(target.innerText);
  };

  const handleStatusSelect = (selectedStatus: "todo" | "in-progress" | "completed") => {
    setStatus(selectedStatus);
    setIsStatusDropdownOpen(false);
  };

  // Drag-and-drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setUploadedFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-end sm:items-center z-50 border rounded-xl">
      <div className={`bg-white shadow-lg w-full sm:w-[670px] sm:rounded-xl sm:absolute sm:top-0 sm:left-0 sm:right-0 sm:transform sm:transition-all sm:duration-300 sm:translate-y-0 sm:h-auto sm:bottom-auto sm:top-0 sm:w-full sm:h-auto sm:max-w-[670px] sm:rounded-xl sm:relative  ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}  >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b-2 p-4">
          <h2 className="text-md text-secondary font-semibold">Create Task</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black"
            aria-label="Close modal"
          >
            <img src={closeIcon} className="w-4 h-4" alt="closeIcon" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="px-4 pt-2">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-2 text-sm rounded-md mt-0 bg-gray-100 placeholder focus:outline-none"
          />
        </div>
        {/* Description Input with Formatting */}
        <div className="relative px-4 pt-2 rounded-xl">
          <div
            contentEditable
            onInput={handleDescriptionInput}
            className="w-full p-2 border border-2 bg-gray-100 rounded-md h-24 resize-none focus:outline-none"
            style={{ minHeight: "6rem", position: "relative" }}
          >
            {!description && (
              <div className="absolute top-2 left-2 flex items-center text-sm text-gray-500 pointer-events-none ">
                <img src={TaskList} className="w-3 h-3 mr-2" />
                <span>Description</span>
              </div>
            )}
            {description && <span>{description}</span>}
          </div>

          {/* Formatting Icons */}
          <div className="absolute bottom-0 left-3 flex gap-2 p-2 ml-2 mb-2 flex justify-between items-center">
            <button
              className="text-gray-500 hover:text-black"
              onClick={() => applyFormatting("bold")}
            >
              <FiBold className="h-3 w-3" />
            </button>
            <button
              className="text-gray-500 hover:text-black"
              onClick={() => applyFormatting("italic")}
            >
              <FiItalic className="h-3 w-3" />
            </button>
            <button
              className="text-gray-500 hover:text-black"
              onClick={() => applyFormatting("insertUnorderedList")}
            >
              <img src={listNums} className="h-3 w-3" />
            </button>
            <button
              className="text-gray-500 hover:text-black"
              onClick={() => applyFormatting("insertOrderedList")}
            >
              <img src={listMenu} className="h-3 w-3" />
            </button>
          </div>
        </div>


        <div className="flex flex-col md:flex-row gap-4 justify-between p-4 pr-0 max-sm:p-4">
          {/* Task Category Selection */}
          <div className="mt-4 inline-block w-full md:w-1/3">
            <label htmlFor="category" className="block text-xs font-semibold text-secondary mb-2">
              Task Category
            </label>
            <div className="flex gap-2 text-sm">
              <button
                className={`px-6 py-2 rounded-xl ${category === "work" ? "bg-heading bg-btn_primary text-white  rounded-xl" : "bg-transparent rounded-lg text-secondary border border-2 border-gray-200"}`}
                onClick={() => setCategory("work")}
              >
                Work
              </button>
              <button
                className={`px-6 py-2 rounded-xl ${category === "personal" ? "bg-btn_primary  text-white  border border-0" : "bg-transparent  text-secondary border border-2 border-gray-200"}`}
                onClick={() => setCategory("personal")}
              >
                Personal
              </button>
            </div>
          </div>

          {/* Due Date Input */}
          <div className="mt-4 inline-block w-full md:w-1/3">
            <label htmlFor="due-date" className="block text-xs font-semibold text-secondary mb-2">
              Due On
            </label>
            <input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="max-w-[200px] w-full px-4 py-2 border border-gray-300 rounded-md text-xs focus:outline-none bg-gray-100"
            />
          </div>

          {/* Task Status Dropdown */}
          <div className="relative md:p-4 p-0 w-full md:w-1/3">
            <label className="block text-xs font-semibold text-secondary mb-2">Task Status</label>
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md text-xs focus:outline-none bg-gray-100"
            >
              <span className="text-secondary">
                {status.replace("-", " ").toUpperCase()}
              </span>              <img src={chevron} className="h-4 w-4" />
            </button>

            {/* Custom Dropdown Options */}
            {isStatusDropdownOpen && (
              <ul className="absolute left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                <li
                  onClick={() => handleStatusSelect("todo")}
                  className="cursor-pointer text-primary text-xs py-2 px-4 hover:bg-background"
                >
                To-do
                </li>
                <li
                  onClick={() => handleStatusSelect("in-progress")}
                  className="cursor-pointer text-primary text-xs py-2 px-4 hover:bg-background"
                >
                  In progress
                </li>
                <li
                  onClick={() => handleStatusSelect("completed")}
                  className="cursor-pointer text-primary text-xs py-2 px-4 hover:bg-background"
                >
                  Completed
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="p-4">
          <label className="block text-xs font-semibold text-secondary mb-2">Attachment</label>
          <div
            className={`mb-4 border p-3 text-center rounded-md text-xs text-secondary border-gray-300 bg-gray-100 pointer ${isDragging ? "bg-blue-100" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()} 
          >
            {uploadedFile ? (
              <div className="relative">
                <p>{uploadedFile.name}</p>
                <button className="text-blue-600 cursor-pointer underline" onClick={handleUploadClick}>
                  Change File
                </button>
              </div>
            ) : (
              <div>
                Drop your files here or{" "}
                <span className="text-blue-600 cursor-pointer underline" onClick={handleUploadClick}>
                  Update
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* File Preview Section */}
          {uploadedFile && (
            <div className="mt-4 max-w-[250px] w-full">
              <label className="block text-xs font-semibold text-secondary mb-2">Preview</label>
              <div className="text-center relative">
                {/* Close Button on Image Preview */}
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-[-10px] right-[-10px] bg-gray-300 border border-gray-400 rounded-corner p-1 hover:bg-gray-600"
                >
                  <img src={closeIcon} className="w-4 h-4" alt="closeIcon" />

                </button>
                {uploadedFile.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(uploadedFile)}
                    alt="Preview"
                    className=" h-auto w-full object-contain rounded-md"
                  />
                ) : (
                  <p className="text-xs text-secondary">File preview not available</p>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Modal Actions */}
        <div className="flex justify-end gap-4 bg-gray-100 p-4 rounded-xl rounded-t-none w-full">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white rounded-xl border border-2 border-input_border text-sm"
            aria-label="Cancel"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2   bg-btn_primary text-bg_light text-sm rounded-xl "
            aria-label="Create task"
          >
            CREATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;