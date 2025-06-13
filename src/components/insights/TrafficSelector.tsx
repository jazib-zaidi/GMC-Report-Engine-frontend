import React, { useState } from 'react';
import Select from '../ui/Select';

const TrafficSelector = ({ traffic, handleTrafic }) => {
  return (
    <div className='flex items-center mr-3 gap-x-3'>
      <p>Traffic: </p>
      <Select value={traffic} onChange={(e) => handleTrafic(e.target.value)}>
        <option value='All'>All</option>
        <option value='Ads'>Ads</option>
        <option value='Organic'>Organic</option>
      </Select>
    </div>
  );
};

export default TrafficSelector;
