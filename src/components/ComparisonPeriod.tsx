import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { subDays, format } from 'date-fns';
import { CalendarRange } from 'lucide-react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useAuth } from '../context/AuthContext';
import AdvanceFilter from './insights/AdvanceFilter';

const ComparisonPeriod: React.FC = () => {
  const { setSelectedDateRange, setReportData, setFilter, filter } = useAuth();
  const [showPicker, setShowPicker] = useState(false);

  const [currentPeriod, setCurrentPeriod] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const [previousPeriod, setPreviousPeriod] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'previous',
  });

  const [tempRange, setTempRange] = useState({
    startDate: currentPeriod.startDate,
    endDate: currentPeriod.endDate,
    key: 'selection',
  });

  const handleSelect = (ranges: any) => {
    setTempRange(ranges.selection);
  };

  const applyDates = () => {
    setReportData(null);
    const formattedCurrentStart = format(tempRange.startDate, 'yyyy-MM-dd');
    const formattedCurrentEnd = format(tempRange.endDate, 'yyyy-MM-dd');

    const selectedRange = {
      startDate: formattedCurrentStart,
      endDate: formattedCurrentEnd,
    };

    // Save to localStorage
    localStorage.setItem('selectedDateRange', JSON.stringify(selectedRange));

    setSelectedDateRange(selectedRange);

    const prevStart = subDays(tempRange.startDate, 365);
    const prevEnd = subDays(tempRange.endDate, 365);

    setCurrentPeriod(tempRange);
    setPreviousPeriod({
      startDate: prevStart,
      endDate: prevEnd,
      key: 'previous',
    });

    setShowPicker(false);
  };

  useEffect(() => {
    const storedRange = localStorage.getItem('selectedDateRange');
    if (storedRange) {
      const parsed = JSON.parse(storedRange);
      const start = new Date(parsed.startDate);
      const end = new Date(parsed.endDate);

      setCurrentPeriod({
        startDate: start,
        endDate: end,
        key: 'selection',
      });
      setTempRange({
        startDate: start,
        endDate: end,
        key: 'selection',
      });

      const prevStart = subDays(start, 365);
      const prevEnd = subDays(end, 365);

      setPreviousPeriod({
        startDate: prevStart,
        endDate: prevEnd,
        key: 'previous',
      });

      setSelectedDateRange(parsed);
    } else {
      // default to last 30 days
      const currentDate = new Date();
      const last30DaysStart = subDays(currentDate, 30);

      setCurrentPeriod({
        startDate: last30DaysStart,
        endDate: currentDate,
        key: 'selection',
      });
      setTempRange({
        startDate: last30DaysStart,
        endDate: currentDate,
        key: 'selection',
      });

      const prevStart = subDays(last30DaysStart, 365);
      const prevEnd = subDays(currentDate, 365);

      setPreviousPeriod({
        startDate: prevStart,
        endDate: prevEnd,
        key: 'previous',
      });

      setSelectedDateRange({
        startDate: format(last30DaysStart, 'yyyy-MM-dd'),
        endDate: format(currentDate, 'yyyy-MM-dd'),
      });
    }
  }, []);
  const handleSearch = (data) => {
    setFilter(data);
  };
  return (
    <div className='relative inline-block text-sm text-gray-600 w-full flex items-center justify-between'>
      <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm '>
        <CalendarRange size={16} className='text-gray-400' />
        <span>Comparing periods:</span>
        <span
          onClick={() => setShowPicker(!showPicker)}
          className='font-medium text-gray-800 cursor-pointer'
        >
          {format(currentPeriod.startDate, 'dd MMM yyyy')} –{' '}
          {format(currentPeriod.endDate, 'dd MMM yyyy')}
        </span>
        <span className='text-gray-400'>vs</span>
        <span className='text-gray-500 cursor-not-allowed'>
          {format(previousPeriod.startDate, 'dd MMM yyyy')} –{' '}
          {format(previousPeriod.endDate, 'dd MMM yyyy')}
        </span>
      </div>
      <div className='flex items-center justify-center'>
        {filter?.searchValue && (
          <>
            <div className='flex items-center space-x-2 bg-white border border-gray-400 rounded-full mr-3 px-2'>
              <span className='text-sm   space-x-2  px-2 py-2 rounded-md'>
                Filtered by{' '}
                {filter?.selectedAttribute == 'offerId'
                  ? 'Product ID'
                  : filter?.selectedAttribute}{' '}
                Equals to {filter?.searchValue}
                <button
                  onClick={() => {
                    setFilter({});
                  }}
                  className='text-sm hover:underline ml-2'
                >
                  X
                </button>
              </span>
            </div>
          </>
        )}
        <AdvanceFilter
          filterValue={(data) => {
            handleSearch(data);
          }}
        />
      </div>
      {showPicker && (
        <div className='absolute z-10 mt-2 bg-white p-4 border rounded shadow-lg'>
          <DateRangePicker
            onChange={handleSelect}
            showSelectionPreview
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={[tempRange]}
            direction='horizontal'
            maxDate={new Date()}
          />
          <div className='flex justify-end mt-2'>
            <button
              onClick={() => setShowPicker(false)}
              className='mr-2 px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-100'
            >
              Cancel
            </button>
            <button
              onClick={applyDates}
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

export default ComparisonPeriod;
