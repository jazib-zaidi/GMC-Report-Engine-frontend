import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const SelectAdsAccount = () => {
  const {
    fetchAdsAccounts,
    adsAccounts,
    fetchLiaReports,
    setSelectedAdsAccount,
    formattedDateRange,
    setLiaReportData,
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (adsAccounts?.length == 0) {
      setLoading(true);
      fetchAdsAccounts().finally(() => setLoading(false));
    }
  }, []);

  // Hide dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {}, [selectedAccount]);

  const filteredAccounts = adsAccounts?.filter(
    (account) =>
      account?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      account?.customer_id?.includes(searchTerm)
  );

  return (
    <div className='max-w-md mx-auto relative flex' ref={containerRef}>
      <input
        type='text'
        placeholder={`${
          loading
            ? 'Fetching ads accounts...'
            : 'Search ads account by name or ID..'
        }`}
        className='w-full p-2 border border-gray-300 rounded mb-2'
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setSelectedAccount(null);
        }}
        onFocus={() => setShowDropdown(true)}
        disabled={loading}
      />

      {loading && (
        <div className='flex justify-center p-4'>
          <Loader className='animate-spin' />
        </div>
      )}

      {!loading && showDropdown && (
        <ul className='absolute w-full bg-white max-h-60 overflow-auto border border-gray-300 rounded shadow z-10 mt-12'>
          {filteredAccounts?.length > 0 ? (
            filteredAccounts.map((account) => (
              <li
                key={account.customer_id}
                className={`p-2 cursor-pointer hover:bg-gray-100 flex pl-6 ${
                  selectedAccount?.customer_id === account.customer_id
                    ? 'bg-blue-100'
                    : ''
                }`}
                onClick={() => {
                  setSelectedAccount(account);
                  setSearchTerm(account.name);
                  setShowDropdown(false);
                  setSelectedAdsAccount(account);
                  fetchLiaReports(
                    account.customer_id,
                    formattedDateRange,
                    'ALL'
                  );
                  setLiaReportData(null);
                }}
              >
                <strong>{account.name}</strong> (ID: {account.customer_id})
              </li>
            ))
          ) : (
            <li className='p-2 text-gray-500'>No accounts found.</li>
          )}
        </ul>
      )}

      {selectedAccount && (
        <div className='mt-4 p-3 border border-blue-400 rounded bg-blue-50'>
          <h4 className='font-semibold'>Selected Account:</h4>
          <p>Name: {selectedAccount.name}</p>
          <p>Customer ID: {selectedAccount.customer_id}</p>
        </div>
      )}
    </div>
  );
};

export default SelectAdsAccount;
