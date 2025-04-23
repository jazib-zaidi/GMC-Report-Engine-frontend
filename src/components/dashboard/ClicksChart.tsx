import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint } from '../../types';
import { formatDate, getLastYearDateRange } from '../../utils/lastYearDate';
import { useAuth } from '../../context/AuthContext';

interface ClicksChartProps {
  data: ChartDataPoint[];
}

const ClicksChart: React.FC<ClicksChartProps> = ({ data }) => {
  const { selectedDateRange } = useAuth();
  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis dataKey='name' fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
            return value;
          }}
        />
        <Tooltip
          formatter={(value) => [`${value.toLocaleString()}`, 'Clicks']}
          labelFormatter={(label) => `Month: ${label}`}
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #f0f0f0',
          }}
        />
        <Legend align='right' verticalAlign='top' height={36} />
        <Line
          name={`${formatDate(selectedDateRange.startDate)}
                                   - ${formatDate(selectedDateRange.endDate)}`}
          type='monotone'
          dataKey='current'
          stroke='#2563EB'
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
        />
        <Line
          name={`${formatDate(
            getLastYearDateRange(selectedDateRange).startDate
          )} –
                                  ${formatDate(
                                    getLastYearDateRange(selectedDateRange)
                                      .endDate
                                  )}`}
          type='monotone'
          dataKey='previous'
          stroke='#93C5FD'
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
          activeDot={{ r: 6, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ClicksChart;
