import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
export const aggregateData = (data, groupByAttribute) => {
  if (groupByAttribute == 'offerId') {
  }

  return data.reduce((acc, item) => {
    const key = item?.segments?.[groupByAttribute];
    if (!key) return acc;

    const metrics = item.metrics || {};
    const currentClicks = parseInt(metrics.clicks || 0);
    const currentImpressions = parseInt(metrics.impressions || 0);
    const currentConversions = parseInt(metrics.conversions || 0);

    if (!acc[key]) {
      acc[key] = {
        [groupByAttribute]: key,
        metrics: {
          clicks: 0,
          impressions: 0,
          conversions: 0,
        },
        segments: item.segments,
      };
    }

    acc[key].metrics.clicks += isNaN(currentClicks) ? 0 : currentClicks;
    acc[key].metrics.impressions += isNaN(currentImpressions)
      ? 0
      : currentImpressions;
    acc[key].metrics.conversions += isNaN(currentConversions)
      ? 0
      : currentConversions;
    acc[key].segments = { ...acc[key].segments, ...item.segments };
    return acc;
  }, {});
};

export const calculateChanges = (
  currentData,
  previousData,
  groupByAttribute
) => {
  const previousMap = previousData.reduce((acc, item) => {
    const key = item?.segments?.[groupByAttribute];
    if (key) acc[key] = item;
    return acc;
  }, {});

  return currentData.map((currentItem) => {
    const key = currentItem[groupByAttribute];

    const prevItem = previousMap[key];

    const currentClicks = currentItem.metrics.clicks;
    const previousClicks = parseInt(prevItem?.metrics?.clicks || 0);
    const clickChangeNumber = currentClicks - previousClicks;
    const clickChangePercent =
      previousClicks === 0 ? 100 : (clickChangeNumber / previousClicks) * 100;

    const currentImpressions = currentItem.metrics.impressions;
    const previousImpressions = parseInt(prevItem?.metrics?.impressions || 0);
    const impressionChangeNumber = currentImpressions - previousImpressions;
    const impressionChangePercent =
      previousImpressions === 0
        ? 100
        : (impressionChangeNumber / previousImpressions) * 100;

    return {
      [groupByAttribute]: key,
      title:
        currentItem?.segments?.title || prevItem?.segments?.title || 'Empty',
      brand:
        currentItem?.segments?.brand || prevItem?.segments?.brand || 'Empty',
      customLabel0:
        currentItem?.segments?.customLabel0 ||
        prevItem?.segments?.customLabel0 ||
        'Empty',
      customLabel1:
        currentItem?.segments?.customLabel1 ||
        prevItem?.segments?.customLabel1 ||
        'Empty',
      customLabel2:
        currentItem?.segments?.customLabel2 ||
        prevItem?.segments?.customLabel2 ||
        'Empty',
      customLabel3:
        currentItem?.segments?.customLabel3 ||
        prevItem?.segments?.customLabel3 ||
        'Empty',
      customLabel4:
        currentItem?.segments?.customLabel4 ||
        prevItem?.segments?.customLabel4 ||
        'Empty',
      productTypeL1:
        currentItem?.segments?.productTypeL1 ||
        prevItem?.segments?.productTypeL1 ||
        'Empty',
      productTypeL2:
        currentItem?.segments?.productTypeL2 ||
        prevItem?.segments?.productTypeL2 ||
        'Empty',
      productTypeL3:
        currentItem?.segments?.productTypeL3 ||
        prevItem?.segments?.productTypeL3 ||
        'Empty',
      productTypeL4:
        currentItem?.segments?.productTypeL4 ||
        prevItem?.segments?.productTypeL4 ||
        'Empty',
      productTypeL5:
        currentItem?.segments?.productTypeL5 ||
        prevItem?.segments?.productTypeL5 ||
        'Empty',

      clickChangeNumber,
      clickChangePercent: clickChangePercent.toFixed(1),
      impressionChangeNumber,
      impressionChangePercent: impressionChangePercent.toFixed(1),
      totalConversions: currentItem.metrics.conversions,
      currentImpressions,
      previousImpressions,
      currentClicks,
      previousClicks,
    };
  });
};

const columns = [
  {
    header: 'Item ID',
    accessorKey: 'Item ID',
  },
  {
    header: 'Title',
    accessorKey: 'Title',
  },
  {
    header: 'Description',
    accessorKey: 'Description',
  },
  {
    header: 'Focus Keyword',
    accessorKey: 'Focus Keyword',
  },
  {
    header: 'Product Type (1st Level)',
    accessorKey: 'Product Type (1st Level)',
  },
  {
    header: 'Product Type (2nd Level)',
    accessorKey: 'Product Type (2nd Level)',
  },
  {
    header: 'Product Type (3rd Level)',
    accessorKey: 'Product Type (3rd Level)',
  },
  {
    header: 'Product Type (4th Level)',
    accessorKey: 'Product Type (4th Level)',
  },
  {
    header: 'Product Type (5th Level)',
    accessorKey: 'Product Type (5th Level)',
  },
  {
    header: 'Google Product Category 1',
    accessorKey: 'Google Product Category 1',
  },
  {
    header: 'Google Product Category 2',
    accessorKey: 'Google Product Category 2',
  },
  {
    header: 'Google Product Category 3',
    accessorKey: 'Google Product Category 3',
  },
  {
    header: 'Google Product Category 4',
    accessorKey: 'Google Product Category 4',
  },
  {
    header: 'Google Product Category 5',
    accessorKey: 'Google Product Category 5',
  },
];

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
      {value.toFixed(2)} %
    </span>
  );
};
