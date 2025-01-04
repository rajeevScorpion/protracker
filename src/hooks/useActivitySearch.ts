import { useState, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
import { activityService } from '../services/activity.service';

export const useActivitySearch = (user: User | null) => {
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [perPage, setPerPage] = useState(10);

  // Load all activities once
  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [user]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const fetchedActivities = await activityService.getActivities(user!.uid, {
        category: selectedCategory,
        dateRange,
        limit: perPage
      });
      setAllActivities(fetchedActivities);
    } catch (err) {
      setError('Failed to load activities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter activities based on search query and other filters
  const filteredActivities = useMemo(() => {
    let filtered = [...allActivities];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(query) ||
        activity.details?.toLowerCase().includes(query) ||
        activity.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(activity => 
        activity.category === selectedCategory
      );
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= dateRange.start! && 
               activityDate <= dateRange.end!;
      });
    }

    return filtered.slice(0, perPage);
  }, [allActivities, searchQuery, selectedCategory, dateRange, perPage]);

  const handleDelete = async (activityId: string) => {
    setDeleteActivityId(activityId);
  };

  const confirmDelete = async () => {
    if (!deleteActivityId) return;
    
    try {
      await activityService.deleteActivity(user!.uid, deleteActivityId);
      setAllActivities(allActivities.filter(activity => activity.id !== deleteActivityId));
    } catch (err) {
      console.error('Failed to delete activity:', err);
    } finally {
      setDeleteActivityId(null);
    }
  };

  return {
    activities: filteredActivities,
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
  };
};
