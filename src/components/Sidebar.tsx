import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  PlusCircle, 
  ClipboardList, 
  History, 
  LayoutDashboard, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '../lib/utils';

const navItems = [
  { icon: PlusCircle, label: 'New Activity', path: '/new-activity' },
  { icon: ClipboardList, label: 'New Task', path: '/new-task' },
  { icon: History, label: 'Activity History', path: '/history' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="h-screen w-64 bg-white shadow-lg flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold">Protracker</h1>
      </div>

      <nav className="flex-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg mb-1 text-gray-700 hover:bg-gray-100',
                isActive && 'bg-gray-100 font-medium'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 w-full text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
        <NavLink
          to="/terms"
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Terms & Conditions
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
