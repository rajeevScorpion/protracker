import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { useAuthState } from '../hooks/useAuthState';
import { activityService } from '../services/activity.service';
import { taskService } from '../services/task.service';
import { format, formatDistanceToNow } from 'date-fns';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

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

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch tasks
        const tasks = await taskService.getTasks(user.uid);
        const completedTasks = tasks.filter(task => task.status === 'completed');
        
        // Sort tasks by due date and get upcoming ones
        const pendingTasks = tasks
          .filter(task => task.status === 'pending')
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 3);

        // Fetch recent activities
        const activities = await activityService.getActivities(user.uid, { limit: 3 });

        // Calculate weekly activities
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

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const formatActivityTime = (activity: any) => {
    try {
      // Use the combined date and start time for the activity timestamp
      const activityTime = new Date(activity.date);
      activityTime.setHours(
        activity.startTime.getHours(),
        activity.startTime.getMinutes()
      );
      return formatDistanceToNow(activityTime, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Unknown time';
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium">Activities</h3>
          </div>
          <p className="text-2xl font-semibold">{stats.weeklyActivities}</p>
          <p className="text-sm text-gray-500">This week</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h3 className="font-medium">Tasks</h3>
          </div>
          <p className="text-2xl font-semibold">
            {stats.completedTasks}/{stats.totalTasks}
          </p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-medium mb-4">Upcoming Tasks</h3>
          <div className="space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-900">{task.title}</p>
                    <p className="text-gray-500">
                      Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No upcoming tasks</p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-medium mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-900">{activity.title}</p>
                    <p className="text-gray-500">
                      {formatActivityTime(activity)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
