import React from 'react';
import { LogIn } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const GoogleLogin: React.FC = () => {
  const { login, isLoading, error } = useAuth();

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h1>
        <p className="text-gray-600">
          Sign in with your Google account to view your insights
        </p>
      </div>

      <Button
        onClick={login}
        isLoading={isLoading}
        leftIcon={<LogIn size={18} />}
        className="w-full py-2.5"
      >
        Sign in with Google
      </Button>

      {error && (
        <div className="mt-4 p-3 bg-error-50 text-error-700 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;