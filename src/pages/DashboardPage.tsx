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
type MonthlyData = { name: string; impressions: number };
type ChartDataPoint = { name: string; current: number; previous: number };
const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    inventoryOnly: false,
    trafficSource: 'organic',
  });

  const { reportData, merchantSelect } = useAuth();

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

  if (!merchantSelect?.id) {
    return <WelcomeDashboard />;
  }

  return (
    <div className='space-y-6 animate-fade-in'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 mb-3'>
          Cohort analysis
        </h1>
        <p className='mb-4'>
          Compares performance of items in stock during the same period.
        </p>
        <ComparisonPeriod />
      </div>

      {/* <FilterControls filters={filters} onFilterChange={handleFilterChange} /> */}
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
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Impressions Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ImpressionsChart data={impressionsChartData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clicks Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ClicksChart data={clicksChartData} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
