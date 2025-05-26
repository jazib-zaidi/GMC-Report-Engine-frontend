import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { format, subDays } from 'date-fns';
import { CalendarRange } from 'lucide-react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useAuth } from '../context/AuthContext';

const TimePeriod: React.FC = () => {
  const {
    setFormattedDateRange,
    selectedAdsAccount,
    fetchLiaReports,
    setLiaReportData,
  } = useAuth();
  const [showPicker, setShowPicker] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    key: 'selection',
  });

  const [formattedRange, setFormattedRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange(ranges.selection);

    setFormattedRange({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
    });

    setFormattedDateRange({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
    });
  };

  const handleApply = () => {
    setShowPicker(false);
    setLiaReportData(null);
    fetchLiaReports(selectedAdsAccount?.customer_id, formattedRange, 'ALL');
  };

  return (
    <div className='relative inline-block text-sm text-gray-600 w-full flex items-center justify-between'>
      <div
        onClick={() => setShowPicker(!showPicker)}
        className='inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer'
      >
        <CalendarRange size={16} className='text-gray-400' />
        <span className='font-medium text-gray-800'>
          {format(dateRange.startDate, 'dd MMM yyyy')} –{' '}
          {format(dateRange.endDate, 'dd MMM yyyy')}
        </span>
      </div>

      {showPicker && (
        <div className='absolute z-50 mt-56 bg-white p-4 border rounded shadow-lg'>
          <DateRangePicker
            onChange={handleSelect}
            showSelectionPreview
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={[dateRange]}
            direction='horizontal'
            maxDate={new Date()}
          />
          <div className='flex justify-end mt-2'>
            <button
              onClick={() => setShowPicker(false)}
              className='px-4 py-1.5 text-sm text-black  rounded mr-2 bg-gray-200 hover:bg-gray-300'
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className='px-4 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700'
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePeriod;
