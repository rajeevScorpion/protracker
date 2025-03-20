import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';

interface DateRangePickerProps {
  onSelect: (range: { start: Date | null; end: Date | null }) => void;
  onClose: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onSelect, onClose }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleApply = () => {
    onSelect({ start: startDate, end: endDate });
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onSelect({ start: null, end: null });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Select Date Range</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
            min={startDate ? format(startDate, 'yyyy-MM-dd') : undefined}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleClear}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
