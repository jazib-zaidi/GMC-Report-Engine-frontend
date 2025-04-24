import React from 'react';
import { UserCircle, ArrowUp, Search, Sparkles } from 'lucide-react';
import SelectAccount from '../SelectAccount';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const WelcomeDashboard = () => {
  const { fetchMerchantAccounts } = useAuth();

  const fetchAcount = async () => {
    const g = await axios.get(
      'https://gmc-report-engine-backend-production.up.railway.app/test'
    );
    console.log(g);
    fetchMerchantAccounts();
  };

  return (
    <div className='flex items-center justify-center '>
      {/* Glass morphism card */}
      <div className='max-w-xl w-full backdrop-blur-lg bg-white/70 rounded-2xl shadow-lg border border-white/20 overflow-hidden'>
        <div className='p-8 md:p-10'>
          {/* Abstract shapes for visual interest */}
          <div className='absolute top-10 right-10 w-20 h-20 bg-blue-400 rounded-full blur-3xl opacity-20'></div>
          <div className='absolute bottom-10 left-10 w-24 h-24 bg-purple-400 rounded-full blur-3xl opacity-20'></div>

          <div className='flex items-center justify-center'>
            <img
              src='https://www.gstatic.com/merchants/reporting/empty_screen_no_local_stores.svg'
              alt=''
            />
          </div>

          {/* Modern typography */}
          <div className='text-center space-y-5 relative z-10'>
            <h2 className='text-3xl '>Select Your Account</h2>

            <p className='text-gray-600 max-w-md mx-auto leading-relaxed'>
              To access your personalized analytics dashboard and performance
              metrics, choose an account from the dropdown.
            </p>

            {/* Interactive pointer with animation */}
            <div className='mt-8 group cursor-pointer'>
              <SelectAccount />
            </div>
            <div className='flex justify-center mt-4'>
              <button
                onClick={fetchAcount}
                className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200'
              >
                Fetch Account
              </button>
            </div>
          </div>
        </div>

        {/* Modern footer */}
        <div className='bg-gradient-to-r from-slate-100 to-gray-100 p-4'>
          <div className='flex justify-between items-center text-sm text-gray-500'>
            <span className='hover:text-indigo-600 transition-colors duration-300 cursor-pointer'></span>
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
