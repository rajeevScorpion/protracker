import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  title: string;
  date: Date;
  startTime: Date;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const formatActivityTime = (activity: Activity) => {
    try {
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
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Recent Activities</h3>
        <Link 
          to="/history"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          All Activities
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
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
  );
};

export default RecentActivities;
