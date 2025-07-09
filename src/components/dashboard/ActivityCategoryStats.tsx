import React, { useState, useEffect, useCallback } from 'react';
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
  { label: 'This Year', value: 'year' },
  { label: 'Lifetime', value: 'lifetime' }
];

const ActivityCategoryStats: React.FC<ActivityCategoryStatsProps> = ({ 
  stats, 
  period,
  onPeriodChange 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [animatedStats, setAnimatedStats] = useState<CategoryStat[]>([]);

  // Prevent page refresh and only toggle dropdown
  const toggleDropdown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  }, []);

  // Prevent page refresh when selecting period
  const handlePeriodSelect = useCallback((newPeriod: string) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Only update if period actually changed
      if (newPeriod !== period) {
        onPeriodChange(newPeriod);
      }
      setIsDropdownOpen(false);
    };
  }, [period, onPeriodChange]);

  // Close dropdown when clicking outside
  const handleOutsideClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isDropdownOpen]);

  // Animate chart bars when stats change
  useEffect(() => {
    // Reset to 0 first for smooth animation
    setAnimatedStats(stats.map(stat => ({ ...stat, percentage: 0 })));
    
    // Trigger animation after brief delay
    const timeout = setTimeout(() => {
      setAnimatedStats(stats);
    }, 100);

    return () => clearTimeout(timeout);
  }, [stats]);

  const currentPeriodLabel = PERIODS.find(p => p.value === period)?.label || 'This Month';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Activity Categories</h3>
        <div className="relative">
          <button 
            type="button"
            onClick={toggleDropdown}
            className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            {currentPeriodLabel}
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              isDropdownOpen && "rotate-180"
            )} />
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={handleOutsideClick}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border z-20 py-1">
                {PERIODS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={handlePeriodSelect(p.value)}
                    className={cn(
                      "w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50",
                      period === p.value && "bg-blue-50 text-blue-600 font-medium"
                    )}
                    role="menuitem"
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
        {animatedStats.length > 0 ? (
          animatedStats.map((stat, index) => (
            <div key={stat.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">{stat.name}</span>
                <span className="text-gray-600">{stat.hours}h</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${stat.percentage}%`,
                    transitionDelay: `${index * 50}ms`
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">📊</div>
            <p className="text-sm text-gray-500">
              No activity data available for this period
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCategoryStats;
