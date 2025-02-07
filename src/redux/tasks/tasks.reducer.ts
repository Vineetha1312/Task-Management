// 
import { ITask } from '../../model/ITask';
import { ADD_TASK, DELETE_TASK, UPDATE_TASK_STATUS, UPDATE_TASK } from './tasks.actions';

export interface TaskState {
  tasks: ITask[];
}

const initialState: TaskState = {
  tasks: [
    { id: "1", title: "Interview with Design Team", dueDate: "2024-02-07", status: "todo", category: "work", description: "", lastUpdated: new Date().toISOString() },
    { id: "2", title: "Team Meeting", dueDate: "2024-02-07", status: "todo", category: "personal", description: "", lastUpdated: new Date().toISOString() },
    { id: "3", title: "Design a Dashboard Page", dueDate: "2024-12-31", status: "todo", category: "work", description: "", lastUpdated: new Date().toISOString() },
    { id: "4", title: "Morning Workout", dueDate: "2024-02-07", status: "in-progress", category: "work", description: "", lastUpdated: new Date().toISOString() },
    { id: "5", title: "Code Review", dueDate: "2024-02-07", status: "in-progress", category: "personal", description: "", lastUpdated: new Date().toISOString() },
    { id: "6", title: "Create Marketing Campaign Plan", dueDate: "2024-12-18", status: "in-progress", category: "work", description: "", lastUpdated: new Date().toISOString() },
    { id: "7", title: "Test API Integration", dueDate: "2024-12-12", status: "in-progress", category: "work", description: "", lastUpdated: new Date().toISOString() },
    { id: "8", title: "Update Documentation for Release", dueDate: "2024-12-10", status: "in-progress", category: "work", description: "", lastUpdated: new Date().toISOString() },
    { id: "9", title: "Resolve Bugs in Payment Gateway", dueDate: "2024-12-02", status: "in-progress", category: "work", description: "", lastUpdated: new Date().toISOString() },
    { id: "10", title: "Submit Project Proposal", dueDate: "2024-02-07", status: "completed", category: "work", description: "", lastUpdated: new Date().toISOString() },
  ]
};

export const taskReducer = (state = initialState, action: any): TaskState => {
  switch (action.type) {
    case ADD_TASK:
  console.log("Adding task", action.payload);
  return {
    ...state,
    tasks: [...state.tasks, { ...action.payload, id: Date.now().toString() }],
  };

    case DELETE_TASK:
      return {
        ...state, 
        tasks: state.tasks.filter((task) => task.id !== action.payload), 
      };

    case UPDATE_TASK_STATUS:
      return {
        ...state, 
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.newStatus }
            : task
        ),
      };
      case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };

    default:
      return state;
  }
};
