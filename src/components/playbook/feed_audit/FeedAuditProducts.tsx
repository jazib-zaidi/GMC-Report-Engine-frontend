import { useSearchParams } from 'react-router-dom';
import GoBack from '@/components/GoBack';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import ProductStatusTable from './ProductStatusTable';
import ProductMetricsTable from './ProductMetricsTable';

const FeedAuditProducts = () => {
  const { auditFeedData } = useAuth();
  const [searchParams] = useSearchParams();

  const status = searchParams.get('status');
  const methord = searchParams.get('methord');
  const matrix = searchParams.get('matrix');
  const Matfor = searchParams.get('for');
  console.log(matrix);

  if (matrix == 'true') {
    const mappingObj = {
      'Products With Impressions': 'impressions',
      'Clicked Products': 'clicks',
      'Unclicked Products': 'clicks',
      'Products Without Impressions': 'impressions',
    };
    const mappingVal = {
      'Products With Impressions': true,
      'Clicked Products': true,
      'Unclicked Products': false,
      'Products Without Impressions': false,
    };

    const getProductMetrics = (metric, withValue) => {
      return auditFeedData?.productMetrics.filter((product) => {
        const value = Number(product.metrics[metric]) || 0;

        if (withValue) {
          if (value > 0) {
            return product;
          }
        } else {
          if (value == 0) {
            return product;
          }
        }
      });
    };
    console.log(mappingObj[Matfor]);
    console.log(mappingVal[Matfor]);
    const productData = getProductMetrics(
      mappingObj[Matfor],
      mappingVal[Matfor]
    );

    return (
      <div>
        <GoBack />
        <h1 className='text-lg font-semibold my-3'>{Matfor}</h1>
        <ProductMetricsTable products={productData} />
      </div>
    );
  }

  const itemStatus = auditFeedData?.itemStatus?.filter((item) => {
    if (item.productId.includes('online:')) {
      return item;
    }
  });

  const mappingObj = {
    'Display Ads(DA)': 'DisplayAds',
    'Free Listings(FL)': 'SurfacesAcrossGoogle',
    'Shopping Ads(SA)': 'Shopping',
  };

  const newItem = itemStatus.filter((item) =>
    item.destinationStatuses.some(
      (dest) =>
        dest.status !== 'approved' && dest.destination === mappingObj[methord]
    )
  );

  return (
    <div>
      <GoBack />
      <h1 className='text-lg font-semibold my-3'>
        Product Disapprove Marketing Method:({methord})
      </h1>
      <ProductStatusTable products={newItem} />
    </div>
  );
};

export default FeedAuditProducts;
