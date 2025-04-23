import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ColumnDefinition<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface InsightsTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
}

function InsightsTable<T>({ data, columns }: InsightsTableProps<T>) {
  return (
    <div className='w-full  "w-full h-[500px] overflow-y-auto'>
      <table className='w-full min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50 sticky top-0 z-[5]'>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap'
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className='hover:bg-gray-50'>
              {columns.map((column, colIndex) => {
                if (column.cell) {
                  return (
                    <td
                      key={colIndex}
                      className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'
                    >
                      {column.cell(row)}
                    </td>
                  );
                }

                // Handle nested property access with dot notation
                const keys = (column.accessorKey as string).split('.');
                let value = row as any;

                for (const key of keys) {
                  value = value?.[key];
                }

                // Format numbers with commas
                if (typeof value === 'number') {
                  value = value.toLocaleString();
                }

                return (
                  <td
                    key={colIndex}
                    className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper components for rendering specific types of cells
export const ChangeCell = ({ value }: { value: number }) => {
  const isPositive = value >= 0;
  return (
    <span
      className={`inline-flex items-center ${
        isPositive ? 'text-success-600' : 'text-error-600'
      }`}
    >
      {isPositive ? (
        <ArrowUpRight size={14} className='mr-1' />
      ) : (
        <ArrowDownRight size={14} className='mr-1' />
      )}
      {value.toLocaleString()}
    </span>
  );
};

export const PercentageCell = ({ value }: { value: number }) => {
  const isPositive = value >= 0;
  return (
    <span
      className={`inline-flex items-center ${
        isPositive ? 'text-success-600' : 'text-error-600'
      }`}
    >
      {isPositive ? (
        <ArrowUpRight size={14} className='mr-1' />
      ) : (
        <ArrowDownRight size={14} className='mr-1' />
      )}
      {value.toFixed(2)}%
    </span>
  );
};

export default InsightsTable;
