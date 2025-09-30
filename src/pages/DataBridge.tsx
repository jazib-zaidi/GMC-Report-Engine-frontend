import React from 'react';

import './DataBridge.css';

const DataBridge = () => {
  return (
    <div className='w-full h-screen test'>
      <iframe
        className='w-full h-full'
        src='https://product-data-bridge.vercel.app/'
        frameBorder='0'
      ></iframe>
    </div>
  );
};

export default DataBridge;
