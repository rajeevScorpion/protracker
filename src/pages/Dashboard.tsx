import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';
import { useAuthState } from '../hooks/useAuthState';
import { activityService } from '../services/activity.service';
import { taskService } from '../services/task.service';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import StatsCard from '../components/dashboard/StatsCard';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import RecentActivities from '../components/dashboard/RecentActivities';
import ActivityCategoryStats from '../components/dashboard/ActivityCategoryStats';
import { useActivityStats } from '../hooks/useActivityStats';

interface DashboardStats {
  weeklyActivities: number;
  completedTasks: number;
  totalTasks: number;
}

const Dashboard = () => {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    weeklyActivities: 0,
    completedTasks: 0,
    totalTasks: 0
  });
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  
  const { 
    categoryStats, 
    loading: statsLoading, 
    error: statsError,
    period,
    setPeriod
  } = useActivityStats();

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const tasks = await taskService.getTasks(user.uid);
        const completedTasks = tasks.filter(task => task.status === 'completed');
        
        const pendingTasks = tasks
          .filter(task => task.status === 'pending')
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 3);

        const activities = await activityService.getActivities(user.uid, { limit: 3 });

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyActivitiesCount = activities.filter(
          activity => new Date(activity.date) > oneWeekAgo
        ).length;

        setStats({
          weeklyActivities: weeklyActivitiesCount,
          completedTasks: completedTasks.length,
          totalTasks: tasks.length
        });
        setUpcomingTasks(pendingTasks);
        setRecentActivities(activities);

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading || statsLoading) {
    return <LoadingSpinner />;
  }

  if (error || statsError) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <div className="px-4">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error || statsError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatsCard
            icon={Activity}
            title="Activities"
            value={stats.weeklyActivities}
            subtitle="This week"
            iconColor="text-blue-600"
          />
          
          <StatsCard
            icon={CheckCircle2}
            title="Tasks"
            value={`${stats.completedTasks}/${stats.totalTasks}`}
            subtitle="Completed"
            iconColor="text-green-600"
          />
        </div>

        <div className="space-y-4">
          <UpcomingTasks tasks={upcomingTasks} />
          <RecentActivities activities={recentActivities} />
          <ActivityCategoryStats 
            stats={categoryStats || []}
            period={period}
            onPeriodChange={setPeriod}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
