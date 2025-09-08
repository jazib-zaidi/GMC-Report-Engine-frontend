import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronDown } from 'lucide-react';
import Select from '../ui/Select';

const attributes = [
  {
    value: 'Product ID',
    key: 'offerId',
  },
  {
    value: 'Brand',
    key: 'brand',
  },
  {
    value: 'Product Type 1',
    key: 'productTypeL1',
  },
  {
    value: 'Product Type 2',
    key: 'productTypeL2',
  },
  {
    value: 'Product Type 3',
    key: 'productTypeL3',
  },
  {
    value: 'Product Type 4',
    key: 'productTypeL4',
  },
  {
    value: 'Product Type 5',
    key: 'productTypeL5',
  },
  {
    value: 'Custom Label 0',
    key: 'customLabel0',
  },
  {
    value: 'Custom Label 1',
    key: 'customLabel1',
  },
  {
    value: 'Custom Label 2',
    key: 'customLabel2',
  },
  {
    value: 'Custom Label 3',
    key: 'customLabel3',
  },
  {
    value: 'Custom Label 4',
    key: 'customLabel4',
  },
];

const AdvanceFilter = ({ filterValue }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const containerRef = useRef(null);
  const [condition, setCondition] = useState('Include');
  const conditionArr = ['Include', 'Exclude'];
  const notify = () => toast.error('Please enter a value to filter!');
  const handleApply = () => {
    if (searchValue.trim() === '') {
      notify();
      return;
    } else {
      filterValue({ selectedAttribute, searchValue, mode: condition });
      setSelectedAttribute(null);
      setSearchValue('');
      setShowDropdown(false);
    }
  };

  const handleCancel = () => {
    setSelectedAttribute(null);
    setSearchValue('');
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedAttribute(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className='relative inline-block text-left w-[300px]'
    >
      <span className='mr-2'>Filter</span>
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          setSelectedAttribute(null);
        }}
        className='border-2 bg-white border-gray-300 text-black py-2 rounded-md transition duration-200 w-[80px]'
      >
        Filter <ChevronDown size={16} className='inline' />
      </button>
      {showDropdown && !selectedAttribute && (
        <div className='absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10'>
          <div className='max-h-72 overflow-y-auto'>
            {attributes.map((attr, index) => (
              <div
                key={index}
                className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                onClick={() => {
                  setSelectedAttribute(attr.key);
                }}
              >
                {attr.value}
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedAttribute && (
        <div className='absolute right-0 mt-2 w-[27rem] bg-white border border-gray-300 rounded-md shadow-lg z-20 p-4'>
          <div className='mb-2 font-medium'>{selectedAttribute}</div>

          <div className='text-sm text-gray-500 mb-2'>
            Enter values to filter:
          </div>
          <Select
            label='Condition'
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value='include'>Include</option>
            <option value='exclude'>Exclude</option>
          </Select>
          <br />
          <textarea
            value={searchValue}
            rows={6}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder='Enter one value per line'
            className='w-full border border-gray-300 rounded-md px-3 py-1 mb-3'
          />
          <div className='flex gap-2 '>
            <button
              onClick={handleApply}
              className='px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Apply
            </button>

            <button
              onClick={handleCancel}
              className='px-3 py-1 bg-gray-200 text-black rounded-md hover:bg-gray-300'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvanceFilter;
