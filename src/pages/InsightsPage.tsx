import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TabNavigation from '../components/insights/TabNavigation';
import InsightsTable, {
  ChangeCell,
  PercentageCell,
} from '../components/insights/InsightsTable';
import { TabsContent } from '../components/ui/Tabs';
import ComparisonPeriod from '../components/ComparisonPeriod';
import { TabRoute } from '../types';
import {
  productInsights,
  brandInsights,
  productType1Insights,
  productType2Insights,
  gmcInsights,
} from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { aggregateData, calculateChanges } from '../utils/insight';
import PerformanceDashboardSkeleton from '../components/dashboard/PerformanceDashboardSkeleton';
import TableLoadingSkeleton from '../components/insights/TableLoadingSkeleton';
import AdvancedColumnSelector from '../components/insights/AdvancedColumnSelector';
import AdvanceFilter from '../components/insights/AdvanceFilter';
import { Cross } from 'lucide-react';

const tabRoutes: TabRoute[] = [
  { id: 'product', label: 'Insights by Product', path: '/insights/product' },
  { id: 'brand', label: 'Insights by Brand', path: '/insights/brand' },
  { id: 'type1', label: 'Insights by Product Type 1', path: '/insights/type1' },
  { id: 'type2', label: 'Insights by Product Type 2', path: '/insights/type2' },
  { id: 'type3', label: 'Insights by Product Type 3', path: '/insights/type2' },
  { id: 'type4', label: 'Insights by Product Type 4', path: '/insights/type2' },
  { id: 'type5', label: 'Insights by Product Type 5', path: '/insights/type2' },
  {
    id: 'categoryL1',
    label: 'Insights by Google Category Type 1',
    path: '/insights/type2',
  },
  {
    id: 'categoryL2',
    label: 'Insights by Google Category Type 2',
    path: '/insights/type2',
  },
  {
    id: 'categoryL3',
    label: 'Insights by Google Category Type 3',
    path: '/insights/type2',
  },
  {
    id: 'categoryL4',
    label: 'Insights by Google Category Type 4',
    path: '/insights/type2',
  },
  {
    id: 'categoryL5',
    label: 'Insights by Google Category Type 5',
    path: '/insights/type2',
  },
];

