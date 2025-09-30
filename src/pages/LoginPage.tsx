import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLogin from '../components/auth/GoogleLogin';
import { BarChart2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to='/playbook' replace />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex flex-col items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-xl p-8 w-full max-w-md'>
        <div className='flex justify-center mb-6'>
          <div className='h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center'>
            <BarChart2 size={24} className='text-primary-600' />
          </div>
        </div>

        <GoogleLogin />
      </div>

      <div className='mt-8 text-center text-white text-sm opacity-80'>
        <p>InsightsDash.</p>
      </div>
    </div>
  );
};

export default LoginPage;
