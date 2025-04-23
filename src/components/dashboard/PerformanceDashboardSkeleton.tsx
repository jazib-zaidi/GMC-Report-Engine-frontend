import React from 'react';

export default function PerformanceDashboardSkeleton() {
  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='mb-6'>
        <div className='h-8 w-64 bg-gray-200 rounded-md animate-pulse'></div>
      </div>

      {/* Date Range Selector */}
      <div className='mb-8 p-4 bg-white rounded-lg shadow-sm flex items-center justify-between'>
        <div className='h-6 w-36 bg-gray-200 rounded-md animate-pulse'></div>
        <div className='flex space-x-2 items-center'>
          <div className='h-8 w-32 bg-gray-200 rounded-md animate-pulse'></div>
          <div className='h-4 w-4 bg-gray-200 rounded-md animate-pulse'></div>
          <div className='h-8 w-32 bg-gray-200 rounded-md animate-pulse'></div>
        </div>
        <div className='h-6 w-6 bg-gray-200 rounded-md animate-pulse'></div>
        <div className='flex space-x-2 items-center'>
          <div className='h-8 w-32 bg-gray-200 rounded-md animate-pulse'></div>
          <div className='h-4 w-4 bg-gray-200 rounded-md animate-pulse'></div>
          <div className='h-8 w-32 bg-gray-200 rounded-md animate-pulse'></div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {/* Impressions Card */}
        <div className='p-6 bg-white rounded-lg shadow-sm'>
          <div className='flex justify-between items-center mb-4'>
            <div className='h-6 w-40 bg-gray-200 rounded-md animate-pulse'></div>
            <div className='h-6 w-24 bg-gray-200 rounded-md animate-pulse'></div>
          </div>

          <div className='flex justify-between items-end mb-8'>
            <div>
              <div className='h-4 w-48 bg-gray-200 rounded-md animate-pulse mb-2'></div>
              <div className='h-10 w-28 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
            <div className='h-6 w-12 bg-gray-200 rounded-md animate-pulse'></div>
            <div>
              <div className='h-4 w-48 bg-gray-200 rounded-md animate-pulse mb-2'></div>
              <div className='h-10 w-28 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex justify-between items-center'>
              <div className='h-5 w-20 bg-gray-200 rounded-md animate-pulse'></div>
              <div className='h-5 w-16 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
            <div className='flex justify-between items-center'>
              <div className='h-5 w-28 bg-gray-200 rounded-md animate-pulse'></div>
              <div className='h-5 w-20 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
          </div>
        </div>

        {/* Clicks Card */}
        <div className='p-6 bg-white rounded-lg shadow-sm'>
          <div className='flex justify-between items-center mb-4'>
            <div className='h-6 w-32 bg-gray-200 rounded-md animate-pulse'></div>
            <div className='h-6 w-24 bg-gray-200 rounded-md animate-pulse'></div>
          </div>

          <div className='flex justify-between items-end mb-8'>
            <div>
              <div className='h-4 w-48 bg-gray-200 rounded-md animate-pulse mb-2'></div>
              <div className='h-10 w-28 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
            <div className='h-6 w-12 bg-gray-200 rounded-md animate-pulse'></div>
            <div>
              <div className='h-4 w-48 bg-gray-200 rounded-md animate-pulse mb-2'></div>
              <div className='h-10 w-28 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex justify-between items-center'>
              <div className='h-5 w-20 bg-gray-200 rounded-md animate-pulse'></div>
              <div className='h-5 w-16 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
            <div className='flex justify-between items-center'>
              <div className='h-5 w-28 bg-gray-200 rounded-md animate-pulse'></div>
              <div className='h-5 w-20 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Impressions Chart */}
        <div className='p-6 bg-white rounded-lg shadow-sm'>
          <div className='h-6 w-48 bg-gray-200 rounded-md animate-pulse mb-4'></div>
          <div className='flex items-center justify-center'>
            <div className='h-64 w-full bg-gray-100 rounded-md animate-pulse flex items-center justify-center'>
              <div className='h-48 w-11/12 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
          </div>
        </div>

        {/* Clicks Chart */}
        <div className='p-6 bg-white rounded-lg shadow-sm'>
          <div className='h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-4'></div>
          <div className='flex items-center justify-center'>
            <div className='h-64 w-full bg-gray-100 rounded-md animate-pulse flex items-center justify-center'>
              <div className='h-48 w-11/12 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