const InsightsPage: React.FC = () => {
  const [insighttype, setInsightType] = React.useState('product');
  const { insightType = 'product' } = useParams<{ insightType: string }>();
  const { reportData, merchantSelect, setExportData, exportData } = useAuth();
  const [appliedFilters, setAppliedFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [productTableHeaders, setProductTableHeaders] = useState([
    { header: 'Item ID', accessorKey: 'offerId' },
    { header: 'Title', accessorKey: 'title' },

    {
      header: 'Current Period Clicks',
      accessorKey: 'currentClicks',
    },
    {
      header: 'Previous Period Clicks',
      accessorKey: 'previousClicks',
    },
    { header: 'Clicks Change (%)', accessorKey: 'clickChangePercent' },
    { header: 'Clicks Change (Number)', accessorKey: 'clickChangeNumber' },
    {
      header: 'Current Period Impressions',
      accessorKey: 'currentImpressions',
    },
    {
      header: 'Previous Period Impressions',
      accessorKey: 'previousImpressions',
    },

    {
      header: 'Impressions Change (%)',
      accessorKey: 'impressionChangePercent',
    },
    {
      header: 'Impressions Change (Number)',
      accessorKey: 'impressionChangeNumber',
    },
  ]);
  const sortDataBasedOnClickChanges = (data) => {
    return data.sort((a, b) => b.clickChangeNumber - a.clickChangeNumber);
  };

  useEffect(() => {
    setInsightType(insightType);
  }, [insightType]);

  useEffect(() => {
    const newExportData: typeof exportData = {};

    // PRODUCT
    newExportData['product'] = {
      headers: productTableHeaders.map((col) => col.header),
      data: sortDataBasedOnClickChanges(mergedData),
    };

    // BRAND
    newExportData['brand'] = {
      headers: brandColumns.map((col) => col.header),
      data: sortDataBasedOnClickChanges(mergedBrandData),
    };

    // PRODUCT TYPES
    Array.from({ length: 5 }).forEach((_, i) => {
      const key = `type${i + 1}`;
      const type = `L${i + 1}`;
      newExportData[key] = {
        headers: productTypeColumns(type).map((col) => col.header),
        data: sortDataBasedOnClickChanges(
          getSegmentDataByType(`productTypeL${i + 1}`)
        ),
      };
    });

    // GOOGLE CATEGORIES
    Array.from({ length: 5 }).forEach((_, i) => {
      const key = `categoryL${i + 1}`;
      const type = `L${i + 1}`;
      newExportData[key] = {
        headers: googlecategory(type).map((col) => col.header),
        data: sortDataBasedOnClickChanges(
          getSegmentDataByType(`categoryL${i + 1}`)
        ),
      };
    });

    setExportData(newExportData);
  }, [reportData]);

  const previousData = reportData?.previous?.data || [];
  const currentData = reportData?.current?.data || [];

  const aggregatedCurrentMap = aggregateData(currentData, 'offerId');
  const aggregatedPreviousMap = aggregateData(previousData, 'offerId');

  const aggregatedCurrentData = Object.values(aggregatedCurrentMap);
  const aggregatedPreviousData = Object.values(aggregatedPreviousMap);

  const mergedData = calculateChanges(
    aggregatedCurrentData,
    aggregatedPreviousData,
    'offerId'
  );

  useEffect(() => {
    setFilteredData(mergedData);
  }, [reportData]);

  const previousBrandData = reportData?.previous?.brand || [];
  const currentBrandData = reportData?.current?.brand || [];

  const aggregatedBrandCurrentMap = aggregateData(currentBrandData, 'brand');
  const aggregatedBrandPreviousMap = aggregateData(previousBrandData, 'brand');

  const aggregatedBrandCurrentData = Object.values(aggregatedBrandCurrentMap);
  const aggregatedBrandPreviousData = Object.values(aggregatedBrandPreviousMap);

  const mergedBrandData = calculateChanges(
    aggregatedBrandCurrentData,
    aggregatedBrandPreviousData,
    'brand'
  );

  const getSegmentDataByType = (type) => {
    const previousData = reportData?.previous?.[type] || [];
    const currentData = reportData?.current?.[type] || [];

    const aggregatedCurrentMap = aggregateData(currentData, type);
    const aggregatedPreviousMap = aggregateData(previousData, type);

    const aggregatedCurrentData = Object.values(aggregatedCurrentMap);
    const aggregatedPreviousData = Object.values(aggregatedPreviousMap);

    const mergedData = calculateChanges(
      aggregatedCurrentData,
      aggregatedPreviousData,
      type
    );

    return mergedData;
  };

  const productTableHeaer = (column) => {
    setProductTableHeaders(column);
  };

  const brandColumns = [
    { header: 'Brand', accessorKey: 'brand' },
    {
      header: 'Current Period Clicks',
      accessorKey: 'currentClicks',
    },
    {
      header: 'Previous Period Clicks',
      accessorKey: 'previousClicks',
    },
    { header: 'Clicks Change (%)', accessorKey: 'clickChangePercent' },
    { header: 'Clicks Change (Number)', accessorKey: 'clickChangeNumber' },
    {
      header: 'Current Period Impressions',
      accessorKey: 'currentImpressions',
    },
    {
      header: 'Previous Period Impressions',
      accessorKey: 'previousImpressions',
    },
    {
      header: 'Impressions Change (%)',
      accessorKey: 'impressionChangePercent',
    },
    {
      header: 'Impressions Change (Number)',
      accessorKey: 'impressionChangeNumber',
    },
  ];

  const productTypeColumns = (type) => {
    return [
      {
        header: `Product Type Level ${type?.split('')[1]}`,
        accessorKey: `productType${type}`,
      },
      {
        header: 'Current Period Clicks',
        accessorKey: 'currentClicks',
      },
      {
        header: 'Previous Period Clicks',
        accessorKey: 'previousClicks',
      },
      { header: 'Clicks Change (%)', accessorKey: 'clickChangePercent' },
      { header: 'Clicks Change (Number)', accessorKey: 'clickChangeNumber' },
      {
        header: 'Current Period Impressions',
        accessorKey: 'currentImpressions',
      },
      {
        header: 'Previous Period Impressions',
        accessorKey: 'previousImpressions',
      },
      {
        header: 'Impressions Change (%)',
        accessorKey: 'impressionChangePercent',
      },
      {
        header: 'Impressions Change (Number)',
        accessorKey: 'impressionChangeNumber',
      },
    ];
  };
  const googlecategory = (type) => {
    return [
      {
        header: `Google category Level ${type?.split('')[1]}`,
        accessorKey: `category${type}`,
      },
      {
        header: 'Current Period Clicks',
        accessorKey: 'currentClicks',
      },
      {
        header: 'Previous Period Clicks',
        accessorKey: 'previousClicks',
      },
      { header: 'Clicks Change (%)', accessorKey: 'clickChangePercent' },
      { header: 'Clicks Change (Number)', accessorKey: 'clickChangeNumber' },
      {
        header: 'Current Period Impressions',
        accessorKey: 'currentImpressions',
      },
      {
        header: 'Previous Period Impressions',
        accessorKey: 'previousImpressions',
      },
      {
        header: 'Impressions Change (%)',
        accessorKey: 'impressionChangePercent',
      },

      {
        header: 'Impressions Change (Number)',
        accessorKey: 'impressionChangeNumber',
      },
    ];
  };

  const filterValue = (value) => {
    setAppliedFilters(value);
    const filteredData = mergedData.filter((item) => {
      const itemValue = item[value.selectedAttribute];

      if (itemValue.toLowerCase() === value.searchValue.toLowerCase()) {
        return item;
      }
    });

    setFilteredData(filteredData);
  };

  const sortedFilteredData = sortDataBasedOnClickChanges(filteredData);

  return (
    <div className='space-y-6 animate-fade-in'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 mb-3'>
          Compares performance of items in stock during the same period.
        </h1>
        <ComparisonPeriod />
      </div>
      {!reportData ? (
        <TableLoadingSkeleton />
      ) : (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          <TabNavigation
            routes={tabRoutes}
            defaultRoute={insighttype}
            key={insighttype}
          >
            <TabsContent value='product' className='p-4'>
              <div className='flex justify-between items-center mb-4'>
                <div className='flex items-center space-x-2'>
                  <AdvanceFilter filterValue={filterValue} />
                  {appliedFilters?.searchValue && (
                    <>
                      <div className='flex items-center space-x-2 '>
                        <span className='text-sm   space-x-2 bg-slate-100 px-2 py-2 rounded-md'>
                          Filtered by{' '}
                          {appliedFilters?.selectedAttribute == 'offerId'
                            ? 'Product ID'
                            : appliedFilters?.selectedAttribute}{' '}
                          Equals to {appliedFilters?.searchValue}
                          <button
                            onClick={() => {
                              setAppliedFilters({});
                              setFilteredData(mergedData);
                            }}
                            className='text-sm hover:underline ml-2'
                          >
                            X
                          </button>
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <AdvancedColumnSelector productTableHeaer={productTableHeaer} />
              </div>
              {filteredData && filteredData.length === 0 ? (
                <div className='d-flex justify-content-center align-items-center text-gray-500'>
                  <img
                    className='m-auto w-[300px] h-[300px]'
                    src='/7486744.png'
                    alt='Centered Image'
                  />
                  <h4 className='text-3xl font-bold text-gray-500 text-center'>
                    No Product Found
                  </h4>
                </div>
              ) : (
                <InsightsTable
                  data={sortDataBasedOnClickChanges(filteredData)}
                  columns={productTableHeaders}
                />
              )}
            </TabsContent>

            <TabsContent value='brand' className='p-4'>
              <InsightsTable
                data={sortDataBasedOnClickChanges(mergedBrandData)}
                columns={brandColumns}
              />
            </TabsContent>
            {Array.from({ length: 5 }).map((_, i) => {
              return (
                <TabsContent value={`type${i + 1}`} className='p-4'>
                  <InsightsTable
                    data={sortDataBasedOnClickChanges(
                      getSegmentDataByType(`productTypeL${i + 1}`)
                    )}
                    columns={productTypeColumns(`L${i + 1}`)}
                  />
                </TabsContent>
              );
            })}
            {Array.from({ length: 5 }).map((_, i) => {
              return (
                <TabsContent value={`categoryL${i + 1}`} className='p-4'>
                  <InsightsTable
                    data={sortDataBasedOnClickChanges(
                      getSegmentDataByType(`categoryL${i + 1}`)
                    )}
                    columns={googlecategory(`L${i + 1}`)}
                  />
                </TabsContent>
              );
            })}
          </TabNavigation>
        </div>
      )}
    </div>
  );
};

export default InsightsPage;
