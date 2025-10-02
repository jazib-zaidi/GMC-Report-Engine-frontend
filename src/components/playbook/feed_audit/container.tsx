import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  CheckCircle,
  Info,
  MessageCircleWarning,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { PillarDetailTable } from './PillarDetailTable';
import { useAuth } from '@/context/AuthContext';
import PerformanceDashboardSkeleton from '@/components/dashboard/PerformanceDashboardSkeleton';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import GoBack from '@/components/GoBack';

const FeedAudit = () => {
  const { auditFeed, auditFeedData, merchantSelect, setSidebarOpen } =
    useAuth();
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  const [loading, setLoading] = useState(true);
  const prevMerchantId = useRef<string | null>(null);

  const handleSubmit = async (merchantId: string) => {
    setLoading(true);
    await auditFeed(merchantId);
    setLoading(false);
  };

  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const skipFetch = searchParams.get('skipFetch') === 'true';

  useEffect(() => {
    if (!skipFetch && merchantSelect?.merchantId) {
      handleSubmit(merchantSelect.merchantId);
    } else {
      setLoading(false);
    }
  }, [merchantSelect, skipFetch]);

  function formatNumber(value) {
    if (typeof value !== 'number') value = Number(value);
    return new Intl.NumberFormat('en-US').format(value);
  }

  if (loading) {
    return <PerformanceDashboardSkeleton />;
  }

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
  const itemStatus = auditFeedData?.itemStatus?.filter((item) => {
    if (item.productId.includes('online:')) {
      return item;
    }
  });
  function extractOfferId(productId) {
    return productId.split(':').pop();
  }

  const getProductMetricsApproval = (source) => {
    const filtered = itemStatus?.filter((pA) =>
      source.some(
        (mB) =>
          extractOfferId(pA.productId)?.toLowerCase() ===
          mB.segments.offerId?.toLowerCase()
      )
    );

    return filtered;
  };

  const productWithImpressions = getProductMetrics('impressions', true);
  const productWithClicks = getProductMetrics('clicks', true);
  const productWithOutImpressions = getProductMetrics('impressions', false);
  const productWithOutClicks = getProductMetrics('clicks', false);

  const renderApprovalObject = (items) => {
    let shoppingCount = 0;
    let freeListingCount = 0;
    let displayAds = 0;

    items.forEach((item) => {
      item.destinationStatuses.forEach((dest) => {
        if (dest.status === 'approved') {
          if (dest.destination === 'Shopping') shoppingCount++;
          if (dest.destination === 'SurfacesAcrossGoogle') freeListingCount++;
          if (dest.destination === 'DisplayAds') displayAds++;
        }
      });
    });

    const shoppingPct = ((shoppingCount / items.length) * 100).toFixed(2);
    const freeListingPct = ((freeListingCount / items.length) * 100).toFixed(2);
    const displayAdsPct = ((displayAds / items.length) * 100).toFixed(2);

    return { shoppingPct, freeListingPct, displayAdsPct };
  };
  console.log('productWithImpressions', productWithImpressions);
  const impresionApproval = renderApprovalObject(
    getProductMetricsApproval(productWithImpressions)
  );
  const clickApproval = renderApprovalObject(
    getProductMetricsApproval(productWithClicks)
  );
  const nonImpresionApproval = renderApprovalObject(
    getProductMetricsApproval(productWithOutImpressions)
  );
  const nonClickApproval = renderApprovalObject(
    getProductMetricsApproval(productWithOutClicks)
  );

  console.log('ImpresionApproval', impresionApproval);

  let shoppingCount = 0;
  let freeListingCount = 0;
  let remarketingCount = 0;
  let totalShoping = 0;
  let totalfreeListing = 0;
  let totalremarketing = 0;

  itemStatus.forEach((item) => {
    item.destinationStatuses.forEach((dest) => {
      if (dest.status === 'approved') {
        if (dest.destination === 'Shopping') shoppingCount++;
        if (dest.destination === 'SurfacesAcrossGoogle') freeListingCount++;
        if (dest.destination === 'DisplayAds') remarketingCount++;
      }
    });
  });

  console.log(shoppingCount);
  const shoppingPct = ((shoppingCount / itemStatus.length) * 100).toFixed(2);
  const freeListingPct = ((freeListingCount / itemStatus.length) * 100).toFixed(
    2
  );
  const remarketingPct = ((remarketingCount / itemStatus.length) * 100).toFixed(
    2
  );

  console.log(`Shopping Ads: ${shoppingPct}%`);
  console.log(`Free Listings: ${freeListingPct}%`);
  console.log(`Display Ads: ${remarketingPct}%`);

  const accountLevelChecks = [
    {
      name: 'Account Status',
      description:
        'Whether the Merchant Center account is active, has warnings, or is suspended determines if products can serve.',
      response: 'status: ACTIVE',
      variant: 'success' as const,
    },
    {
      name: 'Policy Violations',
      description:
        'Number and type of account-level policy issues such as misrepresentation or prohibited products, which can restrict or suspend the account if unresolved.',
      response: '0 violations',
      variant: 'success' as const,
    },
    {
      name: 'Product Approval',
      description:
        'Overall product approval health: percentage of items approved vs. disapproved. High disapprovals signal systemic data or compliance issues that block visibility',
      response: 'approved:60%\nDisapproved:40%',
      variant: 'error' as const,
    },
    {
      name: 'Feed Freshness',
      description:
        'The timing and success of the last feed upload/fetch. Measures how current your data is in Google. Stale or failed feeds can lead to inaccurate pricing/availability.',
      response: 'lastUpload: 40h ago',
      variant: 'warning' as const,
    },
    {
      name: 'Account Linking',
      description:
        'Whether the Merchant Center account is properly linked to Google Ads. Without linking, Shopping ads cannot run, even if the feed itself is valid.',
      response: 'adsLinks: LINKED',
      variant: 'success' as const,
    },
  ];

  const card = (title, approval, rank, approvalObj) => {
    return (
      <Card className='p-6  border-t-4 border-gray-200 flex flex-col gap-2 transition-all hover:shadow-lg rounded-lg bg-card text-card-foreground group relative overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up'>
        <CardTitle className='text-sm font-medium text-muted-foreground '>
          {title}
        </CardTitle>
        <span className='flex items-center gap-2 font-semibold text-foreground mt-3'>
          <h1 className='font-bold text-3xl text-foreground mb-1'>
            {formatNumber(approval)}{' '}
          </h1>
          <span className='text-sm text-blue-600 flex items-center'>
            {(
              (Number(approval) / auditFeedData?.productMetrics.length) *
              100
            ).toFixed(2)}
            %
          </span>
        </span>
        <span className=' inline-flex w-[57%] items-center border text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full px-3 py-1'>
          FeedRank {rank}
        </span>
        <h1 className='text-foreground text-sm font-medium text-foreground'>
          <span className='text-sm text-gray-500 flex font-normal items-center my-3'>
            Approval Rates
          </span>
          <div className='flex justify-between w-full text-[12px] font-normal text-gray-600'>
            <div className=''>Shopping Ads:</div>
            <div
              className={`flex items-center gap-1 ${
                approvalObj?.shoppingPct >= 95
                  ? 'text-green-500'
                  : approvalObj?.shoppingPct >= 50
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            >
              {approvalObj?.shoppingPct >= 95 ? (
                <CheckCircle size={13} />
              ) : approvalObj?.shoppingPct >= 50 ? (
                <AlertTriangle size={13} />
              ) : (
                <XCircle size={13} />
              )}
              <span>{approvalObj?.shoppingPct}%</span>
            </div>
          </div>

          <div className='flex justify-between w-full text-[12px] font-normal text-gray-600'>
            <div className=''>Free Listings:</div>
            <div
              className={`flex items-center gap-1 ${
                approvalObj?.freeListingPct >= 95
                  ? 'text-green-500'
                  : approvalObj?.freeListingPct >= 50
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            >
              {approvalObj?.freeListingPct >= 95 ? (
                <CheckCircle size={13} />
              ) : approvalObj?.freeListingPct >= 50 ? (
                <AlertTriangle size={13} />
              ) : (
                <XCircle size={13} />
              )}
              <span>{approvalObj?.freeListingPct}%</span>
            </div>
          </div>
          <div className='flex justify-between w-full text-[12px] font-normal text-gray-600'>
            <div className=''>Display Ads:</div>
            <div
              className={`flex items-center gap-1 ${
                approvalObj?.displayAdsPct >= 95
                  ? 'text-green-500'
                  : approvalObj?.displayAdsPct >= 50
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            >
              {approvalObj?.displayAdsPct >= 95 ? (
                <CheckCircle size={13} />
              ) : approvalObj?.displayAdsPct >= 50 ? (
                <AlertTriangle size={13} />
              ) : (
                <XCircle size={13} />
              )}
              <span>{approvalObj?.displayAdsPct}%</span>
            </div>
          </div>
        </h1>
        <Button className='w-full mt-2' variant='outline'>
          <Link to={`products?status=all&methord=all&matrix=true&for=${title}`}>
            View Products
          </Link>
        </Button>
      </Card>
    );
  };

  console.log(`Shopping Ads: ${shoppingPct}%`);
  console.log(`Free Listings: ${freeListingPct}%`);
  console.log(`DisplayAds: ${remarketingPct}%`);
  const summaries = [
    { destination: 'Shopping Ads', approvalRate: `${shoppingPct}%` },
    { destination: 'Free Listings', approvalRate: `${freeListingPct}%` },
    { destination: 'Display Ads', approvalRate: `${remarketingPct}%` },
  ];

  const rankCard = (title, value, iconUrl, variant, isProduct = false) => {
    const variantStyles = {
      primary: 'bg-blue-100 text-blue-500',
      success: 'bg-green-100 text-green-500',
      warning: 'bg-warning/10 text-warning',
    };
    return (
      <Card
        className={`transition-all hover:shadow-lg h-full rounded-lg  text-card-foreground group relative overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up  ${
          isProduct ? 'p-[18px]' : 'p-6'
        }`}
      >
        {/* <div
          data-lov-id='src/components/MetricCard.tsx:26:6'
          data-lov-name='div'
          data-component-path='src/components/MetricCard.tsx'
          data-component-line='26'
          data-component-file='MetricCard.tsx'
          data-component-name='div'
          data-component-content='%7B%7D'
          class='absolute bg-blue-50 inset-0 bg-gradient-to-br from-primary to-primary-light opacity-5 transition-opacity group-hover:opacity-10'
        ></div> */}
        <div className='flex items-start justify-between'>
          <div className='space-y-2 w-full'>
            <p className={`text-sm font-medium text-muted-foreground`}>
              {title}
            </p>
            {isProduct ? (
              <div className='flex  justify-between  gap-x-1'>
                {summaries.map((s, i) => (
                  <Link
                    key={i}
                    className='  w-full text-[10px] transition-all'
                    to={`products?status=all&methord=${s.destination}&matrix=false`}
                  >
                    <div
                      className={` group flex flex-col text-center border  p-2 rounded-md w-full hover:border-blue-500 hover:bg-blue-50 hover:shadow-md ${
                        s.approvalRate === '100.00%' ? 'bg-white' : 'bg-white'
                      }`}
                    >
                      <span className='text-[13px] text-gray-900 flex items-center justify-center gap-1'>
                        {s.destination}{' '}
                      </span>
                      <span className={`text-xl font-semibold text-gray-700 `}>
                        {s.approvalRate}
                      </span>
                      <span className='text-[10px] text-blue-600 group-hover:underline transition-all'>
                        View Approval
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className='text-4xl font-semibold text-gray-700'>{value}</p>
            )}
          </div>
          {isProduct ? (
            ''
          ) : (
            <div className={`rounded-xl  `}>
              <img src={iconUrl} alt={title} className='w-32 ' />
            </div>
          )}
        </div>
      </Card>
    );
  };

  const QualityPillars = (title, description, rank) => {
    return (
      <Card className='p-6 flex flex-col gap-2 transition-all hover:shadow-lg'>
        <CardTitle className='flex text-lg items-center gap-3 mb-2  text-foreground'>
          {title}
        </CardTitle>
        <h1 className='text-foreground text-sm font-medium text-foreground'>
          {description}
        </h1>
        <h1 className='text-foreground text-md font-bold text-foreground'>
          FeedRank {rank}
        </h1>
        <Button
          onClick={() => setSelectedPillar('Account-Level')}
          className='w-full mt-2 text-blue-600'
          variant='outline'
        >
          View Details
        </Button>
      </Card>
    );
  };

  if (selectedPillar === 'Account-Level') {
    return (
      <div className=''>
        <h1 className='text-3xl font-bold text-foreground '>
          Google Shopping Audit
        </h1>
        <main className='container mx-auto px-6 py-8'>
          <PillarDetailTable
            title='Account-Level'
            feedRank='4%'
            checks={accountLevelChecks}
            onBack={() => setSelectedPillar(null)}
          />
        </main>
      </div>
    );
  }

  return (
    <div>
      <Button variant='outline'>
        <Link to='/playbook'> &larr; Go To Playbook</Link>
      </Button>
      <div className='flex justify-between mb-10 mt-8'>
        <h1 className='text-3xl font-medium text-gray-900'>
          Google Shopping Audit
        </h1>
        <div className='flex gap-x-3 items-center'>
          <p className='text-sm text-muted-foreground'>
            Date:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <Button variant='outline'>View Past Audit's</Button>
          <Button variant='default'>Save As PDF</Button>
        </div>
      </div>

      <div className='grid grid-cols-7 gap-x-2 mt-5'>
        {/* Left card (normal size) */}
        <div className='col-span-2'>
          {rankCard(
            'FeedRank',
            '80%',
            'https://www.gstatic.com/merchants/tasks/card_illustration/increase_campaign_budget.svg',
            'primary'
          )}
        </div>

        {/* Middle card (bigger, spans 3 columns) */}
        <div className='col-span-3'>
          {rankCard(
            'Product Approval',
            '90%',
            'https://www.gstatic.com/merchants/tasks/card_illustration/increase_campaign_budget.svg',
            'success',
            true
          )}
        </div>

        {/* Right card (normal size) */}
        <div className='col-span-2'>
          {rankCard(
            'Account Compliance',
            '90%',
            'https://www.gstatic.com/merchants/tasks/card_illustration/news_and_tips.svg',
            'success'
          )}
        </div>
      </div>
      <div className='mt-5 mb-8 text-xl'>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl font-medium text-gray-900'>
            Product Performance Summary
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className='h-4 w-4 text-muted-foreground' />
              </TooltipTrigger>
              <TooltipContent>
                <p className='max-w-xs'>
                  We show the last 30 days to provide context, since the product
                  data status reflects today's snapshot.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className='text-sm text-muted-foreground'>Last 30 days</p>
      </div>
      <div className='grid grid-cols-4 gap-x-3'>
        {card(
          'Products With Impressions',
          productWithImpressions.length,
          '70%',
          impresionApproval
        )}
        {card(
          'Clicked Products',
          productWithClicks.length,
          '70%',
          clickApproval
        )}
        {card(
          'Unclicked Products',
          productWithOutClicks.length,
          '70%',
          nonClickApproval
        )}
        {card(
          'Products Without Impressions',
          productWithOutImpressions.length,
          '70%',
          nonImpresionApproval
        )}
      </div>
      <div className='mt-5 mb-8 text-xl'>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl font-semibold text-foreground'>
            FeedRank Quality Pillars
          </h2>
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className='h-4 w-4 text-muted-foreground' />
              </TooltipTrigger>
              <TooltipContent>
                <p className='max-w-xs'>
                  We show the last 30 days to provide context, since the product
                  data status reflects today's snapshot.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
        </div>
      </div>
      <div className='grid grid-cols-3 gap-3'>
        {QualityPillars(
          'Account-Level',
          'Overall Merchant Center health — suspensions, policies, feed sync, and account links.',
          '70%'
        )}
        {QualityPillars(
          'Basic Data ',
          'The essential attributes Google requires for products to serve (IDs, titles, prices, images, identifiers).',
          '70%'
        )}
        {QualityPillars(
          'Categorization',
          'Ensures products are correctly classified into Google’s taxonomy for accurate matching.',
          '70%'
        )}
        {QualityPillars(
          'Data Enrichment',
          'Additional attributes that enhance visibility and filtering (color, size, material, gender, etc.)',
          '70%'
        )}
        {QualityPillars(
          'Search Optimization ',
          'How well titles and product types are structured to drive clicks and conversions.',
          '70%'
        )}
        {QualityPillars(
          'Promotions',
          'Validation that promotions are properly set up and aligned with product data.',
          '70%'
        )}
        {QualityPillars(
          'Shipping & Delivery ',
          'Checks that shipping costs, delivery times, and availability are accurate.',
          '70%'
        )}
        {QualityPillars(
          'Reviews',
          'Measures the presence, volume, and quality of product reviews to build trust and improve CTR.',
          '70%'
        )}
      </div>
    </div>
  );
};

export default FeedAudit;
