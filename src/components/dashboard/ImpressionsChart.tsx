import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getLastYearDateRange } from '../../utils/lastYearDate';

interface ImpressionsChartProps {
  data: ChartDataPoint[];
}

const ImpressionsChart: React.FC<ImpressionsChartProps> = ({ data }) => {
  const { selectedDateRange } = useAuth();
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          formatter={(value) => [`${value.toLocaleString()}`, 'Impressions']}
          labelFormatter={(label) => `Month: ${label}`}
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #f0f0f0',
          }}
        />
        <Legend align='right' verticalAlign='top' height={36} />
        <Bar
          name={`${formatDate(selectedDateRange.startDate)}
                         - ${formatDate(selectedDateRange.endDate)}`}
          dataKey='current'
          fill='#3B82F6'
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
        <Bar
          name={`${formatDate(
            getLastYearDateRange(selectedDateRange).startDate
          )} –
                        ${formatDate(
                          getLastYearDateRange(selectedDateRange).endDate
                        )}`}
          dataKey='previous'
          fill='#93C5FD'
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ImpressionsChart;
