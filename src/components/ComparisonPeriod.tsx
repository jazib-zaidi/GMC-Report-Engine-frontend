import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { subDays, format } from 'date-fns';
import { CalendarRange } from 'lucide-react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useAuth } from '../context/AuthContext';
import AdvanceFilter from './insights/AdvanceFilter';

const ComparisonPeriod: React.FC = () => {
  const {
    setSelectedDateRange,
    setReportData,
    setFilter,
    filter,
    selectedDateRange,
    setPreviousDateRange,
    reportData,
  } = useAuth();

  const [showPicker, setShowPicker] = useState(false);
  const [showPreviousTypeDropdown, setShowPreviousTypeDropdown] =
    useState(false);
  const [previousType, setPreviousType] = useState<'year' | 'period'>('year');

  const [currentPeriod, setCurrentPeriod] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  useEffect(() => {
    if (selectedDateRange?.startDate && selectedDateRange?.endDate) {
      const start = new Date(selectedDateRange.startDate);
      const end = new Date(selectedDateRange.endDate);
      setTempRange({
        startDate: start,
        endDate: end,
        key: 'selection',
      });
      setCurrentPeriod({
        startDate: start,
        endDate: end,
        key: 'selection',
      });

      const newPrevious = calculatePreviousPeriod(
        { startDate: start, endDate: end },
        previousType
      );
      setPreviousPeriod(newPrevious);
    }
  }, [selectedDateRange, previousType]);
  useEffect(() => {
    const storedPreviousType = localStorage.getItem('previousType') as
      | 'year'
      | 'period';

    if (storedPreviousType) {
      setPreviousType(storedPreviousType);
    }
  }, [reportData]);

  const [previousPeriod, setPreviousPeriod] = useState({
    startDate: subDays(new Date(), 365),
    endDate: subDays(new Date(), 365),
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

  const calculatePreviousPeriod = (
    range: { startDate: Date; endDate: Date },
    type: 'year' | 'period'
  ) => {
    if (type === 'year') {
      return {
        startDate: subDays(range.startDate, 365),
        endDate: subDays(range.endDate, 365),
        key: 'previous',
      };
    } else {
      const diff = range.endDate.getTime() - range.startDate.getTime();
      return {
        startDate: new Date(range.startDate.getTime() - diff - 1),
        endDate: new Date(range.startDate.getTime() - 1),
        key: 'previous',
      };
    }
  };

  const applyDates = () => {
    setReportData(null);
    setFilter({});
    const formattedCurrentStart = format(tempRange.startDate, 'yyyy-MM-dd');
    const formattedCurrentEnd = format(tempRange.endDate, 'yyyy-MM-dd');

    const selectedRange = {
      startDate: formattedCurrentStart,
      endDate: formattedCurrentEnd,
    };

    localStorage.setItem('selectedDateRange', JSON.stringify(selectedRange));
    setSelectedDateRange(selectedRange);
    setCurrentPeriod(tempRange);

    const newPrevious = calculatePreviousPeriod(tempRange, previousType);
    setPreviousPeriod(newPrevious);
    const formattedPrevStart = format(newPrevious.startDate, 'yyyy-MM-dd');
    const formattedPrevEnd = format(newPrevious.endDate, 'yyyy-MM-dd');
    const selectedPrevRange = {
      startDate: formattedPrevStart,
      endDate: formattedPrevEnd,
    };
    setPreviousDateRange(selectedPrevRange);
    setShowPicker(false);
  };

  const handlePreviousTypeChange = (type: 'year' | 'period') => {
    setReportData(null);
    setPreviousType(type);
    localStorage.setItem('previousType', type);

    const newPrevious = calculatePreviousPeriod(currentPeriod, type);
    setPreviousPeriod(newPrevious);
    setShowPreviousTypeDropdown(false);
    const formattedPrevStart = format(newPrevious.startDate, 'yyyy-MM-dd');
    const formattedPrevEnd = format(newPrevious.endDate, 'yyyy-MM-dd');
    const selectedRange = {
      startDate: formattedPrevStart,
      endDate: formattedPrevEnd,
    };
    setPreviousDateRange(selectedRange);
  };

  const handleSearch = (data: any) => {
    if (data?.selectedAttribute) {
      setFilter(data);
      setReportData(null);
    }
  };
  console.log(filter?.searchValue?.split('\n'));
  const renderFilterValue = () => {
    const values = filter?.searchValue
      ?.split('\n')
      .map((v) => v.trim())
      .filter((v) => v); // remove empty or whitespace-only values

    if (!values || values.length === 0) return null;

    if (values.length === 1) {
      return values[0];
    } else {
      return `${values[0]}, +${values.length - 1} more`;
    }
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
          {format(selectedDateRange.startDate, 'dd MMM yyyy')} –{' '}
          {format(selectedDateRange.endDate, 'dd MMM yyyy')}
        </span>
        <span className='text-gray-400'>vs</span>
        <span
          className='text-gray-800 cursor-pointer relative'
          onClick={() => setShowPreviousTypeDropdown(!showPreviousTypeDropdown)}
        >
          {format(previousPeriod.startDate, 'dd MMM yyyy')} –{' '}
          {format(previousPeriod.endDate, 'dd MMM yyyy')}
          {showPreviousTypeDropdown && (
            <div className='absolute z-50 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg'>
              <button
                onClick={() => handlePreviousTypeChange('year')}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  previousType === 'year' ? 'font-semibold text-blue-600' : ''
                }`}
              >
                Previous Year
              </button>
              <button
                onClick={() => handlePreviousTypeChange('period')}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  previousType === 'period' ? 'font-semibold text-blue-600' : ''
                }`}
              >
                Previous Period
              </button>
            </div>
          )}
        </span>
      </div>
      <div className='flex items-center justify-center'>
        {filter?.searchValue && (
          <div className='flex items-center space-x-2 bg-white border border-gray-400 rounded-full mr-3 px-2'>
            <span className='text-sm space-x-2 px-2 py-2 rounded-md'>
              Filtered by{' '}
              {filter?.selectedAttribute === 'offerId'
                ? 'Product ID'
                : filter?.selectedAttribute}{' '}
              contains {renderFilterValue()}
              <button
                onClick={() => {
                  setReportData(null);
                  setFilter({});
                }}
                className='text-sm hover:underline ml-2'
              >
                X
              </button>
            </span>
          </div>
        )}
        <AdvanceFilter
          filterValue={(data: any) => {
            handleSearch(data);
          }}
        />
      </div>
      {showPicker && (
        <div className='absolute z-50 mt-56 bg-white p-4 border rounded shadow-lg'>
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
