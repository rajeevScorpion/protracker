import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    category: string;
    dueDate: string;
    status: 'pending' | 'completed';
    priority: 'low' | 'medium' | 'high';
  };
  onStatusToggle: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusToggle, onDelete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-4">
        <button 
          onClick={onStatusToggle}
          className={cn(
            "mt-1 p-1 rounded-full transition-colors",
            task.status === 'completed' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
          )}
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
              {task.category}
            </span>
            <span className={cn(
              "px-2 py-1 text-xs rounded-full",
              getPriorityColor(task.priority)
            )}>
              {task.priority}
            </span>
          </div>
          
          <h3 className={cn(
            "text-gray-900 mb-1",
            task.status === 'completed' && "line-through text-gray-500"
          )}>
            {task.title}
          </h3>
          
          <p className="text-sm text-gray-500">
            Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </p>
        </div>

        <button 
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
          title="Delete task"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
