import { Columns } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function AdvancedColumnSelector({ productTableHeaer }) {
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 90;
    }
  };
  const productType = Array.from({ length: 5 }).map((_, i) => {
    return {
      header: `Product Type Level ${i + 1}`,
      accessorKey: `productTypeL${i + 1}`,
      locked: false,
      selected: false,
      order: 13 + i,
    };
  });
  const customLabel = Array.from({ length: 5 }).map((_, i) => {
    return {
      header: `Custom Label ${i}`,
      accessorKey: `customLabel${i}`,
      locked: false,
      selected: false,
      order: 13 + i,
    };
  });

  // All available columns with their locked status
  const [columns, setColumns] = useState([
    {
      header: 'Item ID',
      accessorKey: 'offerId',
      id: 'offerId',
      name: 'Google product category',
      locked: true,
      selected: true,
      order: 1,
    },
    {
      header: 'Title',
      accessorKey: 'title',
      id: 'offerId',
      name: 'Google product category',
      locked: true,
      selected: true,
      order: 2,
    },
    {
      header: 'Current Period Clicks',
      accessorKey: 'currentClicks',
      id: 'offerId',
      name: 'Google product category',
      locked: true,
      selected: true,
      order: 3,
    },
    {
      header: 'Previous Period Clicks',
      accessorKey: 'previousClicks',
      id: 'offerId',
      name: 'Google product category',
      locked: true,
      selected: true,
      order: 4,
    },
    {
      header: 'Clicks Change (%)',
      accessorKey: 'clickChangePercent',
      id: 'offerId',
      name: 'Google product category',
      locked: true,
      selected: true,
      order: 5,
    },
    {
      header: 'Clicks Change (Number)',
      accessorKey: 'clickChangeNumber',
      id: 'offerId',
      name: 'Google product category',
      locked: true,
      selected: true,
      order: 6,
    },
    {
      header: 'Current Period Impressions',
      accessorKey: 'currentImpressions',
      id: 'offerId',
      name: 'Google product category',
      locked: true,
      selected: true,
      order: 7,
    },
    {
      header: 'Current Period Impressions',
      accessorKey: 'currentImpressions',
      id: 'offerId',
      name: 'Google product category',
      locked: true,
      selected: true,
      order: 8,
    },
    {
      header: 'Previous Period Impressions',
      accessorKey: 'previousImpressions',
      id: 'offerId',
      name: 'Google product category',
      locked: true,
      selected: true,
      order: 9,
    },
    {
      header: 'Impressions Change (%)',
      accessorKey: 'impressionChangePercent',
      id: 'offerId',
      name: 'Google product category',
      locked: true,
      selected: true,
      order: 10,
    },
    {
      header: 'Impressions Change (Number)',
      accessorKey: 'impressionChangeNumber',
      id: 'offerId',
      name: 'Google product category',
      locked: true,
      selected: true,
      order: 11,
    },
    {
      header: 'Brand',
      accessorKey: 'brand',

      locked: false,
      selected: false,
      order: 12,
    },
    ...productType,
    ...customLabel,
  ]);

  // Filter columns based on search term
  const filteredColumns = columns.filter((column) =>
    column.header.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group columns into 3 columns for display
  const columnsByGroup = [];
  for (let i = 0; i < filteredColumns.length; i += 3) {
    columnsByGroup.push(filteredColumns.slice(i, i + 3));
  }

  // Get selected columns for the right panel, sorted by order
  const selectedColumns = columns
    .filter((col) => col.selected)
    .sort((a, b) => a.order - b.order);

  // Toggle column selection
  const toggleColumn = (accessorKey) => {
    setColumns(
      columns.map((column) => {
        if (column.accessorKey === accessorKey && !column.locked) {
          const newOrder = column.selected
            ? null
            : Math.max(...selectedColumns.map((c) => c.order), 0) + 1;
          return { ...column, selected: !column.selected, order: newOrder };
        }
        return column;
      })
    );
  };
  function sortByOrder(array) {
    return array.slice().sort((a, b) => a.order - b.order);
  }
  const handleApply = () => {
    const onlySelectedColumns = columns.filter((col) => col.selected);

    productTableHeaer(sortByOrder(onlySelectedColumns));
    toggleModal();
  };
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Drag start handler
  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  // Drag enter handler
  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  // Handle drag drop
  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    // Make sure we don't try to reorder locked columns
    const draggedColumn = selectedColumns[dragItem.current];
    if (draggedColumn.locked) return;

    // Create a copy of the selected columns
    const copiedSelectedColumns = [...selectedColumns];

    // Remove the dragged item
    const draggedItemContent = copiedSelectedColumns.splice(
      dragItem.current,
      1
    )[0];

    // Add the dragged item after the drop position
    copiedSelectedColumns.splice(dragOverItem.current, 0, draggedItemContent);

    // Update the order property for all columns
    const updatedColumns = [...columns];
    copiedSelectedColumns.forEach((col, index) => {
      const colIndex = updatedColumns.findIndex(
        (c) => c.accessorKey === col.accessorKey
      );
      if (colIndex !== -1) {
        updatedColumns[colIndex] = {
          ...updatedColumns[colIndex],
          order: index + 1,
        };
      }
    });

    // Update the columns state
    setColumns(updatedColumns);

    // Reset the drag refs
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className='flex flex-row justify-end items-center'>
      <button
        onClick={toggleModal}
        className=' border-2 bg-white  border-gray-300  text-black py-2  rounded-md transition duration-200 w-[150px]'
      >
        Modify columns
      </button>

      {/* Modal container */}
      {isModalOpen && (
        <div className=''>
          <div className='fixed inset-0 bg-black bg-opacity-40 z-[9]'></div>
          <div className='fixed w-4/5 h-[90%] inset-0 bg-white flex flex-col shadow-lg rounded-lg z-10 m-auto '>
            <div className='flex items-center p-4 border-b'>
              <h2 className='text-xl font-medium'>Modify columns</h2>
              <div className='ml-auto relative flex items-center'>
                <input
                  type='text'
                  placeholder='Search columns'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className='pl-10 pr-4 py-2 border rounded-lg w-64'
                />
                <svg
                  className='w-5 h-5 absolute left-3 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </div>
            </div>

            <div className='flex flex-1 overflow-hidden'>
              {/* Left section - Column options */}
              <div className='flex-1 p-6 overflow-y-auto border-r flex flex-col justify-between'>
                <div className=''>
                  {columnsByGroup.map((group, groupIndex) => (
                    <div key={groupIndex} className='flex mb-4'>
                      {group.map((column) =>
                        column.locked ? null : (
                          <div
                            key={column.accessorKey}
                            className='flex items-center w-1/3 mb-4'
                          >
                            <div
                              className={`w-5 h-5 mr-2 border rounded flex items-center justify-center ${
                                column.selected
                                  ? 'bg-blue-500 border-blue-500'
                                  : 'border-gray-400'
                              }`}
                              onClick={() => {
                                toggleColumn(column.accessorKey);
                                scrollToBottom();
                              }}
                            >
                              {column.selected && (
                                <svg
                                  className='w-3 h-3 text-white'
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                              )}
                            </div>
                            <label className='cursor-pointer select-none'>
                              {column?.header}
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
                <div className=''>
                  <button
                    onClick={handleApply}
                    className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-md transition duration-200 mr-4'
                  >
                    Apply
                  </button>
                  <button
                    onClick={toggleModal}
                    className=' border-2 bg-white  border-gray-300  text-black py-2 px-8 rounded-md transition duration-200'
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Right section - Your columns */}
              <div
                ref={scrollRef}
                className='w-64 flex-[0.5] p-6 bg-gray-50 overflow-y-auto'
              >
                <div className='mb-4'>
                  <h3 className='text-lg font-medium'>Your columns</h3>
                  <p className='text-sm text-gray-500'>
                    Drag and drop to reorder
                  </p>
                </div>

                <div className='space-y-2'>
                  {selectedColumns.map((column, index) => (
                    <div
                      key={column.accessorKey}
                      className={`flex items-center justify-between p-2 bg-white rounded border ${
                        !column.locked ? 'cursor-move' : ''
                      }`}
                      draggable={!column.locked}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={handleDrop}
                    >
                      <div className='flex items-center'>
                        {column.locked ? (
                          <svg
                            className='w-5 h-5 text-gray-400 mr-2'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                            />
                          </svg>
                        ) : (
                          <svg
                            className='w-5 h-5 text-gray-400 mr-2'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M4 8h16M4 16h16'
                            />
                          </svg>
                        )}
                        <span>{column.header}</span>
                      </div>

                      {!column.locked && (
                        <button
                          onClick={() => toggleColumn(column.accessorKey)}
                          className='w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100'
                        >
                          <svg
                            className='w-4 h-4 text-gray-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
