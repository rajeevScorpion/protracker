import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from './hooks/useAuthState';
import MobileLayout from './components/layout/MobileLayout';
import Login from './pages/Login';
import TaskList from './pages/TaskList';
import NewActivity from './pages/NewActivity';
import ActivityHistory from './pages/ActivityHistory';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function App() {
  const { user, loading } = useAuthState();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route
          path="/"
          element={
            user ? <MobileLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="new-activity" element={<NewActivity />} />
          <Route path="task-list" element={<TaskList />} />
          <Route path="history" element={<ActivityHistory />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
