import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from './useAuthState';
import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter, 
  startOfYear, 
  endOfYear, 
  subMonths
} from 'date-fns';

interface CategoryStat {
  name: string;
  hours: number;
  percentage: number;
}

export const useActivityStats = () => {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [period, setPeriod] = useState('week');

  // Optimized period change handler that prevents unnecessary re-renders
  const handlePeriodChange = useCallback((newPeriod: string) => {
    // Only update if period actually changed
    if (newPeriod !== period) {
      setPeriod(newPeriod);
    }
  }, [period]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const activitiesRef = collection(db, `users/${user.uid}/activities`);
        let q;

        if (period === 'lifetime') {
          // For lifetime, get all activities
          q = query(activitiesRef, orderBy('date', 'desc'));
        } else {
          // For other periods, apply date filters
          const now = new Date();
          let startDate: Date;
          let endDate: Date;

          switch (period) {
            case 'week':
              startDate = startOfWeek(now, { weekStartsOn: 1 });
              endDate = endOfWeek(now, { weekStartsOn: 1 });
              break;
            case 'month':
              startDate = startOfMonth(now);
              endDate = endOfMonth(now);
              break;
            case 'quarter':
              startDate = startOfQuarter(now);
              endDate = endOfQuarter(now);
              break;
            case 'halfYear':
              startDate = startOfMonth(subMonths(now, 6));
              endDate = endOfMonth(now);
              break;
            case 'year':
              startDate = startOfYear(now);
              endDate = endOfYear(now);
              break;
            default:
              startDate = startOfMonth(now);
              endDate = endOfMonth(now);
          }

          q = query(
            activitiesRef,
            where('date', '>=', Timestamp.fromDate(startDate)),
            where('date', '<=', Timestamp.fromDate(endDate)),
            orderBy('date', 'desc')
          );
        }

        const snapshot = await getDocs(q);
        const activities = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        console.log(`Fetched ${activities.length} activities for period ${period}:`, activities);

        // Calculate stats by category with proper duration handling
        const categoryHours = new Map<string, number>();
        let totalHours = 0;

        activities.forEach(activity => {
          if (!activity.category) return;
          
          // Use the stored duration directly (it's already in minutes)
          const durationMinutes = activity.duration || 0;
          const durationHours = durationMinutes / 60;
          
          categoryHours.set(
            activity.category,
            (categoryHours.get(activity.category) || 0) + durationHours
          );
          totalHours += durationHours;
        });

        // Sort categories by hours (descending) and limit to top 8 for better visualization
        const stats = Array.from(categoryHours.entries())
          .map(([name, hours]) => ({
            name,
            hours: Math.round(hours * 10) / 10, // Round to 1 decimal place
            percentage: totalHours ? Math.round((hours / totalHours) * 100) : 0
          }))
          .sort((a, b) => b.hours - a.hours)
          .slice(0, 8); // Limit to top 8 categories

        console.log('Final stats:', stats);
        setCategoryStats(stats);
      } catch (err) {
        console.error('Error fetching activity stats:', err);
        setError('Failed to load activity statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, period]);

  return { 
    categoryStats, 
    loading, 
    error,
    period,
    setPeriod: handlePeriodChange
  };
};
