import { CalendarRange } from 'lucide-react';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const SelectedDate = () => {
  const { formattedDateRange } = useAuth();
  return (
    <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm cursor-not-allowed'>
      <CalendarRange size={16} className='text-gray-400' />
      <span className='font-medium text-gray-800'>
        {format(formattedDateRange.startDate, 'dd MMM yyyy')} –{' '}
        {format(formattedDateRange.endDate, 'dd MMM yyyy')}
      </span>
    </div>
  );
};

export default SelectedDate;
