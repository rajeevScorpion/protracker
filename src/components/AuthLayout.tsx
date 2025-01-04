import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from '../hooks/useAuthState';
import Sidebar from './Sidebar';

const AuthLayout = () => {
  const { user, loading } = useAuthState();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
