import React, { useState, useEffect } from 'react';
import { useAuthState } from '../hooks/useAuthState';
import CategorySettings from '../components/settings/CategorySettings';
import AccountSettings from '../components/settings/AccountSettings';
import { settingsService } from '../services/settings.service';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface Category {
  id: string;
  name: string;
}

const DEFAULT_CATEGORIES = [
  'Meeting',
  'Client Call',
  'Development',
  'Design',
  'Research',
  'Documentation',
  'Other'
];

const Settings = () => {
  const { user } = useAuthState();
  const [isSaving, setIsSaving] = useState(false);
  const [activityCategories, setActivityCategories] = useState<Category[]>([]);
  const [taskCategories, setTaskCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with default categories if empty
    if (activityCategories.length === 0) {
      setActivityCategories(
        DEFAULT_CATEGORIES.map((name, index) => ({
          id: `activity-${index + 1}`,
          name
        }))
      );
    }
    if (taskCategories.length === 0) {
      setTaskCategories(
        DEFAULT_CATEGORIES.map((name, index) => ({
          id: `task-${index + 1}`,
          name
        }))
      );
    }
  }, []);

  // Activity Categories handlers
  const handleAddActivityCategory = (name: string) => {
    const newCategory = {
      id: `activity-${Date.now()}`,
      name
    };
    setActivityCategories(prev => [...prev, newCategory]);
  };

  const handleUpdateActivityCategory = (id: string, name: string) => {
    setActivityCategories(prev =>
      prev.map(cat => cat.id === id ? { ...cat, name } : cat)
    );
  };

  const handleDeleteActivityCategory = (id: string) => {
    setActivityCategories(prev => prev.filter(cat => cat.id !== id));
  };

  // Task Categories handlers
  const handleAddTaskCategory = (name: string) => {
    const newCategory = {
      id: `task-${Date.now()}`,
      name
    };
    setTaskCategories(prev => [...prev, newCategory]);
  };

  const handleUpdateTaskCategory = (id: string, name: string) => {
    setTaskCategories(prev =>
      prev.map(cat => cat.id === id ? { ...cat, name } : cat)
    );
  };

  const handleDeleteTaskCategory = (id: string) => {
    setTaskCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const handleSaveCategories = async () => {
    if (!user) {
      setError('Please sign in to save categories');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      console.log('Starting save process...');
      
      // Save activity categories
      await settingsService.saveCategories(user.uid, 'activity', activityCategories);
      console.log('Saved activity categories');
      
      // Save task categories
      await settingsService.saveCategories(user.uid, 'task', taskCategories);
      console.log('Saved task categories');
      
      alert('Categories saved successfully!');
    } catch (error) {
      console.error('Error saving categories:', error);
      setError(error.message || 'Failed to save categories');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-medium">Define Categories</h2>
            <button
              onClick={handleSaveCategories}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <div className="p-4 space-y-6">
            <CategorySettings
              title="Activity Categories"
              categories={activityCategories}
              onAdd={handleAddActivityCategory}
              onUpdate={handleUpdateActivityCategory}
              onDelete={handleDeleteActivityCategory}
            />
            
            <div className="border-t pt-6">
              <CategorySettings
                title="Task Categories"
                categories={taskCategories}
                onAdd={handleAddTaskCategory}
                onUpdate={handleUpdateTaskCategory}
                onDelete={handleDeleteTaskCategory}
              />
            </div>
          </div>
        </div>

        <AccountSettings />
      </div>
    </div>
  );
};

export default Settings;
