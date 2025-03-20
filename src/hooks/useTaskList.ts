import { useState, useEffect, useMemo, useCallback } from 'react';
import { User } from 'firebase/auth';
import { taskService } from '../services/task.service';

interface Task {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export const useTaskList = (user: User | null) => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const loadTasks = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Loading tasks...');
      setLoading(true);
      setError(null);
      
      const fetchedTasks = await taskService.getTasks(user.uid);
      console.log('Tasks loaded:', fetchedTasks);
      setAllTasks(fetchedTasks);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks');
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const tasks = useMemo(() => {
    console.log('Filtering tasks:', selectedFilter, allTasks);
    switch (selectedFilter) {
      case 'completed':
        return allTasks.filter(task => task.status === 'completed');
      case 'pending':
        return allTasks.filter(task => task.status === 'pending');
      default:
        return allTasks;
    }
  }, [allTasks, selectedFilter]);

  const taskCounts = useMemo(() => ({
    all: allTasks.length,
    completed: allTasks.filter(task => task.status === 'completed').length,
    pending: allTasks.filter(task => task.status === 'pending').length
  }), [allTasks]);

  const createTask = async (taskData: {
    title: string;
    category: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      console.log('Creating task:', taskData);
      const newTask = await taskService.createTask(user.uid, taskData);
      console.log('Task created:', newTask);
      setAllTasks(prev => [newTask, ...prev]);
      return { success: true, error: null };
    } catch (err) {
      console.error('Failed to create task:', err);
      return { success: false, error: 'Failed to create task' };
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: 'pending' | 'completed') => {
    if (!user) return;

    try {
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
      await taskService.updateTaskStatus(user.uid, taskId, newStatus);
      
      setAllTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus }
            : task
        )
      );
    } catch (err) {
      console.error('Failed to update task status:', err);
      await loadTasks();
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      await taskService.deleteTask(user.uid, taskId);
      setAllTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      await loadTasks();
    }
  };

  return {
    tasks,
    loading,
    error,
    selectedFilter,
    setSelectedFilter,
    taskCounts,
    createTask,
    toggleTaskStatus,
    deleteTask,
    refresh: loadTasks
  };
};
