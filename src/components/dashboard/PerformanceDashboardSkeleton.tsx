import React from 'react';
import { Loader } from 'lucide-react';

export default function PerformanceDashboardSkeleton() {
  const LoadingMessage = () => (
    <div className='flex items-center space-x-2 mt-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex-col'>
      <img className='w-20' src='/spinner.svg' alt='' />
      <br />
      <h6 className='font-medium text-gray-900 text-center'>
        We are crunching a lot of data. Please wait.
      </h6>
    </div>
  );

  return (
    <div className='p-6  min-h-screen'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='p-6 bg-white rounded-lg shadow-sm relative'>
          <div className='h-6 w-48 bg-gray-200 rounded-md animate-pulse mb-4'></div>
          <div className='flex items-center justify-center'>
            <div className='h-64 w-full bg-gray-100 rounded-md animate-pulse flex items-center justify-center'>
              <div className='h-48 w-11/12 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
          </div>
          <LoadingMessage />
        </div>

        <div className='p-6 bg-white rounded-lg shadow-sm relative'>
          <div className='h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-4'></div>
          <div className='flex items-center justify-center'>
            <div className='h-64 w-full bg-gray-100 rounded-md animate-pulse flex items-center justify-center'>
              <div className='h-48 w-11/12 bg-gray-200 rounded-md animate-pulse'></div>
            </div>
          </div>
          <LoadingMessage />
        </div>
      </div>
      <br />
      {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-6'> */}
      <div className='p-6 bg-white rounded-lg shadow-sm relative'>
        <div className='h-6 w-48 bg-gray-200 rounded-md animate-pulse mb-4'></div>
        <div className='flex items-center justify-center'>
          <div className='h-64 w-full bg-gray-100 rounded-md animate-pulse flex items-center justify-center'>
            <div className='h-48 w-11/12 bg-gray-200 rounded-md animate-pulse'></div>
          </div>
        </div>
        <LoadingMessage />
      </div>
      {/* </div> */}
    </div>
  );
}
