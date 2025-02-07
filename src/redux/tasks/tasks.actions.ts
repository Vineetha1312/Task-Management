//Action
export const ADD_TASK:string = 'ADD_TASK';
export const DELETE_TASK:string = 'DELETE_TASK';
export const UPDATE_TASK_STATUS:string = 'UPDATE_TASK_STATUS';  
export const UPDATE_TASK:string = 'UPDATE_TASK';



//Action Creators
import { ITask } from '../../model/ITask';

export const addTask = (task: Omit<ITask, "id">) => ({
  type: ADD_TASK,
  payload: task,
});

export const deleteTask = (id: string) => ({
  type: DELETE_TASK,
  payload: id,
});

export const updateTaskStatus = (id: string, newStatus: string) => ({
  type: UPDATE_TASK_STATUS,
  payload: { id, newStatus },
});

export const updateTask = (task:Omit<ITask, "id">) => ({
  type: UPDATE_TASK,
  payload: task
});
