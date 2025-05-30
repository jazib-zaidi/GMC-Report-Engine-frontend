import { MetricData, ProductInsight, BrandInsight, ProductTypeInsight, ChartDataPoint } from '../types';

export const impressionsData: MetricData = {
  currentPeriod: 874529,
  previousPeriod: 645231,
  change: 229298,
  changePercentage: 35.54,
};

export const clicksData: MetricData = {
  currentPeriod: 72453,
  previousPeriod: 56129,
  change: 16324,
  changePercentage: 29.08,
};

export const impressionsChartData: ChartDataPoint[] = [
  { name: 'Mar', current: 52145, previous: 41253 },
  { name: 'Apr', current: 65432, previous: 48123 },
  { name: 'May', current: 74321, previous: 52145 },
  { name: 'Jun', current: 85432, previous: 59234 },
  { name: 'Jul', current: 92543, previous: 63125 },
  { name: 'Aug', current: 89543, previous: 62452 },
  { name: 'Sep', current: 95432, previous: 68543 },
  { name: 'Oct', current: 98543, previous: 72534 },
  { name: 'Nov', current: 105432, previous: 75432 },
  { name: 'Dec', current: 112543, previous: 82543 },
  { name: 'Jan', current: 98234, previous: 73215 },
  { name: 'Feb', current: 94929, previous: 68632 },
];

export const clicksChartData: ChartDataPoint[] = [
  { name: 'Mar', current: 4532, previous: 3521 },
  { name: 'Apr', current: 5621, previous: 4123 },
  { name: 'May', current: 6123, previous: 4532 },
  { name: 'Jun', current: 7234, previous: 5123 },
  { name: 'Jul', current: 7845, previous: 5632 },
  { name: 'Aug', current: 7532, previous: 5423 },
  { name: 'Sep', current: 8124, previous: 5932 },
  { name: 'Oct', current: 8534, previous: 6123 },
  { name: 'Nov', current: 9123, previous: 6532 },
  { name: 'Dec', current: 9534, previous: 7123 },
  { name: 'Jan', current: 8532, previous: 6324 },
  { name: 'Feb', current: 8223, previous: 6023 },
];

export const productInsights: ProductInsight[] = [
  {
    id: 'P001',
    title: 'Wireless Gaming Headset',
    productType1: 'Electronics',
    productType2: 'Gaming',
    brand: 'TechMaster',
    organicImpressions: 12532,
    organicImpressionsPrevious: 8743,
    organicImpressionsChange: 3789,
    organicImpressionsChangePercent: 43.34,
    organicClicks: 1324,
    organicClicksPrevious: 894,
    organicClicksChange: 430,
    organicClicksChangePercent: 48.10,
  },
  {
    id: 'P002',
    title: 'Ergonomic Office Chair',
    productType1: 'Furniture',
    productType2: 'Office',
    brand: 'ComfortPlus',
    organicImpressions: 9842,
    organicImpressionsPrevious: 7621,
    organicImpressionsChange: 2221,
    organicImpressionsChangePercent: 29.14,
    organicClicks: 876,
    organicClicksPrevious: 654,
    organicClicksChange: 222,
    organicClicksChangePercent: 33.94,
  },
  {
    id: 'P003',
    title: 'Smartphone Stand with Charger',
    productType1: 'Electronics',
    productType2: 'Mobile Accessories',
    brand: 'TechMaster',
    organicImpressions: 15432,
    organicImpressionsPrevious: 12543,
    organicImpressionsChange: 2889,
    organicImpressionsChangePercent: 23.03,
    organicClicks: 1823,
    organicClicksPrevious: 1432,
    organicClicksChange: 391,
    organicClicksChangePercent: 27.30,
  },
  {
    id: 'P004',
    title: 'Stainless Steel Water Bottle',
    productType1: 'Kitchen',
    productType2: 'Drinkware',
    brand: 'EcoLife',
    organicImpressions: 8432,
    organicImpressionsPrevious: 5321,
    organicImpressionsChange: 3111,
    organicImpressionsChangePercent: 58.47,
    organicClicks: 765,
    organicClicksPrevious: 432,
    organicClicksChange: 333,
    organicClicksChangePercent: 77.08,
  },
  {
    id: 'P005',
    title: 'Mechanical Keyboard',
    productType1: 'Electronics',
    productType2: 'Computing',
    brand: 'TechMaster',
    organicImpressions: 11432,
    organicImpressionsPrevious: 8721,
    organicImpressionsChange: 2711,
    organicImpressionsChangePercent: 31.09,
    organicClicks: 987,
    organicClicksPrevious: 765,
    organicClicksChange: 222,
    organicClicksChangePercent: 29.02,
  },
  {
    id: 'P006',
    title: 'Yoga Mat',
    productType1: 'Sports',
    productType2: 'Fitness',
    brand: 'ActiveLife',
    organicImpressions: 7865,
    organicImpressionsPrevious: 6321,
    organicImpressionsChange: 1544,
    organicImpressionsChangePercent: 24.43,
    organicClicks: 654,
    organicClicksPrevious: 521,
    organicClicksChange: 133,
    organicClicksChangePercent: 25.53,
  },
  {
    id: 'P007',
    title: 'Smart Watch',
    productType1: 'Electronics',
    productType2: 'Wearables',
    brand: 'TechMaster',
    organicImpressions: 16543,
    organicImpressionsPrevious: 11234,
    organicImpressionsChange: 5309,
    organicImpressionsChangePercent: 47.26,
    organicClicks: 1432,
    organicClicksPrevious: 987,
    organicClicksChange: 445,
    organicClicksChangePercent: 45.09,
  },
];

