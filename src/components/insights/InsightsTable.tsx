import React, { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className='w-full h-[500px] flex flex-col overflow-hidden'>
      <div className='overflow-y-auto flex-1'>
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
            {paginatedData.map((row, rowIndex) => (
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

                  const keys = (column.accessorKey as string).split('.');
                  let value = row as any;
                  for (const key of keys) {
                    value = value?.[key];
                  }

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

      {/* Pagination Controls */}
      <div className='bg-white border-t sticky bottom-0 z-10 px-4 py-2 flex items-center justify-between text-sm'>
        <div>
          Rows per page:{' '}
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className='ml-2 border rounded px-2 py-1 text-sm'
          >
            {[50, 100, 200, 500].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className='text-gray-600 disabled:opacity-50'
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className='text-gray-600 disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper cell components remain the same
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
