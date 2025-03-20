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

  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [user]);

  const loadActivities = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const fetchedActivities = await activityService.getActivities(user.uid);
      setAllActivities(fetchedActivities);
      setError(null);
    } catch (err) {
      console.error('Failed to load activities:', err);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = useMemo(() => {
    let filtered = [...allActivities];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(query) ||
        activity.details?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= dateRange.start! && activityDate <= dateRange.end!;
      });
    }

    return filtered.slice(0, perPage);
  }, [allActivities, searchQuery, selectedCategory, dateRange, perPage]);

  const handleDelete = async (activityId: string) => {
    setDeleteActivityId(activityId);
  };

  const confirmDelete = async () => {
    if (!deleteActivityId || !user) return;
    
    try {
      await activityService.deleteActivity(user.uid, deleteActivityId);
      setAllActivities(prev => prev.filter(activity => activity.id !== deleteActivityId));
      setDeleteActivityId(null);
    } catch (err) {
      console.error('Failed to delete activity:', err);
      setError('Failed to delete activity');
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
    setDeleteActivityId,
    refresh: loadActivities
  };
};
