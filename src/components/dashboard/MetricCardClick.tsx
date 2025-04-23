import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { MetricData } from '../../types';
import { formatDate, getLastYearDateRange } from '../../utils/lastYearDate';
import { useAuth } from '../../context/AuthContext';

type ReportSummary = {
  impressions: string;
  clicks: string;
};

type ChangeSummary = {
  change: string;
  percent: string;
};

type ReportData = {
  current: {
    summary: ReportSummary;
    data: any[];
  };
  previous: {
    summary: ReportSummary;
    data: any[];
  };
  change: {
    impressions: ChangeSummary;
    clicks: ChangeSummary;
  };
};

interface MetricCardProps {
  title: string;
  data: ReportData;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
}

const MetricCardClick: React.FC<MetricCardProps> = ({
  title,
  data,
  prefix = '',
  suffix = '',
  icon,
}) => {
  const { selectedDateRange } = useAuth();
  const rawChange = data?.change?.clicks?.change ?? '0';
  const cleanedChange = rawChange.replace(/,/g, '');
  const numericChange = Number(cleanedChange);
  const isPositive = numericChange >= 0;

  const percentage = data?.change?.clicks?.percent;

  const current = data?.current?.summary;
  const previous = data?.previous?.summary;

  return (
    <Card className='transition-all duration-200 hover:shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium text-gray-500'>
          <div className='flex items-center mb-2'>
            {title}
            <div
              className={`font-medium ml-2 ${
                isPositive ? 'text-green-500' : 'text-red-400'
              }`}
            >
              <span className='inline-flex items-center'>
                {isPositive ? (
                  <ArrowUpRight size={18} />
                ) : (
                  <ArrowDownRight size={18} />
                )}
                {percentage}
              </span>
            </div>
          </div>
        </CardTitle>
        {icon && <div className='text-gray-500'>{icon}</div>}
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='text-2xl font-bold flex items-center justify-between'>
          <span>
            <div className='text-gray-500 text-xs '>
              {formatDate(selectedDateRange.startDate)} –{' '}
              {formatDate(selectedDateRange.endDate)}
            </div>
            {current?.clicks}
          </span>
          <div className='text-gray-500 text-lg  font-medium'>vs</div>
          <span>
            <div className='text-gray-500 text-xs '>
              {formatDate(getLastYearDateRange(selectedDateRange).startDate)} –{' '}
              {formatDate(getLastYearDateRange(selectedDateRange).endDate)}
            </div>{' '}
            {previous?.clicks}
          </span>
        </div>

        {/* Table: Current vs Previous */}
        <div className='mt-4 text-sm'>
          <table className='w-full text-left border-t border-gray-200 pt-2'>
            <thead className='text-gray-500 text-xs'>
              <tr>
                <th className='py-1'>Metric</th>
                <th className='py-1'>Value </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='py-1'>Changes</td>
                <td className='py-1 font-medium'>
                  {data?.change?.clicks.change}
                </td>
              </tr>
              <tr>
                <td className='py-1'>Changes (%)</td>
                <td className='py-1 font-medium'>
                  {data?.change?.clicks?.percent}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCardClick;
