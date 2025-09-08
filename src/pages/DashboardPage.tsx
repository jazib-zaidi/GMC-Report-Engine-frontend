import React, { useState } from 'react';
import { EyeIcon, MousePointerClick } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/ui/Card';
import MetricCard from '../components/dashboard/MetricCard';
import FilterControls from '../components/dashboard/FilterControls';
import ImpressionsChart from '../components/dashboard/ImpressionsChart';
import ClicksChart from '../components/dashboard/ClicksChart';
import ComparisonPeriod from '../components/ComparisonPeriod';
import { FilterOptions } from '../types';
import {
  impressionsData,
  clicksData,
  clicksChartData,
} from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import MetricCardClick from '../components/dashboard/MetricCardClick';
import WelcomeDashboard from '../components/dashboard/WelcomeDashboard';
import PerformanceDashboardSkeleton from '../components/dashboard/PerformanceDashboardSkeleton';
import CustomReportBuilder from '../components/dashboard/CustomReportBuilder';
import LiaDashboard from '../components/dashboard/LiaDashboard';
import LiaDashboardSecond from '../components/dashboard/LiaDashboardSecond';
import FilterModal from '@/components/dashboard/FilterModal';
type MonthlyData = { name: string; impressions: number };
type ChartDataPoint = { name: string; current: number; previous: number };
const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    inventoryOnly: false,
    trafficSource: 'organic',
  });

  const {
    reportData,
    merchantSelect,
    selectedAdsAccount,
    showFilterModal,
    traffic,
  } = useAuth();

  function generateImpressionsChartData(
    current: MonthlyData[],
    previous: MonthlyData[]
  ): ChartDataPoint[] {
    const monthOrder = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const currentMap = Object.fromEntries(
      current.map((item) => [item.name, item.impressions])
    );

    const previousMap = Object.fromEntries(
      previous.map((item) => [item.name, item.impressions])
    );

    const result: ChartDataPoint[] = [];

    monthOrder.forEach((month) => {
      if (month in currentMap || month in previousMap) {
        result.push({
          name: month,
          current: currentMap[month] ?? 0,
          previous: previousMap[month] ?? 0,
        });
      }
    });

    return result;
  }

  function generateClicksChartData(
    current: MonthlyData[],
    previous: MonthlyData[]
  ): ChartDataPoint[] {
    const monthOrder = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const currentMap = Object.fromEntries(
      current.map((item) => [item.name, item.clicks])
    );

    const previousMap = Object.fromEntries(
      previous.map((item) => [item.name, item.clicks])
    );

    const result: ChartDataPoint[] = [];

    monthOrder.forEach((month) => {
      if (month in currentMap || month in previousMap) {
        result.push({
          name: month,
          current: currentMap[month] ?? 0,
          previous: previousMap[month] ?? 0,
        });
      }
    });

    return result;
  }

  const impressionsChartData = generateImpressionsChartData(
    reportData?.current?.chartData || [],
    reportData?.previous?.chartData || []
  );
  const clicksChartData = generateClicksChartData(
    reportData?.current?.chartData || [],
    reportData?.previous?.chartData || []
  );

  const handleFilterChange = (
    name: keyof FilterOptions,
    value: boolean | string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!merchantSelect?.id && !selectedAdsAccount?.customer_id) {
    return <WelcomeDashboard />;
  }

  if (selectedAdsAccount?.customer_id) {
    return <LiaDashboard />;
  }

  if (showFilterModal) {
    return <FilterModal openByDefault />;
  }

  return (
    <div className='space-y-6 animate-fade-in'>
      <div className='flex items-center justify-between mb-4'>
        <div className=''>
          <h1 className='text-2xl font-bold text-gray-900 mb-3'>
            Cohort analysis
          </h1>
          <p className='mb-4'>
            Compares performance of items that had impressions during the same
            period.
          </p>
        </div>
        <div className='gap-2 flex items-center'>
          {traffic && <span className='text-gray-500'>Traffic: {traffic}</span>}
          <FilterModal />
        </div>
      </div>

      {!reportData ? (
        <PerformanceDashboardSkeleton />
      ) : (
        <>
          {' '}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <MetricCard
              title='Actual Impressions'
              data={reportData}
              icon={<EyeIcon size={18} />}
            />

            <MetricCardClick
              title='Actual Clicks'
              data={reportData}
              icon={<MousePointerClick size={18} />}
            />
          </div>
          <CustomReportBuilder />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
