export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

export interface MetricData {
  currentPeriod: number;
  previousPeriod: number;
  change: number;
  changePercentage: number;
}

export interface ProductInsight {
  id: string;
  title: string;
  productType1: string;
  productType2: string;
  brand: string;
  organicImpressions: number;
  organicImpressionsPrevious: number;
  organicImpressionsChange: number;
  organicImpressionsChangePercent: number;
  organicClicks: number;
  organicClicksPrevious: number;
  organicClicksChange: number;
  organicClicksChangePercent: number;
}

export interface BrandInsight {
  brand: string;
  organicImpressions: number;
  organicImpressionsPrevious: number;
  organicImpressionsChange: number;
  organicImpressionsChangePercent: number;
  organicClicks: number;
  organicClicksPrevious: number;
  organicClicksChange: number;
  organicClicksChangePercent: number;
}

export interface ProductTypeInsight {
  productType: string;
  organicImpressions: number;
  organicImpressionsPrevious: number;
  organicImpressionsChange: number;
  organicImpressionsChangePercent: number;
  organicClicks: number;
  organicClicksPrevious: number;
  organicClicksChange: number;
  organicClicksChangePercent: number;
}

export interface ChartDataPoint {
  name: string;
  current: number;
  previous: number;
}

export interface TabRoute {
  id: string;
  label: string;
  path: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  path?: string;
  children?: {
    id: string;
    label: string;
    path: string;
  }[];
}

export interface FilterOptions {
  inventoryOnly: boolean;
  trafficSource: 'all' | 'organic';
}
