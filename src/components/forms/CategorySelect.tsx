import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';

interface CategorySelectProps {
  type: 'activity' | 'task';
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ type, value, onChange }) => {
  const { categories, loading } = useCategories(type);

  if (loading) {
    return (
      <div className="w-full p-3 bg-gray-100 rounded-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-gray-100 rounded-md appearance-none text-gray-700"
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
    </div>
  );
};

export default CategorySelect;
