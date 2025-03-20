import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle: string;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value, subtitle, iconColor }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

export default StatsCard;
