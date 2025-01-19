import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import { 
  PlusCircle, 
  ClipboardList, 
  History, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  X 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: PlusCircle, label: 'New Activity', path: '/new-activity' },
  { icon: ClipboardList, label: 'Task List', path: '/task-list' },
  { icon: History, label: 'Activity History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const MobileLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
      
      {/* Sidebar */}
      <>
        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40",
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="h-14 border-b flex items-center justify-between px-4">
            <h2 className="font-semibold">Menu</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100",
                    isActive && "bg-gray-100 font-medium"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </>

      <main className="pt-14 pb-20">
        <Outlet />
      </main>
    </div>
  );
};

export default MobileLayout;
