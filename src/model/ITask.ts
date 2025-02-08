export interface ITask {
  id: string;
  title: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed';
  category: 'work' | 'personal';
  description?: string; 
  lastUpdated?: string;
  createdAt?: string; 
  lastActivity?: string; 
}