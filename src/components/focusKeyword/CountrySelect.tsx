import React, { useMemo, useState } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useAuth } from '../../context/AuthContext';

const customStyles = {
  control: (base) => ({
    ...base,
    'backgroundColor': '#fff',
    'borderColor': '#d1d5db',
    'padding': '2px 4px',
    'borderRadius': '0.5rem',
    'boxShadow': 'none',
    '&:hover': { borderColor: '#9ca3af' },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '0.5rem',
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#f3f4f6' : '#fff',
    color: '#111827',
    padding: '8px 12px',
    cursor: 'pointer',
  }),
};

const CountrySelect = ({ showLabel = true }) => {
  const [value, setValue] = useState(null);
  const options = useMemo(() => countryList().getData(), []);
  const { setCountry, country } = useAuth();

  const handleChange = (val) => {
    setCountry(val);
  };

  return (
    <div className=''>
      <label className='block mb-2 text-sm font-medium text-gray-700'>
        {showLabel ? 'Select country' : 'Selected country :'}
      </label>
      <Select
        styles={customStyles}
        options={options}
        value={country}
        onChange={handleChange}
        isSearchable
        placeholder='Search or select a country...'
      />
    </div>
  );
};

export default CountrySelect;