export const brandInsights: BrandInsight[] = [
  {
    brand: 'TechMaster',
    organicImpressions: 55939,
    organicImpressionsPrevious: 41241,
    organicImpressionsChange: 14698,
    organicImpressionsChangePercent: 35.64,
    organicClicks: 5566,
    organicClicksPrevious: 4078,
    organicClicksChange: 1488,
    organicClicksChangePercent: 36.49,
  },
  {
    brand: 'ComfortPlus',
    organicImpressions: 9842,
    organicImpressionsPrevious: 7621,
    organicImpressionsChange: 2221,
    organicImpressionsChangePercent: 29.14,
    organicClicks: 876,
    organicClicksPrevious: 654,
    organicClicksChange: 222,
    organicClicksChangePercent: 33.94,
  },
  {
    brand: 'EcoLife',
    organicImpressions: 8432,
    organicImpressionsPrevious: 5321,
    organicImpressionsChange: 3111,
    organicImpressionsChangePercent: 58.47,
    organicClicks: 765,
    organicClicksPrevious: 432,
    organicClicksChange: 333,
    organicClicksChangePercent: 77.08,
  },
  {
    brand: 'ActiveLife',
    organicImpressions: 7865,
    organicImpressionsPrevious: 6321,
    organicImpressionsChange: 1544,
    organicImpressionsChangePercent: 24.43,
    organicClicks: 654,
    organicClicksPrevious: 521,
    organicClicksChange: 133,
    organicClicksChangePercent: 25.53,
  },
];

export const productType1Insights: ProductTypeInsight[] = [
  {
    productType: 'Electronics',
    organicImpressions: 55939,
    organicImpressionsPrevious: 41241,
    organicImpressionsChange: 14698,
    organicImpressionsChangePercent: 35.64,
    organicClicks: 5566,
    organicClicksPrevious: 4078,
    organicClicksChange: 1488,
    organicClicksChangePercent: 36.49,
  },
  {
    productType: 'Furniture',
    organicImpressions: 9842,
    organicImpressionsPrevious: 7621,
    organicImpressionsChange: 2221,
    organicImpressionsChangePercent: 29.14,
    organicClicks: 876,
    organicClicksPrevious: 654,
    organicClicksChange: 222,
    organicClicksChangePercent: 33.94,
  },
  {
    productType: 'Kitchen',
    organicImpressions: 8432,
    organicImpressionsPrevious: 5321,
    organicImpressionsChange: 3111,
    organicImpressionsChangePercent: 58.47,
    organicClicks: 765,
    organicClicksPrevious: 432,
    organicClicksChange: 333,
    organicClicksChangePercent: 77.08,
  },
  {
    productType: 'Sports',
    organicImpressions: 7865,
    organicImpressionsPrevious: 6321,
    organicImpressionsChange: 1544,
    organicImpressionsChangePercent: 24.43,
    organicClicks: 654,
    organicClicksPrevious: 521,
    organicClicksChange: 133,
    organicClicksChangePercent: 25.53,
  },
];

