import React from 'react';
import { Activity, CheckCircle2, Clock, Calendar } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium">Activities</h3>
          </div>
          <p className="text-2xl font-semibold">12</p>
          <p className="text-sm text-gray-500">This week</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h3 className="font-medium">Tasks</h3>
          </div>
          <p className="text-2xl font-semibold">8/15</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-medium mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-900">Client Meeting</p>
                  <p className="text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-medium mb-4">Upcoming Tasks</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-900">Project Review</p>
                  <p className="text-gray-500">Tomorrow at 10:00 AM</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
