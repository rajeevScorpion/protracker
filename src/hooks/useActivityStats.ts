import { useState, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { activityService } from '../services/activity.service';
import { useCategories } from './useCategories';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter, 
  startOfYear, 
  endOfYear, 
  subMonths,
  isWithinInterval
} from 'date-fns';

export const useActivityStats = () => {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [period, setPeriod] = useState('week');
  const { categories, loading: categoriesLoading } = useCategories('activity');
  const [activities, setActivities] = useState<any[]>([]);

  const getDateRange = (period: string) => {
    const now = new Date();
    switch (period) {
      case 'week':
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 })
        };
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
      case 'quarter':
        return {
          start: startOfQuarter(now),
          end: endOfQuarter(now)
        };
      case 'halfYear':
        return {
          start: startOfMonth(subMonths(now, 6)),
          end: endOfMonth(now)
        };
      case 'year':
        return {
          start: startOfYear(now),
          end: endOfYear(now)
        };
      default:
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
    }
  };

  // Fetch all activities once
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      try {
        const fetchedActivities = await activityService.getActivities(user.uid);
        setActivities(fetchedActivities);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to fetch activities');
      }
    };

    fetchActivities();
  }, [user]);

  // Calculate stats based on period
  useEffect(() => {
    const calculateStats = () => {
      if (!activities.length || !categories.length) return;

      try {
        setLoading(true);
        const dateRange = getDateRange(period);

        // Filter activities within the selected period
        const filteredActivities = activities.filter(activity => 
          isWithinInterval(new Date(activity.date), {
            start: dateRange.start,
            end: dateRange.end
          })
        );

        // Calculate hours per category
        const categoryHours = new Map<string, number>();
        let totalHours = 0;

        filteredActivities.forEach(activity => {
          if (!activity.category) return;
          
          // Calculate duration in hours from the activity's duration (which is in minutes)
          const durationHours = activity.duration / 60;
          
          categoryHours.set(
            activity.category,
            (categoryHours.get(activity.category) || 0) + durationHours
          );
          totalHours += durationHours;
        });

        // Create stats for all categories
        const stats = categories.map(category => ({
          name: category.name,
          hours: Math.round((categoryHours.get(category.name) || 0) * 10) / 10, // Round to 1 decimal
          percentage: totalHours ? 
            Math.round(((categoryHours.get(category.name) || 0) / totalHours) * 100) : 0
        }));

        setCategoryStats(stats);
      } catch (err) {
        console.error('Error calculating stats:', err);
        setError('Failed to calculate statistics');
      } finally {
        setLoading(false);
      }
    };

    calculateStats();
  }, [activities, categories, period]);

  return { 
    categoryStats, 
    loading: loading || categoriesLoading, 
    error,
    period,
    setPeriod
  };
};
