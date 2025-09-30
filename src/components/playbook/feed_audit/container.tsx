import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CheckCircle, Info, TrendingUp, Sprout } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { PillarDetailTable } from './PillarDetailTable';
import { useAuth } from '@/context/AuthContext';
import PerformanceDashboardSkeleton from '@/components/dashboard/PerformanceDashboardSkeleton';
import { Link } from 'react-router-dom';

const FeedAudit = () => {
  const { auditFeed, auditFeedData } = useAuth();
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const handleSubmit = async () => {
    setLoading(true);
    await auditFeed();
    setLoading(false);
  };
  function formatNumber(value) {
    if (typeof value !== 'number') value = Number(value);
    return new Intl.NumberFormat('en-US').format(value);
  }
  useEffect(() => {
    if (auditFeedData?.productMetrics.length > 0) {
      setLoading(false);
    } else {
      handleSubmit();
    }
  }, []);
  console.log('auditFeedData', auditFeedData);
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
    const filtered = itemStatus.filter((pA) =>
      source.some((mB) => extractOfferId(pA.productId) === mB.segments.offerId)
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

  console.log(`Shopping Ads(SA): ${shoppingPct}%`);
  console.log(`Free Listings(FL): ${freeListingPct}%`);
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
      <Card className='p-6  border-t-4 border-gray-200 flex flex-col gap-2 transition-all hover:shadow-lg'>
        <CardTitle className='flex items-center gap-3 mb-2  text-foreground'>
          {title}
        </CardTitle>
        <h1 className='font-bold text-3xl text-foreground mb-1'>{approval}</h1>
        <h1 className='text-foreground text-sm font-medium text-foreground'>
          FeedRank {rank}
        </h1>
        <h1 className='text-foreground text-sm font-medium text-foreground'>
          Approval
          <ul className='list-disc pl-5 space-y-1 text-sm text-gray-700 text-[12px]'>
            <li className=''>Shopping Ads(SA):{approvalObj?.shoppingPct}%</li>
            <li>Free Listings(FL):{approvalObj?.freeListingPct}%</li>
            <li>Display Ads(DA):{approvalObj?.displayAdsPct}%</li>
          </ul>
        </h1>
        <Button className='w-full mt-2' variant='outline'>
          <Link to={`products?status=-&methord=-&matrix=true&for=${title}`}>
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
    { destination: 'Shopping Ads(SA)', approvalRate: `${shoppingPct}%` },
    { destination: 'Free Listings(FL)', approvalRate: `${freeListingPct}%` },
    { destination: 'Display Ads(DA)', approvalRate: `${remarketingPct}%` },
  ];

  const rankCard = (title, value, Icon, variant, isProduct = false) => {
    const variantStyles = {
      primary: 'bg-blue-100 text-blue-500',
      success: 'bg-green-100 text-green-500',
      warning: 'bg-warning/10 text-warning',
    };
    return (
      <Card
        className={`transition-all hover:shadow-lg h-full ${
          isProduct ? 'p-[18px]' : 'p-6'
        }`}
      >
        <div className='flex items-start justify-between'>
          <div className='space-y-2 w-full'>
            <p className={`text-lg font-medium text-muted-foreground`}>
              {title}
            </p>
            {isProduct ? (
              <div className='flex  justify-between  gap-x-1'>
                {summaries.map((s, i) => (
                  <div
                    key={i}
                    className={`flex flex-col text-center border  p-2 rounded-md w-full ${
                      s.approvalRate === '100.00%'
                        ? 'bg-[#fcfffc]'
                        : 'bg-[#fffafa]'
                    }`}
                  >
                    <span className='text-[13px] text-gray-900'>
                      {s.destination}
                    </span>
                    <span className='text-lg font-semibold'>
                      {s.approvalRate}
                    </span>
                    {s.approvalRate === '100.00%' ? (
                      <span className='text-[12px] text-green-600'>
                        All Approved
                      </span>
                    ) : (
                      <Link
                        className='text-[12px] text-blue-600 hover:underline'
                        to={`products?status=Disapproval&methord=${s.destination}&matrix=false`}
                      >
                        View Disapproval
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-3xl font-bold text-foreground '>{value}</p>
            )}
          </div>
          {isProduct ? (
            ''
          ) : (
            <div className={`rounded-xl p-3 ${variantStyles[variant]}`}>
              <Icon className='h-6 w-6' />
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
      <div className='flex justify-between mb-10 mt-8'>
        <h1 className='text-3xl font-bold text-foreground '>
          Google Shopping Audit
        </h1>
        <div className='flex gap-x-3 items-center'>
          <p className='text-sm text-muted-foreground'> Date : Sep 30, 2025</p>
          <Button variant='outline'>View Past Audit's</Button>
          <Button variant='default'>Save As PDF</Button>
        </div>
      </div>
      <div className='grid grid-cols-7 gap-x-2 mt-5'>
        {/* Left card (normal size) */}
        <div className='col-span-2'>
          {rankCard('FeedRank', '80%', TrendingUp, 'primary')}
        </div>

        {/* Middle card (bigger, spans 3 columns) */}
        <div className='col-span-3'>
          {rankCard('Product Approval', '90%', CheckCircle, 'success', true)}
        </div>

        {/* Right card (normal size) */}
        <div className='col-span-2'>
          {rankCard('Account Compliance', '90%', Sprout, 'success')}
        </div>
      </div>
      <div className='mt-5 mb-8 text-xl'>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl font-semibold text-foreground'>
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
          formatNumber(productWithImpressions.length),
          '70%',
          impresionApproval
        )}
        {card(
          'Clicked Products',
          formatNumber(productWithClicks.length),
          '70%',
          clickApproval
        )}
        {card(
          'Unclicked Products',
          formatNumber(productWithOutClicks.length),
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
