import { useSearchParams } from 'react-router-dom';
import GoBack from '@/components/GoBack';
import { useAuth } from '@/context/AuthContext';
import React, { useEffect } from 'react';
import ProductStatusTable from './ProductStatusTable';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const FeedAuditProducts = () => {
  const { auditFeedData, setSidebarOpen } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  const status = searchParams.get('status');
  const methord = searchParams.get('methord');
  const matrix = searchParams.get('matrix');
  const Matfor = searchParams.get('for');

  if (matrix == 'true') {
    const itemStatus = auditFeedData?.itemStatus?.filter((item) => {
      if (item.productId.includes('online:')) {
        return item;
      }
    });

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

    const productData = getProductMetrics(
      mappingObj[Matfor],
      mappingVal[Matfor]
    );

    function extractOfferId(productId) {
      return productId.split(':').pop();
    }

    const getProductMetricsApproval = (source: any[]) => {
      return source
        .map((mB) => {
          const match = itemStatus?.find(
            (pA) =>
              extractOfferId(pA.productId)?.toLowerCase() ===
              mB.segments.offerId?.toLowerCase()
          );

          if (match) {
            // merge metrics INTO the itemStatus object
            return {
              ...match,
              ...mB.metrics, // merge clicks, impressions, etc
            };
          }

          return null; // skip if no match
        })
        .filter(Boolean); // remove nulls
    };

    return (
      <div>
        <Button
          variant='link'
          className='px-0'
          onClick={() => navigate('/playbook/feed-audit?skipFetch=true')}
        >
          &larr; Back to Feed Audit
        </Button>

        <h1 className='text-lg font-semibold my-3'>{Matfor}</h1>
        <ProductStatusTable
          products={getProductMetricsApproval(productData)}
          method={status}
          matrix={true}
        />
      </div>
    );
  }

  const itemStatus = auditFeedData?.itemStatus?.filter((item) => {
    if (item.productId.includes('online:')) {
      return item;
    }
  });

  const mappingObj = {
    'Display Ads': 'DisplayAds',
    'Free Listings': 'SurfacesAcrossGoogle',
    'Shopping Ads': 'Shopping',
  };
  let newItem;

  if (status == 'all' && methord == 'all') {
    newItem = itemStatus;
  } else {
    newItem = itemStatus.filter((item) =>
      item.destinationStatuses.some(
        (dest) => dest.destination === mappingObj[methord]
      )
    );
  }

  return (
    <div>
      <Button
        variant='link'
        className='px-0'
        onClick={() => navigate('/playbook/feed-audit?skipFetch=true')}
      >
        &larr; Back to Feed Audit
      </Button>
      <h1 className='text-lg font-semibold my-3'>Product</h1>
      <ProductStatusTable
        products={newItem}
        method={mappingObj[methord]}
        matrix={false}
      />
    </div>
  );
};

export default FeedAuditProducts;
