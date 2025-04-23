import React, { useEffect } from 'react';
import Select from './ui/Select';
import { useAuth } from '../context/AuthContext';
import { Loader, Loader2Icon } from 'lucide-react';
import Loading from './loader';

const SelectAccount = () => {
  const {
    user,
    logout,
    merchantAccounts,

    setMerchantSelect,
    setReportData,
    merchantSelect,
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
