import React, { useState } from 'react';
import { useAuthState } from '../hooks/useAuthState';
import CategorySettings from '../components/settings/CategorySettings';
import AccountSettings from '../components/settings/AccountSettings';
import CollapsibleSection from '../components/settings/CollapsibleSection';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useCategories } from '../hooks/useCategories';

const Settings = () => {
  const { user } = useAuthState();
  const [error, setError] = useState<string | null>(null);

  const {
    categories: activityCategories,
    loading: loadingActivityCategories,
    addCategory: addActivityCategory,
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

  if (!user || loadingActivityCategories || loadingTaskCategories) {
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
        <CollapsibleSection title="Categories" defaultOpen={true}>
          <div className="space-y-6">
            <CategorySettings
              title="Activity Categories"
              categories={activityCategories}
              onAdd={addActivityCategory}
              onUpdate={updateActivityCategory}
              onDelete={deleteActivityCategory}
            />
            
            <div className="border-t pt-6">
              <CategorySettings
                title="Task Categories"
                categories={taskCategories}
                onAdd={addTaskCategory}
                onUpdate={updateTaskCategory}
                onDelete={deleteTaskCategory}
              />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Account Information" defaultOpen={true}>
          <AccountSettings />
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default Settings;
