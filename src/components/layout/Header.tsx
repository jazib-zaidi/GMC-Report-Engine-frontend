import React, { useEffect, useState } from 'react';
import { Menu, LogOut, User as UserIcon, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Select from '../ui/Select';
import SelectAccount from '../SelectAccount';
import { is } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface HeaderProps {
  toggleSidebar: () => void;
}
type MerchantSelect = {
  id: string;
  name: string;
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const {
    user,
    logout,
    merchantAccounts,
    fetchMerchantAccounts,
    fetchReports,
    setReportData,
    setMerchantSelect,
    selectedDateRange,
    merchantSelect,
    filter,
  } = useAuth();

  useEffect(() => {
    fetchMerchantAccounts();
  }, []);

  useEffect(() => {
    if (merchantSelect?.id && selectedDateRange) {
      toast.promise(
        fetchReports(merchantSelect.id, selectedDateRange, filter),
        {
          loading: <b> Fetching reports, please wait...</b>,
          success: <b>Reports successfully loaded!</b>,
          error: <b>Failed to load reports. Please try refreshing the page.</b>,
        }
      );
    }
  }, [merchantSelect, selectedDateRange, filter]);

  return (
    <header className='sticky top-0 z-[8] bg-white border-b border-gray-200 shadow-sm'>
      <div className='flex items-center justify-between h-16 px-4 md:px-6'>
        <div className='flex items-center gap-3'>
          {!sidebarOpen && (
            <div className='text-xl font-bold text-primary-700'>
              InsightsDash
            </div>
          )}
        </div>
        <div className='flex items-center gap-3'>
          {/* {merchantAccounts && merchantAccounts.length > 0 && (
            <Select
              onChange={(e) => {
                const selectedMerchant = merchantAccounts.find(
                  (item) => item.merchantId === e.target.value
                );
                if (selectedMerchant) {
                  setMerchantSelect({
                    id: selectedMerchant.merchantId,
                    name: selectedMerchant.name,
                  });
                }
              }}
            >
              {merchantAccounts.map((item) => (
                <option key={item.merchantId} value={item.merchantId}>
                  {item.name}
                </option>
              ))}
            </Select>
          )} */}
          {merchantSelect?.id && <SelectAccount />}

          <div className='flex items-center gap-2'>
            {user && (
              <div className='flex items-center gap-2 w-32'>
                <button
                  className='group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  onClick={logout}
                >
                  <LogOut
                    size={16}
                    className='mr-3 text-gray-400 group-hover:text-gray-500'
                  />
                  Sign out
                </button>
              </div>
            )}

            {!user && (
              <Button
                variant='outline'
                size='sm'
                leftIcon={<UserIcon size={16} />}
                onClick={() => {}}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
