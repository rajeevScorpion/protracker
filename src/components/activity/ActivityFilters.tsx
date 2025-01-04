import React, { useState } from 'react';
import { Search, ChevronDown, Calendar, X } from 'lucide-react';
import DateRangePicker from './DateRangePicker';

const CATEGORIES = [
  'Meeting',
  'Client Call',
  'Development',
  'Design',
  'Research',
  'Documentation',
  'Other'
];

interface ActivityFiltersProps {
  selectedCategory: string;
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onPerPageChange: (perPage: number) => void;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  selectedCategory,
  onSearch,
  onCategoryChange,
  onDateRangeChange,
  onPerPageChange
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onSearch(e.target.value);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          onChange={handleSearchChange}
          placeholder="Search: Task ID / Keyword"
          className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex gap-4">
        <div className="relative flex-1">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="relative flex-1">
          <select
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="w-full appearance-none pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <Calendar className="h-5 w-5 text-gray-500" />
            <span>Select Range</span>
          </button>
          
          {isDatePickerOpen && (
            <div className="absolute right-0 top-full mt-2 z-10">
              <DateRangePicker
                onSelect={(range) => {
                  onDateRangeChange(range);
                  setIsDatePickerOpen(false);
                }}
                onClose={() => setIsDatePickerOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFilters;
