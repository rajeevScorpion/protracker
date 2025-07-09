import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { activityService } from '../services/activity.service';
import { startOfDay, endOfDay } from 'date-fns';

interface Activity {
  id: string;
  title: string;
  category: string;
  startTime: Date;
  endTime: Date;
  date: Date;
  duration: number;
  images: string[];
  details?: string;
}

export const useActivitySearch = (user: any) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [perPage, setPerPage] = useState(10);
  const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      // Don't return early - always set loading to false
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const activitiesRef = collection(db, `users/${user.uid}/activities`);
        let q = query(activitiesRef, orderBy('date', 'desc'));

        // Apply date range filter if specified
        if (dateRange.start && dateRange.end) {
          const startDate = startOfDay(new Date(dateRange.start));
          const endDate = endOfDay(new Date(dateRange.end));
          q = query(
            activitiesRef,
            where('date', '>=', Timestamp.fromDate(startDate)),
            where('date', '<=', Timestamp.fromDate(endDate)),
            orderBy('date', 'desc')
          );
        }

        const snapshot = await getDocs(q);
        let fetchedActivities = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            category: data.category,
            startTime: data.startTime.toDate(),
            endTime: data.endTime.toDate(),
            date: data.date.toDate(),
            duration: data.duration,
            images: data.images || [],
            details: data.details || ''
          };
        });

        // Apply client-side filters
        if (searchQuery) {
          fetchedActivities = fetchedActivities.filter(activity =>
            activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (selectedCategory) {
          fetchedActivities = fetchedActivities.filter(activity =>
            activity.category === selectedCategory
          );
        }

        // Apply pagination
        fetchedActivities = fetchedActivities.slice(0, perPage);

        console.log('Filtered activities:', fetchedActivities);
        console.log('Total duration for filtered activities:', 
          fetchedActivities.reduce((sum, activity) => sum + activity.duration, 0), 'minutes');

        setActivities(fetchedActivities);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user, searchQuery, selectedCategory, dateRange, perPage]);

  const handleDelete = async (id: string) => {
    setDeleteActivityId(id);
  };

  const confirmDelete = async () => {
    if (!deleteActivityId || !user) return;

    try {
      await activityService.deleteActivity(user.uid, deleteActivityId);
      setActivities(prev => prev.filter(activity => activity.id !== deleteActivityId));
      setDeleteActivityId(null);
    } catch (error) {
      console.error('Error deleting activity:', error);
      setError('Failed to delete activity');
    }
  };

  return {
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
  };
};
