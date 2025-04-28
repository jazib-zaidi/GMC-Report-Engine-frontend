import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
const Layout: React.FC = () => {
  const { user, merchantSelect, logout, setToken } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams] = useSearchParams();
  const Oauth = searchParams.get('Oauth');

  if (Oauth == 'false') {
    logout();
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  console.log('Token:', token);

  if (token) {
    localStorage.setItem('authToken', token);
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return (
    <div className='flex h-screen bg-[#f3f6f9]'>
      <Toaster position='top-center' reverseOrder={false} />
      {merchantSelect && (
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      <div className='flex w-full flex-col flex-1 w-0 overflow-hidden'>
        <Header sidebarOpen={merchantSelect} toggleSidebar={toggleSidebar} />

        <main className='flex-1 overflow-y-auto p-4 md:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
