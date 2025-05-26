import React, { useState } from 'react';
import GoBack from '../GoBack';
import { useAuth } from '../../context/AuthContext';
import LiaMetrics from './LiaMetrics';
import Select from '../ui/Select';
import { ChevronDown } from 'lucide-react';
import SelectedDate from './selectedDate';

const OnlineDashboard = () => {
  const { liaReportData } = useAuth();

  const [selectedAttribute, setSelectedAttribute] = useState('product_item_id');
  const [expandedRows, setExpandedRows] = useState({});

  const onlineProducts = liaReportData.results.filter(
    (item) => item.product_channel === 'ONLINE'
  );
  function getPerformanceScore(product) {
    const { clicks, conversions, impressions, cost, conversions_value } =
      product;

    const ctr = impressions > 0 ? clicks / impressions : 0;
    const conversionRate = clicks > 0 ? conversions / clicks : 0;
    const roas = cost > 0 ? conversions_value / cost : 0;

    // Composite weighted score
    return (
      ctr * 0.4 + // engagement
      conversionRate * 0.3 + // sales efficiency
      roas * 0.3 // profitability
    );
  }

  function formatNumber(num) {
    return num?.toLocaleString();
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  function getTopPerformingProducts(products, limit = 50) {
    return products
      .map((product) => ({
        ...product,
        performanceScore: getPerformanceScore(product),
      }))
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, limit);
  }

  const topPerformingProducts = getTopPerformingProducts(onlineProducts || []);

  function groupProductsByAttribute(products, attributePath) {
    return products.reduce((acc, product) => {
      const key =
        attributePath.reduce((obj, key) => obj?.[key], product) || 'Unknown';
      if (!acc[key]) acc[key] = [];
      acc[key].push(product);
      return acc;
    }, {});
  }

  function groupByAttribute(products = [], attributeKey, topNProducts = 50) {
    const groups = {};

    products.forEach((product) => {
      const key = product[attributeKey] || 'Unknown';

      if (!groups[key]) {
        groups[key] = {
          products: [],
          totals: {
            clicks: 0,
            impressions: 0,
            conversions: 0,
            cost: 0,
            conversions_value: 0,
          },
        };
      }

      const group = groups[key];
      group.products.push({
        ...product,
        performanceScore: getPerformanceScore(product),
      });

      group.totals.clicks += product.clicks || 0;
      group.totals.impressions += product.impressions || 0;
      group.totals.conversions += product.conversions || 0;
      group.totals.cost += product.cost || 0;
      group.totals.conversions_value += product.conversions_value || 0;
    });

    Object.keys(groups).forEach((key) => {
      const { totals, products } = groups[key];

      const ctr =
        totals.impressions > 0 ? totals.clicks / totals.impressions : 0;
      const conversionRate =
        totals.clicks > 0 ? totals.conversions / totals.clicks : 0;
      const roas = totals.cost > 0 ? totals.conversions_value / totals.cost : 0;

      groups[key].performanceScore =
        ctr * 0.4 + conversionRate * 0.3 + roas * 0.3;
      groups[key].topProducts = products
        .sort((a, b) => b.performanceScore - a.performanceScore)
        .slice(0, topNProducts);
    });

    return groups;
  }

  const productattributeData = groupByAttribute(onlineProducts, [
    `${selectedAttribute}`,
  ]);

  console.log('new', topPerformingProducts);

  const renderProductTable = (products, nested) => (
    <table
      className={`${
        nested ? 'border-l-2 border-gray-200 bg-gray-50 mt-[-10px]' : ''
      } min-w-full divide-y divide-gray-200`}
    >
      <thead className='bg-gray-50'>
        <tr>
          {[
            'Item Id',
            'Title',
            'Impressions',
            'Clicks',
            'CTR',
            'Conversions',
            'Cost',
            'Revenue',
            'ROAS',
          ].map((header) => (
            <th
              key={header}
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={`${'bg-white divide-y divide-gray-200'}`}>
        {products.map((product, index) => {
          console.log(product);
          return (
            <tr key={index} className='hover:bg-gray-50'>
              <td className='px-6 py-4 text-sm text-gray-500'>
                {product?.metaData.length > 0 ? (
                  <a
                    className='text-blue-500 flex items-center gap-x-2 relative group'
                    href={product?.metaData[0].Link}
                    target='_blank'
                  >
                    <img
                      className='w-16 border rounded-md p-1'
                      src={product?.metaData[0]['Image Link']}
                      alt={product.product_title}
                    />

                    {/* Hover Preview with Animation */}
                    <div className=' absolute top-[-130px] left-0 z-10 opacity-0 scale-95 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100 pointer-events-none bg-white border rounded-md shadow-lg p-2'>
                      <div className=''>
                        <img
                          className='w-44'
                          src={product?.metaData[0]['Image Link']}
                          alt={product.product_title}
                        />
                        <p className='p-2  underline'>
                          {product.product_title}
                        </p>
                      </div>
                    </div>
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

                    {/* Hover Preview with Animation */}
                    <div className='absolute top-[-130px] left-0 z-10 opacity-0 scale-95 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100 pointer-events-none'>
                      <img
                        className='w-48 border rounded-md shadow-lg'
                        src='https://image.pngaaa.com/700/5273700-middle.png'
                        alt={product.product_title}
                      />
                    </div>

                    <span className='truncate block max-w-[10rem] whitespace-nowrap overflow-hidden text-ellipsis'>
                      {product.product_item_id}
                    </span>
                  </div>
                )}
              </td>

              <td className='px-6 py-4 text-sm text-gray-500'>
                <span
                  title={product.product_title}
                  className={
                    nested
                      ? 'truncate block max-w-[10rem] whitespace-nowrap overflow-hidden text-ellipsis'
                      : ''
                  }
                >
                  {product.product_title}
                </span>
              </td>
              <td className='px-6 py-4 text-sm text-gray-500'>
                {formatNumber(product.impressions)}
              </td>
              <td className='px-6 py-4 text-sm text-gray-500'>
                {formatNumber(product.clicks)}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                {product.impressions > 0
                  ? ((product.clicks / product.impressions) * 100).toFixed(2)
                  : '0.00'}
                %
              </td>

              <td className='px-6 py-4 text-sm text-gray-500'>
                {formatNumber(product.conversions)}
              </td>

              {/* sort by Revenue */}
              {/* truncate item id ? */}
              {/* show full attribute name in select option */}

              <td className='px-6 py-4 text-sm text-gray-500'>
                {formatCurrency(product.cost)}
              </td>
              <td className='px-6 py-4 text-sm text-gray-500'>
                {formatCurrency(product.conversions_value)}
              </td>
              <td className='px-6 py-4 text-sm text-gray-500'>
                {product.cost
                  ? (product.conversions_value / product.cost).toFixed(2)
                  : '0.00'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const attributeOptions = [
    { value: 'product_item_id', label: 'Item Id' },
    { value: 'product_brand', label: 'Brand' },
    { value: 'product_type_l1', label: 'Product Type 1' },
    { value: 'product_type_l2', label: 'Product Type 2' },
    { value: 'product_type_l3', label: 'Product Type 3' },
    { value: 'product_type_l4', label: 'Product Type 4' },
    { value: 'product_type_l5', label: 'Product Type 5' },
    {
      value: 'product_category_level1',
      label: 'Google Product Category level 1',
    },
    {
      value: 'product_category_level2',
      label: 'Google Product Category level 2',
    },
    {
      value: 'product_category_level3',
      label: 'Google Product Category level 3',
    },
    {
      value: 'product_category_level4',
      label: 'Google Product Category level 4',
    },
    {
      value: 'product_category_level5',
      label: 'Google Product Category level 5',
    },
  ];

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const metrics = liaReportData.data.filter(
    (channel) => channel.product_channel === 'ONLINE'
  )[0];

  console.log(onlineProducts);
  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        {' '}
        <GoBack /> <SelectedDate />
      </div>

      <br />
      <h1 className='text-2xl font-bold mb-6 mt-6'>Online Performance</h1>

      <LiaMetrics matrices={metrics} />
      <br />
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold mb-4'>
          {selectedAttribute === 'product_item_id'
            ? 'Top 50 Performing Products'
            : `Top Performing ${
                attributeOptions.filter(
                  (att) => att.value == selectedAttribute
                )[0].label
              } and their Products`}
        </h2>
        <div className='rounded-lg flex flex-col w-1/3'>
          <div className=' text-md font-medium text-gray-700 mb-1'>
            Group By:
          </div>
          <div className='flex flex-row items-center'>
            <br />
            <Select
              className='block w-full mt-1 border-gray-300 rounded-md shadow-sm'
              value={selectedAttribute}
              onChange={(e) => setSelectedAttribute(e.target.value)}
            >
              {attributeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className='overflow-x-auto'>
        {selectedAttribute === 'product_item_id' ? (
          renderProductTable(topPerformingProducts, false)
        ) : (
          <div className=''>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  {[
                    selectedAttribute,
                    'Impressions',
                    'Clicks',
                    'CTR',
                    'Conversions',
                    'Cost',
                    'ROAS',
                    'Action',
                  ].map((header) => (
                    <th
                      key={header}
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {Object.entries(productattributeData)?.map(
                  ([key, value], index) => {
                    const isExpanded = expandedRows[index];

                    return (
                      <React.Fragment key={index}>
                        <tr
                          className='hover:bg-gray-50 cursor-pointer'
                          onClick={() => toggleRow(index)}
                        >
                          <td className='px-6 py-4 text-sm text-gray-500'>
                            {key}
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-500'>
                            {formatNumber(value?.totals.impressions)}
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-500'>
                            {formatNumber(value?.totals.clicks)}
                          </td>

                          <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                            {value.totals.impressions > 0
                              ? (
                                  (value.totals.clicks /
                                    value.totals.impressions) *
                                  100
                                ).toFixed(2)
                              : '0.00'}
                            %
                          </td>

                          <td className='px-6 py-4 text-sm text-gray-500'>
                            {formatNumber(value?.totals.conversions)}
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-500'>
                            {formatCurrency(value?.totals.cost)}
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-500'>
                            {value?.totals.cost
                              ? formatNumber(
                                  (
                                    value?.totals.conversions_value /
                                    value?.totals.cost
                                  ).toFixed(2) * 100
                                )
                              : '0.00'}
                            %
                          </td>

                          <td className='px-6 py-4 text-sm text-gray-500'>
                            <ChevronDown
                              className={`transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className='bg-gray-50'>
                            <td colSpan={12} className='px-6 py-4'>
                              {renderProductTable(value.topProducts, true)}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineDashboard;
