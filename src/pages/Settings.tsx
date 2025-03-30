import React, { useState } from 'react';
import { useAuthState } from '../hooks/useAuthState';
import CategorySettings from '../components/settings/CategorySettings';
import AccountSettings from '../components/settings/AccountSettings';
import CollapsibleSection from '../components/settings/CollapsibleSection';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useCategories } from '../hooks/useCategories';
import { createDummyActivities } from '../utils/createDummyActivities';


import { settingsService } from "../services/settings.service";
import { auth } from "../lib/firebase"; // Assuming you're using Firebase auth

import { 
  collection, 
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
const Settings = () => {
  const { user } = useAuthState();
  const [error, setError] = useState<string | null>(null);
  const [isCreatingDummy, setIsCreatingDummy] = useState(false);

  
  
  const {
    categories: activityCategories,
    loading: loadingActivityCategories,
    // addCategory: addActivityCategory,
    updateCategory: updateActivityCategory,
    deleteCategory: deleteActivityCategory
  } = useCategories('activity');

  const {
    categories: taskCategories,
    loading: loadingTaskCategories,
    addCategory: addTaskCategory,
    updateCategory: updateTaskCategory,
    deleteCategory: deleteTaskCategory
  } = useCategories('task');
  
  // const addActivityCategory = async (category) => {
  //   alert(`New Activity Category: ${category}`);
  // }


  const addActivityCategory = async (category: string) => {
    if (!auth.currentUser) {
      alert("User not authenticated!");
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const newCategory = await settingsService.addCategory(userId, "activity", category);
      
      // alert(`New Activity Category Added: ${newCategory.name}`);
      window.location.reload();
    } catch (error) {
      console.error("Error adding activity category:", error);
      alert("Failed to add activity category");
    }
  };


  
  const handleCreateDummyData = async () => {
    if (!user) return;
    try {
      setIsCreatingDummy(true);
      await createDummyActivities(user.uid);
      alert('Dummy activities created successfully!');
    } catch (error) {
      console.error('Error creating dummy data:', error);
      alert('Failed to create dummy activities');
    } finally {
      setIsCreatingDummy(false);
    }
  };

  if (!user || loadingActivityCategories || loadingTaskCategories) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      {error && (
        <div className="px-4 mb-4">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        </div>
      )}

      <div className="px-4 space-y-6">
        <CollapsibleSection title="Activity Categories" defaultOpen={true}>
          <CategorySettings
            title="Activity Categories"
            categories={activityCategories}
            onAdd={(newCategory) => addActivityCategory(newCategory)}
            onUpdate={updateActivityCategory}
            onDelete={deleteActivityCategory}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Task Categories" defaultOpen={true}>
          <CategorySettings
            title="Task Categories"
            categories={taskCategories}
            onAdd={addTaskCategory}
            onUpdate={updateTaskCategory}
            onDelete={deleteTaskCategory}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Account Information" defaultOpen={true}>
          <AccountSettings />
        </CollapsibleSection>

        <CollapsibleSection title="Development Tools" defaultOpen={false}>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Test Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create dummy activities for testing. This will add 15 sample activities spread across the last year.
            </p>
            <button
              onClick={handleCreateDummyData}
              disabled={isCreatingDummy}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
            >
              {isCreatingDummy ? 'Creating...' : 'Create Dummy Activities'}
            </button>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default Settings;
