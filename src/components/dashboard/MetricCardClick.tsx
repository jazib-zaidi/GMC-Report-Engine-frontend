import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getLastYearDateRange } from '../../utils/lastYearDate';

interface MetricCardProps {
  title: string;
  data: any;
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
  const { selectedDateRange, previousDateRange } = useAuth();

  const current =
    data?.allProductDataWithImpressions?.totalCurrentMetricsWithImpressions;
  const previous =
    data?.allProductDataWithImpressions?.totalPreviousMetricsWithImpressions;

  const currentClicks = current?.clicks ?? 0;
  const previousClicks = previous?.clicks ?? 0;

  const change = currentClicks - previousClicks;
  const percentage = previousClicks
    ? `${((change / previousClicks) * 100).toFixed(2)}%`
    : 'N/A';

  const isPositive = change >= 0;

  const formatNumber = (num: number) => num.toLocaleString();

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
            {prefix}
            {formatNumber(currentClicks)}
            {suffix}
          </span>
          <div className='text-gray-500 text-lg font-medium'>vs</div>
          <span>
            <div className='text-gray-500 text-xs '>
              {formatDate(previousDateRange?.startDate)} –{' '}
              {formatDate(previousDateRange?.endDate)}
            </div>
            {prefix}
            {formatNumber(previousClicks)}
            {suffix}
          </span>
        </div>

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
                <td className='py-1 font-medium'>{formatNumber(change)}</td>
              </tr>
              <tr>
                <td className='py-1'>Changes (%)</td>
                <td className='py-1 font-medium'>{percentage}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCardClick;
