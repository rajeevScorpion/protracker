import { useState, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { activityService } from '../services/activity.service';
import { useCategories } from './useCategories';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
         startOfQuarter, endOfQuarter, startOfYear, endOfYear, subMonths } from 'date-fns';

export const useActivityStats = () => {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [period, setPeriod] = useState('month');
  const { categories, loading: categoriesLoading } = useCategories('activity');

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

  useEffect(() => {
    const loadStats = async () => {
      if (!user || categoriesLoading) return;

      try {
        setLoading(true);
        setError(null);

        const dateRange = getDateRange(period);
        const activities = await activityService.getActivities(user.uid);

        const categoryHours = new Map<string, number>();
        let totalHours = 0;

        activities.forEach(activity => {
          if (!activity.category) return;
          
          const duration = activity.duration / 60; // Convert minutes to hours
          categoryHours.set(
            activity.category,
            (categoryHours.get(activity.category) || 0) + duration
          );
          totalHours += duration;
        });

        const stats = categories.map(category => ({
          name: category.name,
          hours: Math.round((categoryHours.get(category.name) || 0) * 10) / 10,
          percentage: totalHours ? 
            Math.round(((categoryHours.get(category.name) || 0) / totalHours) * 100) : 0
        }));

        setCategoryStats(stats);
      } catch (err) {
        console.error('Error loading activity stats:', err);
        setError('Failed to load activity statistics');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, categories, categoriesLoading, period]);

  return { 
    categoryStats, 
    loading: loading || categoriesLoading, 
    error,
    period,
    setPeriod
  };
};
