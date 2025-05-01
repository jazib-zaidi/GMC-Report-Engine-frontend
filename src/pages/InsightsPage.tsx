import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TabNavigation from '../components/insights/TabNavigation';
import InsightsTable, {
  ChangeCell,
  PercentageCell,
} from '../components/insights/InsightsTable';
import { TabsContent } from '../components/ui/Tabs';
// import ComparisonPeriod from '../components/ComparisonPeriod';
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
  const { reportData, setExportData, exportData } = useAuth();
  useEffect(() => {
    setInsightType(insightType);
  }, [insightType]);
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

    { header: 'Clicks Change (%)', accessorKey: 'clicksChangePct' },
    { header: 'Clicks Change (Number)', accessorKey: 'clicksChangeNumber' },
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
      accessorKey: 'impressionsChangePct',
    },
    {
      header: 'Impressions Change (Number)',
      accessorKey: 'impressionsChangeNumber',
    },
  ]);

  const sortDataBasedOnClickChanges = (data) => {
    return data.sort((a, b) => b.clickChangeNumber - a.clickChangeNumber);
  };

  const brandColumns = [
    { header: 'Brand', accessorKey: 'segment' },
    {
      header: 'Current Period Clicks',
      accessorKey: 'currentClicks',
    },
    {
      header: 'Previous Period Clicks',
      accessorKey: 'previousClicks',
    },
    { header: 'Clicks Change (%)', accessorKey: 'clicksChangePct' },
    { header: 'Clicks Change (Number)', accessorKey: 'clicksChangeNumber' },
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
      accessorKey: 'impressionsChangePct',
    },
    {
      header: 'Impressions Change (Number)',
      accessorKey: 'impressionsChangeNumber',
    },
  ];

  const productTypeColumns = (type) => {
    return [
      {
        header: `Product Type Level ${type?.split('')[1]}`,
        accessorKey: `segment`,
      },
      {
        header: 'Current Period Clicks',
        accessorKey: 'currentClicks',
      },
      {
        header: 'Previous Period Clicks',
        accessorKey: 'previousClicks',
      },
      { header: 'Clicks Change (%)', accessorKey: 'clicksChangePct' },
      { header: 'Clicks Change (Number)', accessorKey: 'clicksChangeNumber' },
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
        accessorKey: 'impressionsChangePct',
      },
      {
        header: 'Impressions Change (Number)',
        accessorKey: 'impressionsChangeNumber',
      },
    ];
  };
  const googlecategory = (type) => {
    return [
      {
        header: `Google category Level ${type?.split('')[1]}`,
        accessorKey: `segment`,
      },
      {
        header: 'Current Period Clicks',
        accessorKey: 'currentClicks',
      },
      {
        header: 'Previous Period Clicks',
        accessorKey: 'previousClicks',
      },
      { header: 'Clicks Change (%)', accessorKey: 'clicksChangePct' },
      { header: 'Clicks Change (Number)', accessorKey: 'clicksChangeNumber' },
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
        accessorKey: 'impressionsChangePct',
      },

      {
        header: 'Impressions Change (Number)',
        accessorKey: 'impressionsChangeNumber',
      },
    ];
  };

  const getSegmentDataByType = (attribute) => {
    return reportData.allProductDataWithImpressions[attribute];
  };

  return (
    <div className='space-y-6 animate-fade-in'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 mb-3'>
          Compares performance of items in stock during the same period.
        </h1>
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
              <InsightsTable
                data={
                  reportData.allProductDataWithImpressions
                    .allCohortAnalysisDataWithImpressions
                }
                columns={productTableHeaders}
              />
            </TabsContent>

            <TabsContent value='brand' className='p-4'>
              <InsightsTable
                data={reportData.allProductDataWithImpressions.brandCohort}
                columns={brandColumns}
              />
            </TabsContent>
            {Array.from({ length: 5 }).map((_, i) => {
              return (
                <TabsContent value={`type${i + 1}`} className='p-4'>
                  <InsightsTable
                    data={getSegmentDataByType(`productTypeL${i + 1}Cohort`)}
                    columns={productTypeColumns(`L${i + 1}`)}
                  />
                </TabsContent>
              );
            })}
            {Array.from({ length: 5 }).map((_, i) => {
              return (
                <TabsContent value={`categoryL${i + 1}`} className='p-4'>
                  <InsightsTable
                    data={getSegmentDataByType(`categoryL${i + 1}Cohort`)}
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
