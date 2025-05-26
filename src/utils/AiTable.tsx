import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

const AiTable = ({ AiResponse }) => {
  const rowsPerPage = 4;
  const replaceHeader = [{ cost_micros: 'cost' }];

  // Extract dynamic fields from query
  const dynamicFields = [
    ...AiResponse.queryData.matchAll(/\b(metrics|segments)\.(\w+)/g),
  ].map((match) => {
    const field = match[2];
    // Check if field is in replaceHeader mapping, replace if yes
    const replacementObj = replaceHeader.find((obj) => obj[field]);
    return replacementObj ? replacementObj[field] : field;
  });

  const uniqueDynamicFields = Array.from(new Set(dynamicFields));

  // Define the headers dynamically
  const tableHeaders = [
    'product_item_id',
    'product_title',
    ...uniqueDynamicFields,
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const totalRows = AiResponse?.response.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Calculate rows to display based on current page
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const paginatedRows = AiResponse?.response.slice(startIdx, endIdx) || [];

  // Pagination handlers
  const goToPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div>
      <div
        className='custom-table-class'
        dangerouslySetInnerHTML={{
          __html: AiResponse?.response[0]?.shortDescription,
        }}
      />

      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            {tableHeaders.map((header) => (
              <th
                key={header}
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                {header.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {paginatedRows.map((product, idx) => (
            <tr key={idx} className='hover:bg-gray-50'>
              {tableHeaders.map((field) => (
                <td
                  key={field}
                  className='px-4 py-2 whitespace-nowrap text-sm text-gray-900 truncate overflow-hidden max-w-[150px]'
                >
                  {field == 'product_item_id' ? (
                    product?.metaData.length > 0 ? (
                      <a
                        className='text-blue-500 flex items-center gap-x-2 relative group'
                        href={product?.metaData[0].Link}
                        target='_blank'
                      >
                        <img
                          className='w-12 border rounded-md p-1'
                          src={product?.metaData[0]['Image Link']}
                          alt={product.product_title}
                          loading='lazy'
                        />

                        <span className='truncate block max-w-[10rem] whitespace-nowrap overflow-hidden text-ellipsis'>
                          {product.product_item_id}
                        </span>
                      </a>
                    ) : (
                      <div className='flex items-center gap-x-2 relative group'>
                        <img
                          className='w-16 border rounded-md p-1'
                          src='https://image.pngaaa.com/700/5273700-middle.png'
                          alt={product.product_title}
                        />

                        <span className='truncate block max-w-[10rem] whitespace-nowrap overflow-hidden text-ellipsis'>
                          {product.product_item_id}
                        </span>
                      </div>
                    )
                  ) : product[field] !== undefined ? (
                    product[field].toString()
                  ) : (
                    'N/A'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalRows > rowsPerPage && (
        <div className='flex justify-center items-center gap-4 mt-4 mb-4'>
          <button
            onClick={goToPrev}
            disabled={currentPage === 1}
            className=' rounded bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400'
          >
            <ChevronLeft />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className=' rounded bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400'
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default AiTable;
