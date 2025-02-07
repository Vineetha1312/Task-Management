import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { ITask } from '../model/ITask';
import TaskComponent from './TaskComponent';
import EditTaskModal from './EditTaskModal';
import { useDroppable } from '@dnd-kit/core';
import { useDispatch} from 'react-redux';
import * as taskActions from '../redux/tasks/tasks.actions';
import {Task} from './EditTaskModal'

interface KanbanBoardProps {
  tasks: ITask[];
  onTaskDelete: (id: string) => void;
  onTaskStatusChange: (id: string, newStatus: ITask['status']) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskDelete,
  onTaskStatusChange,
}) => {
  const [localTasks, setLocalTasks] = useState<ITask[]>(tasks);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null);
  let dispatch = useDispatch();
  

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
  
    if (over && active.id !== over.id) {
      const activeTask = localTasks.find((task) => task.id === active.id);
      const overColumnStatus = over.id as "todo" | "in-progress" | "completed"; 
  
      if (activeTask) {
        const updatedTask: ITask = {
          ...activeTask,
          status: overColumnStatus,  
        };
  
        onTaskStatusChange(updatedTask.id, updatedTask.status);
        setLocalTasks((tasks) =>
          tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
      }
    }
  };
  
  const handleUpdateTask = (updatedTask: ITask) => {
    const updatedTaskWithTimestamp = { 
      ...updatedTask, 
      lastUpdated: new Date().toISOString() 
    };
    dispatch(taskActions.updateTask(updatedTaskWithTimestamp));  
    setIsEditModalOpen(false);
  };
  const columns = [
    { status: 'todo', titleColor: 'text-todo_purple', bgColor: 'bg-gray-100' },
    { status: 'in-progress', titleColor: 'text-in_progress_blue', bgColor: 'bg-gray-100' },
    { status: 'completed', titleColor: 'text-gray-500', bgColor: 'bg-gray-100' },
  ];

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(({ status, bgColor }) => (
            <DroppableColumn key={status} id={status} title={status} bgColor={bgColor}>
              <h2 className={` mb-6 text-xl w-fit px-4 rounded-sm text-black ${status === 'todo' ? 'bg-todo_purple' : status === 'in-progress' ? 'bg-in_progress_blue' : 'bg-[#A2D6A0]'}`}>
  {status.charAt(0).toUpperCase() + status.slice(1)}
</h2>
              {localTasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <TaskComponent
                    key={task.id}
                    task={task as Task}
                    onDelete={onTaskDelete}
                    onUpdateStatus={(id, newStatus) => onTaskStatusChange(id, newStatus)}
                    onEdit={() => {
                      setTaskToEdit(task);
                      setIsEditModalOpen(true);
                    }}
                  />
                ))}
            </DroppableColumn>
          ))}
        </div>
      </DndContext>

      {/* Edit Modal */}
      {isEditModalOpen && taskToEdit && (
        <EditTaskModal
          task={taskToEdit}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateTask}
        />
      )}
    </>
  );
};

const DroppableColumn: React.FC<{
  id: string;
  title: string;
  bgColor: string;
  children: React.ReactNode;
}> = ({ id, bgColor, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={`border-2 rounded-md p-4 ${bgColor}`}>
      {children}
    </div>
  );
};

export default KanbanBoard;