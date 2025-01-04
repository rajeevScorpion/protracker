import React from 'react';
import { ChevronDown } from 'lucide-react';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const categories = [
  'Meeting',
  'Client Call',
  'Development',
  'Design',
  'Research',
  'Documentation',
  'Other'
];

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-gray-100 rounded-md appearance-none text-gray-700"
      >
        <option value="" disabled>Category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
    </div>
  );
};

export default CategorySelect;
