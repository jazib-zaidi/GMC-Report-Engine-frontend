import React from 'react';

export default function TableLoadingSkeleton({
  rows = 11,
  columns = 4,
  headerVisible = true,
  rowHeight = 'h-12',
  animated = true,
}) {
  return (
    <div className='w-full overflow-x-auto shadow-sm rounded-lg border border-gray-200'>
      <table className='w-full'>
        {headerVisible && (
          <thead className='bg-gray-50'>
            <tr>
              {[...Array(columns)].map((_, colIndex) => (
                <th key={`header-${colIndex}`} className='px-6 py-3 text-left'>
                  <div
                    className={`h-5 bg-gray-200 rounded ${
                      animated ? 'animate-pulse' : ''
                    }`}
                    style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                  ></div>
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className='bg-white divide-y divide-gray-200'>
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`} className={rowHeight}>
              {[...Array(columns)].map((_, colIndex) => (
                <td key={`cell-${rowIndex}-${colIndex}`} className='px-6 py-4'>
                  <div
                    className={`h-4 bg-gray-200 rounded ${
                      animated ? 'animate-pulse' : ''
                    }`}
                    style={{
                      width: `${
                        colIndex === 0
                          ? 70
                          : Math.floor(Math.random() * 50) + 30
                      }%`,
                    }}
                  ></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
