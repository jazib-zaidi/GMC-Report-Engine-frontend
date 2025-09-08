import React, { useState } from 'react';
import { Loader, LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';

const GoogleLogin: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <div className='w-full max-w-md animate-fade-in'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Welcome</h1>
        <p className='text-gray-600'>
          Sign in with your Google account to view your insights
        </p>
      </div>

      <Button
        onClick={() => {
          login();
          setLoading(true);
        }}
        leftIcon={
          loading ? (
            <Loader className='animate-spin' />
          ) : (
            <img
              className='w-6'
              src='https://img.icons8.com/win10/200/FFFFFF/google-logo.png'
              alt=''
            />
          )
        }
        className='w-full py-2.5'
      >
        {loading ? 'Signing in with Google...' : 'Sign in with Google'}
      </Button>

      {error && (
        <div className='mt-4 p-3 bg-error-50 text-error-700 rounded-md text-sm'>
          {error}
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;
