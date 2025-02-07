import { combineReducers } from "redux";
import {taskReducer}  from "./tasks/tasks.reducer";

export const rootReducer = combineReducers({
  tasks: taskReducer,
});