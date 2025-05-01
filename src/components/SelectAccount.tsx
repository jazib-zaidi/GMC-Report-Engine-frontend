import React, { useEffect } from 'react';
import Select from './ui/Select';
import { useAuth } from '../context/AuthContext';
import { Loader, Loader2Icon } from 'lucide-react';
import Loading from './loader';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SelectAccount = () => {
  const {
    user,
    logout,
    merchantAccounts,
    setMerchantSelect,
    setReportData,
    merchantSelect,
    fetchGoogleProductCategory,
    setSelectedDateRange,
    setFilter,
  } = useAuth();

  return merchantAccounts && merchantAccounts.length > 0 ? (
    <>
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
            setFilter({});
            let date = {
              endDate: new Date(),
              startDate: new Date(
                new Date().setDate(new Date().getDate() - 30)
              ),
            };

            const formattedCurrentStart = format(date.startDate, 'yyyy-MM-dd');
            const formattedCurrentEnd = format(date.endDate, 'yyyy-MM-dd');

            let selectedRange = {
              startDate: formattedCurrentStart,
              endDate: formattedCurrentEnd,
            };

            setSelectedDateRange(selectedRange);

            toast.promise(
              fetchGoogleProductCategory(selectedMerchant.merchantId),
              {
                loading: (
                  <b> Fetching Google Product Category, please wait...</b>
                ),
                success: <b>Google Product Category successfully loaded!</b>,
                error: (
                  <b>
                    Failed to load Google Product Category. Please try
                    refreshing the page. or Login again
                  </b>
                ),
              }
            );
            localStorage.setItem('previousType', 'year');
            setReportData(null);
          }
        }}
      >
        {merchantSelect?.id ? (
          <option>{merchantSelect?.name}</option>
        ) : (
          <option>Select Account</option>
        )}
        <option>Select Account</option>
        {merchantAccounts.map((item) => (
          <option key={item.merchantId} value={item.merchantId}>
            {item.name}
          </option>
        ))}
      </Select>
    </>
  ) : (
    <div className='flex items-center gap-x-2'>
      <Select disabled>
        <option>Fetching merchant account...</option>
      </Select>
      <Loading />
    </div>
  );
};

export default SelectAccount;
