import React, { useState } from 'react';
import SelectAccount from '../SelectAccount';
import { BarChart, LineChart } from 'lucide-react';
import SelectAdsAccount from '../SelectAdsAccount';

const WelcomeDashboard = () => {
  const [reportType, setReportType] = useState(null);
  return (
    <div className='flex items-center justify-center relative'>
      <div className='max-w-xl w-full backdrop-blur-lg bg-white/70 rounded-2xl shadow-lg border border-white/20 relative'>
        <div className='absolute top-10 right-10 w-20 h-20 bg-blue-400 rounded-full blur-3xl opacity-20'></div>
        <div className='absolute bottom-10 left-10 w-24 h-24 bg-purple-400 rounded-full blur-3xl opacity-20'></div>

        <div className='p-8 md:p-10 relative z-10'>
          {!reportType && (
            <div className='text-center space-y-6'>
              <div className='flex items-center justify-center'>
                <img
                  src='https://www.gstatic.com/adwords-frontend/conversions/client/view/diagnostics_home/figure_with_magnifying_glass.svg'
                  alt=''
                />
              </div>
              <h2 className='text-3xl font-semibold'>Choose Report Type</h2>
              <p className='text-gray-600 max-w-md mx-auto leading-relaxed'>
                Please select the report type you want to create.
              </p>
              <div className='flex justify-center space-x-6 mt-6'>
                <button
                  onClick={() => setReportType('lia')}
                  className='inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-smflex items-center gap-2 bg-[#33a852] hover:bg-[#33a852] text-white transition-colors cursor-pointer'
                >
                  <LineChart className='h-6 w-6 text-white mr-3' />
                  Performance Report
                </button>
                <button
                  onClick={() => setReportType('cohort')}
                  className='inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-smflex items-center gap-2 bg-[#33a852] hover:bg-[#33a852] text-white transition-colors cursor-pointer'
                >
                  <BarChart className='h-6 w-6 text-white mr-3' />
                  Cohort Analysis
                </button>
              </div>
            </div>
          )}

          {/* Show Cohort Analysis selection card */}
          {reportType === 'cohort' && (
            <div className='text-center space-y-5'>
              <div className='flex items-center justify-center'>
                <img
                  src='https://www.gstatic.com/merchants/reporting/empty_screen_no_local_stores.svg'
                  alt=''
                />
              </div>

              <h2 className='text-3xl'>
                Select Your Account for Cohort Analysis
              </h2>
              <p className='text-gray-600 max-w-md mx-auto leading-relaxed'>
                To access your personalized analytics dashboard and performance
                metrics, choose an account from the dropdown.
              </p>
              <div className='mt-8'>
                <SelectAccount />
              </div>
              <button
                onClick={() => setReportType(null)}
                className='mt-6 text-sm text-gray-500 underline hover:text-gray-700'
              >
                Back to report selection
              </button>
            </div>
          )}

          {/* Show LIA report selection card */}
          {reportType === 'lia' && (
            <div className='text-center space-y-5'>
              <div className='flex items-center justify-center'>
                <img src='https://storage.googleapis.com/support-kms-prod/Zyow1GcalU8irghSmVf6inhAehOqp4ypj0NM' />
              </div>
              <h2 className='text-3xl'>Select Your Ads Account</h2>
              <p className='text-gray-600 max-w-md mx-auto leading-relaxed'>
                Choose your Ads Account from the options below.
              </p>
              {/* Replace below div with your actual LIA report selector component or UI */}
              <div className='mt-8 p-4 border rounded-lg bg-white shadow'>
                {/* Placeholder for LIA report selection UI */}

                <SelectAdsAccount />
              </div>
              <button
                onClick={() => setReportType(null)}
                className='mt-6 text-sm text-gray-500 underline hover:text-gray-700'
              >
                Back to report selection
              </button>
            </div>
          )}
        </div>

        {/* Modern footer */}
        <div className='bg-gradient-to-r from-slate-100 to-gray-100 p-4'>
          <div className='flex justify-between items-center text-sm text-gray-500'>
            <span></span>
            <div className='flex items-center space-x-1'>
              <span className='h-2 w-2 rounded-full bg-green-400'></span>
              <span>v1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
