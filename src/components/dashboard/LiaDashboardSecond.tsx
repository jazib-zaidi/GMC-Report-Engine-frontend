// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/autoplay';
interface StoreData {
  id: string;
  name: string;
  location: string;
  cost: string;
  revenue: string;
  roaz: string;
  clicks: string;
  impressions: string;
  products: Array<{
    id: number;
    name: string;
    sku: string;
    cost: string;
    revenue: string;
    roaz: string;
    image: string;
  }>;
}

const App: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 7 days');
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [activeStore, setActiveStore] = useState('Store A');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock store data
  const storesData: StoreData[] = [
    {
      id: 'store-a',
      name: 'Store A',
      location: 'New York',
      cost: '$2,345.67',
      revenue: '$23,456.78',
      roaz: '1000.5',
      clicks: '1,234',
      impressions: '45,678',
      products: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        sku: `SKU-A-${i + 1}`,
        cost: `$${(Math.random() * 1000).toFixed(2)}`,
        revenue: `$${(Math.random() * 10000).toFixed(2)}`,
        roaz: `${(Math.random() * 1000 + 500).toFixed(1)}`,
        image: `https://readdy.ai/api/search-image?query=professional%20product%20photography%20of%20a%20retail%20store%20product%20with%20clean%20white%20background%20minimalist%20style%20high%20end%20product%20shot&width=100&height=100&seq=${i}-store-a&orientation=squarish`,
      })),
    },
    {
      id: 'store-b',
      name: 'Store B',
      location: 'Los Angeles',
      cost: '$1,987.65',
      revenue: '$19,876.54',
      roaz: '999.8',
      clicks: '987',
      impressions: '34,567',
      products: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        sku: `SKU-B-${i + 1}`,
        cost: `$${(Math.random() * 1000).toFixed(2)}`,
        revenue: `$${(Math.random() * 10000).toFixed(2)}`,
        roaz: `${(Math.random() * 1000 + 500).toFixed(1)}`,
        image: `https://readdy.ai/api/search-image?query=professional%20product%20photography%20of%20a%20retail%20store%20product%20with%20clean%20white%20background%20minimalist%20style%20high%20end%20product%20shot&width=100&height=100&seq=${i}-store-b&orientation=squarish`,
      })),
    },
    {
      id: 'store-c',
      name: 'Store C',
      location: 'Chicago',
      cost: '$1,567.89',
      revenue: '$15,678.90',
      roaz: '1001.2',
      clicks: '876',
      impressions: '23,456',
      products: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        sku: `SKU-C-${i + 1}`,
        cost: `$${(Math.random() * 1000).toFixed(2)}`,
        revenue: `$${(Math.random() * 10000).toFixed(2)}`,
        roaz: `${(Math.random() * 1000 + 500).toFixed(1)}`,
        image: `https://readdy.ai/api/search-image?query=professional%20product%20photography%20of%20a%20retail%20store%20product%20with%20clean%20white%20background%20minimalist%20style%20high%20end%20product%20shot&width=100&height=100&seq=${i}-store-c&orientation=squarish`,
      })),
    },
  ];
  const toggleRowExpansion = (rowId: string) => {
    if (expandedRows.includes(rowId)) {
      setExpandedRows(expandedRows.filter((id) => id !== rowId));
    } else {
      setExpandedRows([...expandedRows, rowId]);
    }
  };
  const isRowExpanded = (rowId: string) => {
    return expandedRows.includes(rowId);
  };
  const handleExport = () => {
    alert('Exporting report...');
  };
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };
  const handleStoreChange = (store: string) => {
    setActiveStore(store);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // Mock data for online products
  const onlineProducts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    image:
      i % 3 === 0
        ? ''
        : `https://readdy.ai/api/search-image?query=professional%20product%20photography%20of%20a%20consumer%20electronics%20device%20with%20clean%20white%20background%2C%20high%20resolution%20product%20shot%2C%20studio%20lighting%2C%20minimalist%20style%2C%20e-commerce%20product%20image&width=120&height=120&seq=${i}&orientation=squarish`,
    title: `Product ${i + 1} - High Performance Item with Extended Description`,
    cost: (Math.random() * 500).toFixed(2),
    revenue: (Math.random() * 5000).toFixed(2),
    roaz: (Math.random() * 2000).toFixed(2),
  }));
  // Mock data for store categories
  const storeCategories = [
    {
      category: 'Electronics',
      cost: '1,230.45',
      revenue: '12,345.67',
      roaz: '1002.5',
    },
    {
      category: 'Home & Garden',
      cost: '876.54',
      revenue: '8,765.43',
      roaz: '999.8',
    },
    {
      category: 'Apparel',
      cost: '567.89',
      revenue: '5,678.90',
      roaz: '1001.2',
    },
    { category: 'Beauty', cost: '345.67', revenue: '3,456.78', roaz: '1000.6' },
    { category: 'Sports', cost: '234.56', revenue: '2,345.67', roaz: '998.9' },
  ];
  // Pagination logic
  const productsPerPage = 10;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = onlineProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(onlineProducts.length / productsPerPage);
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-gray-900'>
            Channel Performance
          </h1>
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <select
                value={timeRange}
                onChange={handleTimeRangeChange}
                className='block w-44 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#f49d08] focus:border-[#f49d08] sm:text-sm rounded-md'
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Custom</option>
              </select>
            </div>
            <button
              onClick={handleExport}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-button shadow-sm text-white bg-[#f49d08] hover:bg-[#e08d00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f49d08] cursor-pointer whitespace-nowrap'
            >
              <i className='fas fa-download mr-2'></i>
              Export Report
            </button>
          </div>
        </div>
      </header>
      {/* Metric Cards */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Cost Card */}
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0 bg-[#f49d08] bg-opacity-10 rounded-md p-3'>
                  <i className='fas fa-dollar-sign text-[#f49d08] text-xl'></i>
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Cost
                    </dt>
                    <dd>
                      <div className='text-lg font-semibold text-gray-900'>
                        $5,020
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* Revenue Card */}
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0 bg-green-100 rounded-md p-3'>
                  <i className='fas fa-chart-line text-green-600 text-xl'></i>
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Revenue
                    </dt>
                    <dd>
                      <div className='text-lg font-semibold text-gray-900'>
                        $50,322
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* ROAS Card */}
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0 bg-blue-100 rounded-md p-3'>
                  <i className='fas fa-exchange-alt text-blue-600 text-xl'></i>
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      ROAS
                    </dt>
                    <dd>
                      <div className='text-lg font-semibold text-gray-900'>
                        10.06x
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          {/* ROAZ Card */}
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='px-4 py-5 sm:p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0 bg-purple-100 rounded-md p-3'>
                  <i className='fas fa-percentage text-purple-600 text-xl'></i>
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      ROAZ
                    </dt>
                    <dd>
                      <div className='text-lg font-semibold text-gray-900'>
                        1006%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Table */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          <div className='px-4 py-5 sm:px-6 border-b border-gray-200'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              Channel Performance
            </h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Channel
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Cost
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Revenue
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    ROAZ (%)
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    View
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {/* Online Row */}
                <tr
                  className='hover:bg-gray-50 cursor-pointer'
                  onClick={() => toggleRowExpansion('online')}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <span className='px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                        Online
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                    $3,245.67
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                    $32,456.78
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                    1000%
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                    <button className='text-[#f49d08] hover:text-[#e08d00] cursor-pointer whitespace-nowrap !rounded-button'>
                      <i
                        className={`fas ${
                          isRowExpanded('online')
                            ? 'fa-chevron-up'
                            : 'fa-chevron-down'
                        }`}
                      ></i>
                    </button>
                  </td>
                </tr>
                {/* Online Expanded Content */}
                {isRowExpanded('online') && (
                  <tr>
                    <td colSpan={5} className='px-0 py-0'>
                      <div className='bg-gray-50 px-6 py-4'>
                        <h4 className='text-md font-medium text-gray-700 mb-4'>
                          Top 50 Products – Online Channel
                        </h4>
                        <div className='overflow-x-auto'>
                          <table className='min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg'>
                            <thead className='bg-gray-50'>
                              <tr>
                                <th
                                  scope='col'
                                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                >
                                  Product
                                </th>
                                <th
                                  scope='col'
                                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                                >
                                  Cost
                                </th>
                                <th
                                  scope='col'
                                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                                >
                                  Revenue
                                </th>
                                <th
                                  scope='col'
                                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                                >
                                  ROAZ (%)
                                </th>
                              </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                              {currentProducts.map((product) => (
                                <tr
                                  key={product.id}
                                  className='hover:bg-gray-50'
                                >
                                  <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                      <div className='flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100'>
                                        {product.image ? (
                                          <img
                                            src={product.image}
                                            alt={product.title}
                                            className='h-10 w-10 object-cover object-top'
                                          />
                                        ) : (
                                          <div className='h-10 w-10 flex items-center justify-center bg-gray-200'>
                                            <i className='fas fa-image text-gray-400'></i>
                                          </div>
                                        )}
                                      </div>
                                      <div className='ml-4'>
                                        <div className='text-sm font-medium text-gray-900 max-w-xs truncate'>
                                          {product.title}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                                    ${product.cost}
                                  </td>
                                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                                    ${product.revenue}
                                  </td>
                                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                                    {product.roaz}%
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {/* Pagination */}
                        <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg'>
                          <div className='flex-1 flex justify-between sm:hidden'>
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-button ${
                                currentPage === 1
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                              } cursor-pointer whitespace-nowrap`}
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-button ${
                                currentPage === totalPages
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                              } cursor-pointer whitespace-nowrap`}
                            >
                              Next
                            </button>
                          </div>
                          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                            <div>
                              <p className='text-sm text-gray-700'>
                                Showing{' '}
                                <span className='font-medium'>
                                  {indexOfFirstProduct + 1}
                                </span>{' '}
                                to{' '}
                                <span className='font-medium'>
                                  {indexOfLastProduct > onlineProducts.length
                                    ? onlineProducts.length
                                    : indexOfLastProduct}
                                </span>{' '}
                                of{' '}
                                <span className='font-medium'>
                                  {onlineProducts.length}
                                </span>{' '}
                                products
                              </p>
                            </div>
                            <div>
                              <nav
                                className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                                aria-label='Pagination'
                              >
                                <button
                                  onClick={() =>
                                    handlePageChange(currentPage - 1)
                                  }
                                  disabled={currentPage === 1}
                                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                    currentPage === 1
                                      ? 'text-gray-300 cursor-not-allowed'
                                      : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                                  } whitespace-nowrap !rounded-button`}
                                >
                                  <span className='sr-only'>Previous</span>
                                  <i className='fas fa-chevron-left h-5 w-5'></i>
                                </button>
                                {Array.from(
                                  { length: totalPages },
                                  (_, i) => i + 1
                                ).map((page) => (
                                  <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`relative inline-flex items-center px-4 py-2 border ${
                                      currentPage === page
                                        ? 'z-10 bg-[#f49d08] border-[#f49d08] text-white'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    } text-sm font-medium cursor-pointer whitespace-nowrap !rounded-button`}
                                  >
                                    {page}
                                  </button>
                                ))}
                                <button
                                  onClick={() =>
                                    handlePageChange(currentPage + 1)
                                  }
                                  disabled={currentPage === totalPages}
                                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                    currentPage === totalPages
                                      ? 'text-gray-300 cursor-not-allowed'
                                      : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                                  } whitespace-nowrap !rounded-button`}
                                >
                                  <span className='sr-only'>Next</span>
                                  <i className='fas fa-chevron-right h-5 w-5'></i>
                                </button>
                              </nav>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {/* Local Row */}
                <tr
                  className='hover:bg-gray-50 cursor-pointer'
                  onClick={() => toggleRowExpansion('local')}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <span className='px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        Local
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                    $1,774.33
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                    $17,865.22
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                    1006%
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                    <button className='text-[#f49d08] hover:text-[#e08d00] cursor-pointer whitespace-nowrap !rounded-button'>
                      <i
                        className={`fas ${
                          isRowExpanded('local')
                            ? 'fa-chevron-up'
                            : 'fa-chevron-down'
                        }`}
                      ></i>
                    </button>
                  </td>
                </tr>
                {/* Local Expanded Content */}
                {isRowExpanded('local') && (
                  <tr>
                    <td colSpan={5} className='px-0 py-0'>
                      <div className='bg-gray-50 px-6 py-4'>
                        <div className='space-y-4'>
                          {[
                            {
                              id: 'store-a',
                              name: 'Store A',
                              location: 'New York',
                              cost: '$2,345.67',
                              revenue: '$23,456.78',
                              roaz: '1000.5',
                              clicks: '1,234',
                              impressions: '45,678',
                            },
                            {
                              id: 'store-b',
                              name: 'Store B',
                              location: 'Los Angeles',
                              cost: '$1,987.65',
                              revenue: '$19,876.54',
                              roaz: '999.8',
                              clicks: '987',
                              impressions: '34,567',
                            },
                            {
                              id: 'store-c',
                              name: 'Store C',
                              location: 'Chicago',
                              cost: '$1,567.89',
                              revenue: '$15,678.90',
                              roaz: '1001.2',
                              clicks: '876',
                              impressions: '23,456',
                            },
                          ].map((store) => (
                            <div
                              key={store.id}
                              className='bg-white shadow rounded-lg overflow-hidden'
                            >
                              <div className='px-6 py-4 border-b border-gray-200'>
                                <div className='flex items-center justify-between'>
                                  <div className='flex items-center space-x-4'>
                                    <div>
                                      <h3 className='text-lg font-medium text-gray-900'>
                                        {store.name}
                                      </h3>
                                      <p className='text-sm text-gray-500'>
                                        {store.location}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => toggleRowExpansion(store.id)}
                                    className='text-[#f49d08] hover:text-[#e08d00] cursor-pointer whitespace-nowrap !rounded-button'
                                  >
                                    <i
                                      className={`fas ${
                                        isRowExpanded(store.id)
                                          ? 'fa-chevron-up'
                                          : 'fa-chevron-down'
                                      }`}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                              <div className='px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-gray-200'>
                                <div>
                                  <p className='text-sm font-medium text-gray-500'>
                                    Cost
                                  </p>
                                  <p className='mt-1 text-lg font-semibold text-gray-900'>
                                    {store.cost}
                                  </p>
                                </div>
                                <div>
                                  <p className='text-sm font-medium text-gray-500'>
                                    Revenue
                                  </p>
                                  <p className='mt-1 text-lg font-semibold text-gray-900'>
                                    {store.revenue}
                                  </p>
                                </div>
                                <div>
                                  <p className='text-sm font-medium text-gray-500'>
                                    ROAZ
                                  </p>
                                  <p className='mt-1 text-lg font-semibold text-gray-900'>
                                    {store.roaz}%
                                  </p>
                                </div>
                                <div>
                                  <p className='text-sm font-medium text-gray-500'>
                                    Clicks / Impressions
                                  </p>
                                  <p className='mt-1 text-lg font-semibold text-gray-900'>
                                    {store.clicks} / {store.impressions}
                                  </p>
                                </div>
                              </div>
                              {isRowExpanded(store.id) && (
                                <div className='px-6 py-4'>
                                  <h4 className='text-md font-medium text-gray-700 mb-4'>
                                    Top Products
                                  </h4>
                                  <table className='min-w-full divide-y divide-gray-200'>
                                    <thead className='bg-gray-50'>
                                      <tr>
                                        <th
                                          scope='col'
                                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                        >
                                          Product
                                        </th>
                                        <th
                                          scope='col'
                                          className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                                        >
                                          Cost
                                        </th>
                                        <th
                                          scope='col'
                                          className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                                        >
                                          Revenue
                                        </th>
                                        <th
                                          scope='col'
                                          className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                                        >
                                          ROAZ (%)
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-200'>
                                      {[1, 2, 3].map((item) => (
                                        <tr
                                          key={item}
                                          className='hover:bg-gray-50'
                                        >
                                          <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                              <div className='flex-shrink-0 h-10 w-10'>
                                                <img
                                                  className='h-10 w-10 rounded object-cover object-top'
                                                  src={`https://readdy.ai/api/search-image?query=professional%20product%20photography%20of%20a%20retail%20store%20product%20with%20clean%20white%20background%20minimalist%20style%20high%20end%20product%20shot&width=100&height=100&seq=${item}-${store.id}&orientation=squarish`}
                                                  alt=''
                                                />
                                              </div>
                                              <div className='ml-4'>
                                                <div className='text-sm font-medium text-gray-900'>
                                                  Product {item}
                                                </div>
                                                <div className='text-sm text-gray-500'>
                                                  SKU-{store.id}-{item}
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                          <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                                            $234.56
                                          </td>
                                          <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                                            $2,345.67
                                          </td>
                                          <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                                            1000.5%
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
