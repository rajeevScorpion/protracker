import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CategoryStat {
  name: string;
  hours: number;
  percentage: number;
}

interface ActivityCategoryStatsProps {
  stats: CategoryStat[];
  period: string;
  onPeriodChange: (period: string) => void;
}

const PERIODS = [
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Quarter', value: 'quarter' },
  { label: 'Half Year', value: 'halfYear' },
  { label: 'This Year', value: 'year' }
];

const ActivityCategoryStats: React.FC<ActivityCategoryStatsProps> = ({ 
  stats, 
  period,
  onPeriodChange 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Activity Categories</h3>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full hover:bg-gray-100"
          >
            {PERIODS.find(p => p.value === period)?.label}
            <ChevronDown className="h-4 w-4" />
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border z-20">
                {PERIODS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => {
                      onPeriodChange(p.value);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg",
                      period === p.value && "bg-gray-50 text-blue-600"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {stats.length > 0 ? (
          stats.map((stat) => (
            <div key={stat.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{stat.name}</span>
                <span className="text-gray-600">{stat.hours} hrs</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No activity data available for this period
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityCategoryStats;
