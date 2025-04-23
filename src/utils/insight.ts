export const aggregateData = (data, groupByAttribute) => {
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
        prevItem?.segments?.title || currentItem?.segments?.title || 'Empty',
      brand:
        prevItem?.segments?.brand || currentItem?.segments?.brand || 'Empty',
      customLabel0:
        prevItem?.segments?.customLabel0 ||
        currentItem?.segments?.customLabel0 ||
        'Empty',
      customLabel1:
        prevItem?.segments?.customLabel1 ||
        currentItem?.segments?.customLabel1 ||
        'Empty',
      customLabel2:
        prevItem?.segments?.customLabel2 ||
        currentItem?.segments?.customLabel2 ||
        'Empty',
      customLabel3:
        prevItem?.segments?.customLabel3 ||
        currentItem?.segments?.customLabel3 ||
        'Empty',
      customLabel4:
        prevItem?.segments?.customLabel4 ||
        currentItem?.segments?.customLabel4 ||
        'Empty',
      productTypeL1:
        prevItem?.segments?.productTypeL1 ||
        currentItem?.segments?.productTypeL1 ||
        'Empty',
      productTypeL2:
        prevItem?.segments?.productTypeL2 ||
        currentItem?.segments?.productTypeL2 ||
        'Empty',
      productTypeL3:
        prevItem?.segments?.productTypeL3 ||
        currentItem?.segments?.productTypeL3 ||
        'Empty',
      productTypeL4:
        prevItem?.segments?.productTypeL4 ||
        currentItem?.segments?.productTypeL4 ||
        'Empty',
      productTypeL5:
        prevItem?.segments?.productTypeL5 ||
        currentItem?.segments?.productTypeL5 ||
        'Empty',
      clickChangeNumber,
      clickChangePercent,
      impressionChangeNumber,
      impressionChangePercent,
      totalConversions: currentItem.metrics.conversions,
      currentImpressions,
      previousImpressions,
      currentClicks,
      previousClicks,
    };
  });
};
