import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  dueDate: Date;
}

interface UpcomingTasksProps {
  tasks: Task[];
}

const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Upcoming Tasks</h3>
          <Link 
            to="/task-list"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            All Tasks
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="text-sm text-gray-500 text-center py-4">No upcoming tasks</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Upcoming Tasks</h3>
        <Link 
          to="/task-list"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          All Tasks
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-900">{task.title}</p>
              <p className="text-gray-500">
                Due {format(task.dueDate, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTasks;
