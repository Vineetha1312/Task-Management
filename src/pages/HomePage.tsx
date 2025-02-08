import React, { useState } from "react";
import ListView from "../components/ListView";
import KanbanBoard from "../components/KanbanBoard";
import CreateTask from "../components/CreateTask";
import { ITask } from "../model/ITask";
import MainHeader from "../components/MainHeader";
import TabHeader from "../components/TabHeader";
import BoardIcon from "../assets/images/Board icon.svg"
import ListIcon from "../assets/images/list_icon.svg"
import { useDispatch, useSelector } from "react-redux";
import * as taskActions from '../redux/tasks/tasks.actions'
import { TaskState } from "../redux/tasks/tasks.reducer"; 

const generateUniqueId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const HomePage: React.FC = () => {
  const dispatch = useDispatch()
  const tasks = useSelector((state: { tasks: TaskState }) => state.tasks.tasks);


  const [activeTab, setActiveTab] = useState<"list" | "board">("list");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("all"); 
  const [selectedDueDate, setSelectedDueDate] = useState<string | null>(null); 
  const [searchQuery, setSearchQuery] = useState<string>("");

 

  const deleteTask = (id: string) => {
    dispatch(taskActions.deleteTask(id))
  }

  const updateTaskStatus = (id: string, newStatus: ITask["status"]) => {
    dispatch(taskActions.updateTaskStatus(id, newStatus))
  }

  const addTask = (task: Omit<ITask, "id">) => {
    dispatch(taskActions.addTask({...task, id: generateUniqueId()}))
    setShowAddTaskModal(false)
  };
  const filteredTasks = tasks.filter((task: ITask) => {
    const categoryMatch =
      selectedCategory === "all" || task.category === selectedCategory;
    const dueDateMatch = !selectedDueDate || task.dueDate === selectedDueDate;
    const searchMatch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
  
    return categoryMatch && dueDateMatch && searchMatch;
  });

  const handleTaskUpdate = (updatedTask: ITask) => {
    dispatch(taskActions.updateTaskStatus(updatedTask.id, updatedTask.status));
  };
  

  return (
    <div className="min-h-screen p-6 bg-white custom-scrollbar">
      <MainHeader />
      <div className="flex gap-4 w-ful my-4">
        <button
          className={`font-semibold text-base flex items-center ${activeTab === "list" ? "border-b-2 border-text_secondary text-primary" : "text-primary border-white"}`}
          onClick={() => setActiveTab("list")}
        >
          <img src={ListIcon} alt="list icon" className="w-5 h-5 mr-1" />
          List
        </button>
        <button
          className={`font-semibold text-base flex items-center ${activeTab === "board" ? "border-b-2 border-text_secondary text-primary" : "text-primary border-white"}`}
          onClick={() => setActiveTab("board")}
        ><img src={BoardIcon} alt="list icon" className="w-5 h-5 mr-1" />
          Board View
        </button>
      </div>
      <TabHeader
       onCategoryChange={setSelectedCategory}
       onDateChange={(date) => setSelectedDueDate(date || '')}
       onSearchChange={setSearchQuery}
       onAddTask={addTask} />
      {/* Render List or Board View */}
      {activeTab === "list" ? (
        <ListView
        tasks={filteredTasks} // Use filtered tasks
        onTaskAdd={(newTask) => dispatch(taskActions.addTask({...newTask, id: generateUniqueId()}))}
        onTaskDelete={deleteTask}
        onTaskStatusChange={updateTaskStatus}
        onTaskUpdate={handleTaskUpdate}
        />
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          onTaskDelete={deleteTask}
          onTaskStatusChange={updateTaskStatus}
        />
      )}
      {/* Task Modal */}
      {showAddTaskModal && (
        <CreateTask
          onClose={() => setShowAddTaskModal(false)}
          onAddTask={addTask}
        />
      )}
    </div>
  );
};

export default HomePage;