export const productType2Insights: ProductTypeInsight[] = [
  {
    productType: 'Gaming',
    organicImpressions: 12532,
    organicImpressionsPrevious: 8743,
    organicImpressionsChange: 3789,
    organicImpressionsChangePercent: 43.34,
    organicClicks: 1324,
    organicClicksPrevious: 894,
    organicClicksChange: 430,
    organicClicksChangePercent: 48.10,
  },
  {
    productType: 'Office',
    organicImpressions: 9842,
    organicImpressionsPrevious: 7621,
    organicImpressionsChange: 2221,
    organicImpressionsChangePercent: 29.14,
    organicClicks: 876,
    organicClicksPrevious: 654,
    organicClicksChange: 222,
    organicClicksChangePercent: 33.94,
  },
  {
    productType: 'Mobile Accessories',
    organicImpressions: 15432,
    organicImpressionsPrevious: 12543,
    organicImpressionsChange: 2889,
    organicImpressionsChangePercent: 23.03,
    organicClicks: 1823,
    organicClicksPrevious: 1432,
    organicClicksChange: 391,
    organicClicksChangePercent: 27.30,
  },
  {
    productType: 'Drinkware',
    organicImpressions: 8432,
    organicImpressionsPrevious: 5321,
    organicImpressionsChange: 3111,
    organicImpressionsChangePercent: 58.47,
    organicClicks: 765,
    organicClicksPrevious: 432,
    organicClicksChange: 333,
    organicClicksChangePercent: 77.08,
  },
  {
    productType: 'Computing',
    organicImpressions: 11432,
    organicImpressionsPrevious: 8721,
    organicImpressionsChange: 2711,
    organicImpressionsChangePercent: 31.09,
    organicClicks: 987,
    organicClicksPrevious: 765,
    organicClicksChange: 222,
    organicClicksChangePercent: 29.02,
  },
  {
    productType: 'Fitness',
    organicImpressions: 7865,
    organicImpressionsPrevious: 6321,
    organicImpressionsChange: 1544,
    organicImpressionsChangePercent: 24.43,
    organicClicks: 654,
    organicClicksPrevious: 521,
    organicClicksChange: 133,
    organicClicksChangePercent: 25.53,
  },
  {
    productType: 'Wearables',
    organicImpressions: 16543,
    organicImpressionsPrevious: 11234,
    organicImpressionsChange: 5309,
    organicImpressionsChangePercent: 47.26,
    organicClicks: 1432,
    organicClicksPrevious: 987,
    organicClicksChange: 445,
    organicClicksChangePercent: 45.09,
  },
];

export const gmcInsights: ProductTypeInsight[] = [
  {
    productType: 'Performance Data',
    organicImpressions: 45432,
    organicImpressionsPrevious: 32543,
    organicImpressionsChange: 12889,
    organicImpressionsChangePercent: 39.61,
    organicClicks: 3456,
    organicClicksPrevious: 2345,
    organicClicksChange: 1111,
    organicClicksChangePercent: 47.38,
  },
  {
    productType: 'Feed Operations',
    organicImpressions: 56789,
    organicImpressionsPrevious: 42345,
    organicImpressionsChange: 14444,
    organicImpressionsChangePercent: 34.11,
    organicClicks: 4567,
    organicClicksPrevious: 3456,
    organicClicksChange: 1111,
    organicClicksChangePercent: 32.15,
  },
];