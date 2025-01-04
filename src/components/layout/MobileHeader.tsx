import React from 'react';
import { Menu, Activity } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b flex items-center justify-between px-4 z-20">
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-semibold">Protracker</h1>
      </div>
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-full"
        aria-label="Menu"
      >
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
};

export default MobileHeader;
