import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  MousePointer,
  ShoppingCart,
  ArrowDown,
  ChevronDown,
  DownloadIcon,
} from 'lucide-react';

const LiaMetrics = ({ setExportMatrix, matrices }) => {
  const { liaReportData, setSelectedAdsAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  function formatNumber(num) {
    return num.toLocaleString();
  }

  // Format currency with 2 decimal places
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  const formatCurrencyCPC = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calculate ROAS (Return on Ad Spend)
  const calculateROAS = (value, cost) => {
    return (value / cost).toFixed(2);
  };

  // Calculate conversion rate
  const calculateConversionRate = (conversions, clicks) => {
    return ((conversions / clicks) * 100).toFixed(2);
  };

  // Calculate store totals
  const calculateTotals = () => {
    if (!liaReportData || !liaReportData.data) return null;

    const totals = {
      clicks: 0,
      conversions: 0,
      cost: 0,
      conversions_value: 0,
    };
    console.log(liaReportData.data);
    liaReportData.data.forEach((store) => {
      totals.clicks += store.clicks;
      totals.conversions += store.conversions;
      totals.cost += store.cost;
      totals.conversions_value += store.conversions_value;
    });

    return totals;
  };
  let totals;

  if (matrices) {
    totals = { ...matrices };
  } else {
    totals = calculateTotals();
  }

  useEffect(() => {
    if (setExportMatrix) {
      setExportMatrix({
        Total_Clicks: formatNumber(totals.clicks),
        ROAS: formatNumber(
          Number(((totals.conversions_value / totals.cost) * 100).toFixed(2))
        ),
        Ad_Spend: formatCurrency(totals.cost),
        Revenue: formatCurrency(totals.conversions_value),
      });
    }
  }, []);

  const hasData =
    liaReportData && liaReportData.data && liaReportData.data.length > 0;
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <div className='bg-white rounded-lg shadow p-6 flex flex-col'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-gray-500 font-medium'>Total Clicks</h3>
          <MousePointer size={20} className='text-blue-500' />
        </div>
        <p className='text-3xl font-bold'>{formatNumber(totals.clicks)}</p>
      </div>

      <div className='bg-white rounded-lg shadow p-6 flex flex-col'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-gray-500 font-medium'>ROAS</h3>
          <ShoppingCart size={20} className='text-green-500' />
        </div>
        <p className='text-3xl font-bold'>
          {formatNumber(
            Number(((totals.conversions_value / totals.cost) * 100).toFixed(2))
          )}
          %
        </p>
        {/* <p className='text-sm text-gray-500'>
          {calculateConversionRate(totals.conversions, totals.clicks)}%
          Conversion Rate
        </p> */}
      </div>

      <div className='bg-white rounded-lg shadow p-6 flex flex-col'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-gray-500 font-medium'>Ad Spend</h3>
          <DollarSign size={20} className='text-red-500' />
        </div>
        <p className='text-3xl font-bold'>{formatCurrency(totals.cost)}</p>
        {/* <p className='text-sm text-gray-500'>
          {formatCurrencyCPC(totals.cost / totals.clicks)} CPC
        </p> */}
      </div>

      <div className='bg-white rounded-lg shadow p-6 flex flex-col'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-gray-500 font-medium'>Revenue</h3>
          <TrendingUp size={20} className='text-purple-500' />
        </div>
        <p className='text-3xl font-bold'>
          {formatCurrency(totals.conversions_value)}
        </p>
        {/* <p className='text-sm text-gray-500'>
          ROAS: {calculateROAS(totals.conversions_value, totals.cost)}x
        </p> */}
      </div>
    </div>
  );
};

export default LiaMetrics;
