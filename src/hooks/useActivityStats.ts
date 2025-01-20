import { useState, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
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

export const useActivityStats = () => {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
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

        const activitiesRef = collection(db, `users/${user.uid}/activities`);
        const q = query(
          activitiesRef,
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(endDate))
        );

        const snapshot = await getDocs(q);
        const activities = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        // Calculate stats by category
        const categoryHours = new Map<string, number>();
        let totalHours = 0;

        activities.forEach(activity => {
          if (!activity.category) return;
          const durationHours = (activity.duration || 0) / 60;
          categoryHours.set(
            activity.category,
            (categoryHours.get(activity.category) || 0) + durationHours
          );
          totalHours += durationHours;
        });

        const stats = Array.from(categoryHours.entries()).map(([name, hours]) => ({
          name,
          hours: Math.round(hours * 10) / 10,
          percentage: totalHours ? Math.round((hours / totalHours) * 100) : 0
        }));

        setCategoryStats(stats);
        setError(null);
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
    setPeriod
  };
};
