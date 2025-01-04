import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuthState } from '../hooks/useAuthState';
import { useTaskList } from '../hooks/useTaskList';
import NewTaskModal from '../components/task/NewTaskModal';
import TaskItem from '../components/task/TaskItem';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { cn } from '../lib/utils';

const TaskList = () => {
  const { user } = useAuthState();
  const {
    tasks,
    loading,
    error,
    selectedFilter,
    setSelectedFilter,
    taskCounts,
    createTask,
    toggleTaskStatus,
    deleteTask,
    refresh
  } = useTaskList(user);

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  useEffect(() => {
    console.log('TaskList mounted, refreshing...');
    refresh();
  }, [refresh]);

  const handleCreateTask = async (data: any) => {
    const result = await createTask(data);
    if (result.success) {
      setIsNewTaskModalOpen(false);
    }
    return result;
  };

  const handleDeleteTask = (taskId: string) => {
    setDeleteTaskId(taskId);
  };

  const confirmDelete = async () => {
    if (deleteTaskId) {
      await deleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  console.log('Rendering TaskList:', { tasks, selectedFilter, taskCounts });

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Task List</h1>
        <p className="text-gray-600">View and manage your tasks</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setSelectedFilter('all')}
            className={cn(
              "px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent",
              selectedFilter === 'all' && "text-blue-600 border-blue-600"
            )}
          >
            All Tasks ({taskCounts.all})
          </button>
          <button
            onClick={() => setSelectedFilter('completed')}
            className={cn(
              "px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent",
              selectedFilter === 'completed' && "text-blue-600 border-blue-600"
            )}
          >
            Completed ({taskCounts.completed})
          </button>
          <button
            onClick={() => setSelectedFilter('pending')}
            className={cn(
              "px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent",
              selectedFilter === 'pending' && "text-blue-600 border-blue-600"
            )}
          >
            Pending ({taskCounts.pending})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task}
            onStatusToggle={() => toggleTaskStatus(task.id, task.status)}
            onDelete={() => handleDeleteTask(task.id)}
          />
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {selectedFilter === 'all' 
              ? 'No tasks found' 
              : `No ${selectedFilter} tasks found`}
          </p>
        </div>
      )}

      <button
        onClick={() => setIsNewTaskModalOpen(true)}
        className="fixed right-6 bottom-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-6 w-6" />
      </button>

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      <ConfirmationModal
        isOpen={deleteTaskId !== null}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default TaskList;
