import React, { useState } from 'react';
import GoBack from '../GoBack';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { StoreIcon } from 'lucide-react';
import LiaMetrics from './LiaMetrics';
import SelectedDate from './selectedDate';
import { mapableStore } from '@/utils/Mabable-store';
const LocalDashboard = () => {
  const { liaReportData, setLiaStoreData } = useAuth();
  const [expandedStore, setExpandedStore] = useState(null);

  // Function to toggle store expansion
  const toggleStore = (storeId) => {
    if (expandedStore === storeId) {
      setExpandedStore(null);
    } else {
      setExpandedStore(storeId);
    }
  };

  // Safely get the store data from formattedStoreQueryData
  const storeData = liaReportData?.formattedStoreQueryData || {};

  // Function to safely calculate metrics for each store
  const calculateStoreMetrics = (products) => {
    // Ensure products is always an array
    const productsArray = Array.isArray(products) ? products : [];

    return {
      clicks: productsArray.reduce(
        (sum, product) => sum + (product?.clicks || 0),
        0
      ),
      impressions: productsArray.reduce(
        (sum, product) => sum + (product?.impressions || 0),
        0
      ),
      conversions: productsArray.reduce(
        (sum, product) => sum + (product?.conversions || 0),
        0
      ),
      cost: productsArray.reduce(
        (sum, product) => sum + (product?.cost || 0),
        0
      ),
      conversions_value: productsArray.reduce(
        (sum, product) => sum + (product?.conversions_value || 0),
        0
      ),
    };
  };

  // Function to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  const formatNumber = (num: number) => num.toLocaleString();

  const matrixData = liaReportData?.formattedStoreQueryData
    .filter((item) => item.store_id) // only include entries with a store_id
    .reduce(
      (acc, item) => {
        acc.clicks += item.clicks;
        acc.impressions += item.impressions;
        acc.conversions_value += item.conversions_value;
        acc.cost += item.cost;
        return acc;
      },
      {
        clicks: 0,
        impressions: 0,
        conversions_value: 0,
        cost: 0,
      }
    );

  const mapabl = (id) => {
    const filterData = mapableStore.filter((i) => {
      if (i.id == id.split('/')[1]) {
        return i;
      }
    });

    return filterData[0];
  };

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <GoBack />
        <SelectedDate />
      </div>
      <div className=''>
        <br />
        <h1 className='text-2xl font-bold mb-6'>Local Performance</h1>
        {/* so the materic would be for local only same for the online one  */}

        <LiaMetrics matrices={matrixData} />
      </div>
      <br />
      {Object.keys(storeData).length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          No store data available
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Store
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Impressions
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Clicks
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  CTR
                </th>

                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Conversions
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Cost
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  ROAS
                </th>

                <th
                  scope='col'
                  className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {liaReportData.formattedStoreQueryData
                .filter((store) => store?.store_id)
                .map((channel) => {
                  return (
                    <tr className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <span className='px-2.5 py-0.5 rounded-full text-sm font-medium hover:underline  text-blue-800 flex items-center gap-1'>
                            <StoreIcon />
                            <a
                              target='_blank'
                              href={`https://www.google.com/search?q=${
                                mapabl(channel?.store_id)?.name ||
                                channel?.store_id
                              }`}
                            >
                              <>
                                <p>
                                  {' '}
                                  {mapabl(channel?.store_id)?.name ||
                                    channel?.store_id}
                                </p>
                                <p className='text-gray-500 text-xs'>
                                  {mapabl(channel?.store_id)?.address ||
                                    channel?.store_id}
                                </p>
                              </>
                            </a>
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                        {formatNumber(channel.impressions)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                        {formatNumber(channel.clicks)}
                      </td>

                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                        {channel.impressions > 0
                          ? (
                              (channel.clicks / channel.impressions) *
                              100
                            ).toFixed(2)
                          : '0.00'}
                        %
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                        {formatNumber(channel.conversions)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                        {formatCurrency(channel.cost)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                        {formatNumber(
                          (channel.conversions_value / channel.cost).toFixed(
                            2
                          ) * 100
                        )}
                        %
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                        <button className='text-[#0077e0] hover:text-[#0077e0] cursor-pointer whitespace-nowrap !rounded-button'>
                          <Link
                            onClick={() => setLiaStoreData([])}
                            to={`/LOCAL/${btoa(channel.store_id)}`}
                          >
                            <span className='flex items-center gap-1'>
                              View Details
                            </span>
                          </Link>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LocalDashboard;
