import React from 'react';
import ActivityFilters from '../components/activity/ActivityFilters';
import ActivityCard from '../components/activity/ActivityCard';
import { useAuthState } from '../hooks/useAuthState';
import { useActivitySearch } from '../hooks/useActivitySearch';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import ConfirmationModal from '../components/modals/ConfirmationModal';

const ActivityHistory = () => {
  const { user } = useAuthState();
  const { 
    activities,
    loading,
    error,
    searchQuery,
    selectedCategory,
    dateRange,
    perPage,
    deleteActivityId,
    setSearchQuery,
    setSelectedCategory,
    setDateRange,
    setPerPage,
    handleDelete,
    confirmDelete,
    setDeleteActivityId
  } = useActivitySearch(user);

  // Render loading state after all hooks are called
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Activity History</h1>
        <p className="text-gray-600">Select the cards to see more details</p>
      </div>

      <div className="px-4">
        <ActivityFilters
          selectedCategory={selectedCategory}
          onSearch={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onDateRangeChange={setDateRange}
          onPerPageChange={setPerPage}
        />
      </div>

      {error && (
        <div className="px-4 mb-4">
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        </div>
      )}

      <div className="px-4">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onDelete={handleDelete}
          />
        ))}

        {activities.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No activities found</p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteActivityId !== null}
        onClose={() => setDeleteActivityId(null)}
        onConfirm={confirmDelete}
        title="Delete Activity"
        message="Are you sure you want to delete this activity? This action cannot be undone."
      />
    </div>
  );
};

export default ActivityHistory;
