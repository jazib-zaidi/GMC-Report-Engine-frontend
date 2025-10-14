import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { PillarDetailTable } from './PillarDetailTable';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { exportElementToPdf } from '@/utils/exportPdf';

const FeedAudit = () => {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const skipFetch = searchParams.get('skipFetch') === 'true';
  const {
    auditFeedData,
    auditFeed,
    merchantSelect,
    setAuditFeedData,
    fetchProductsPerformanceSummary,
    productsPerformanceSummary,
    productsPerformanceLoading,
  } = useAuth() as any;
  useEffect(() => {
    // When merchant account changes, optionally skip fetch based on query param
    if (!merchantSelect?.merchantId || skipFetch) return;
    setAuditFeedData(null);
    // Fire both API calls in parallel; keep card loading until performance summary arrives
    auditFeed(merchantSelect.merchantId || '');
    fetchProductsPerformanceSummary(String(merchantSelect.merchantId));
  }, [merchantSelect?.merchantId, skipFetch]);
  const accountstatuses: any[] = auditFeedData?.accountstatuses?.products || [];

  const allCountrys: string[] = (
    auditFeedData?.accountstatuses?.products || []
  ).map((s: any) => s.country as string);
  const uniqueCountrys: string[] = Array.from(
    new Set(allCountrys.filter(Boolean))
  );
  const countryOptions: string[] = ['All', ...uniqueCountrys];
  // Helper: colored badge based on percentage
  console.log(countryOptions);
  const genericColorBadge = (
    percentage: number,
    size: 'small' | 'large' | 'middle'
  ) => {
    const badgeSize =
      size === 'large'
        ? 'text-[40px]'
        : size === 'middle'
        ? 'text-[24px] font-bold '
        : 'text-[14px] font-semibold';

    const bgColor =
      percentage >= 90
        ? 'bg-[#edfcf3] text-[#23c45f]'
        : percentage >= 70
        ? 'bg-[#fffbe8] text-[#f39e0c]'
        : 'bg-[#fef1f1] text-[#ef4443]';
    return (
      <span
        className={`inline-flex items-center font-medium  p-1 my-1 px-3 rounded-full   ${badgeSize} ${bgColor}`}
      >
        {percentage}%
      </span>
    );
  };

  // Helper: number formatting
  function formatNumber(value: number | string) {
    const num = typeof value === 'number' ? value : Number(value);
    return new Intl.NumberFormat('en-US').format(num);
  }

  // Compact formatter for K/M/B style
  function formatCompact(value: number | string) {
    const num = typeof value === 'number' ? value : Number(value);
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  }

  // Hardcoded snapshot date
  const DATE_LABEL = 'Oct 14, 2025';

  // Products Performance Summary values (fallback to 0 if loading or missing)
  const TOTAL_PRODUCTS = productsPerformanceSummary?.totalItems ?? 0;
  const productWithImpressions =
    productsPerformanceSummary?.summary?.productsWithImpressions?.count ?? 0;
  const productWithClicks =
    productsPerformanceSummary?.summary?.productsWithClicks?.count ?? 0;
  const productWithOutImpressions =
    productsPerformanceSummary?.summary?.productsWithoutImpressions?.count ?? 0;
  const productWithOutClicks =
    productsPerformanceSummary?.summary?.productsWithoutClicks?.count ?? 0;

  // Hardcoded approval breakdowns (percentages as strings without %)
  const impresionApproval = {
    shoppingPct: '82.50',
    freeListingPct: '76.10',
    displayAdsPct: '64.30',
  };
  const clickApproval = {
    shoppingPct: '79.20',
    freeListingPct: '70.00',
    displayAdsPct: '58.40',
  };
  const nonImpresionApproval = {
    shoppingPct: '35.00',
    freeListingPct: '28.50',
    displayAdsPct: '20.00',
  };
  const nonClickApproval = {
    shoppingPct: '41.75',
    freeListingPct: '36.20',
    displayAdsPct: '24.10',
  };

  // Hardcoded account-level checks
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

  // Card renderer using hardcoded totals
  const card = (
    title: string,
    approval: number,
    approvalObj: {
      shoppingPct: string;
      freeListingPct: string;
      displayAdsPct: string;
    },
    metricsBox?: React.ReactNode
  ) => {
    return (
      <Card className='p-6 border-t-4 border-gray-200 flex flex-col gap-2 shadow-md bg-card text-card-foreground group relative overflow-hidden border-0 duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up rounded-2xl'>
        <CardTitle className='text-md font-semibold  '>
          <div className='flex items-center gap-3'>
            <img
              className='w-8'
              src='https://cdn.worldvectorlogo.com/logos/google-merchant-center.svg'
              alt=''
            />{' '}
            {title}
          </div>
        </CardTitle>
        <hr />
        <span className='flex items-center justify-between gap-2 font-semibold text-foreground mt-3'>
          <div className='flex items-center  gap-2'>
            {productsPerformanceLoading ? (
              <Skeleton className='h-7 w-24' />
            ) : (
              <>
                <h1 className='font-medium text-2xl text-foreground mb-1'>
                  {formatNumber(approval)}{' '}
                </h1>
                <span className=''>
                  {genericColorBadge(
                    TOTAL_PRODUCTS === 0
                      ? 0
                      : Math.round((Number(approval) / TOTAL_PRODUCTS) * 100),
                    'small'
                  )}
                </span>
              </>
            )}
          </div>
          {/* Rank badge intentionally removed */}
        </span>
        {/* Use approval breakdown to avoid unused warnings */}
        <span className='hidden'>{approvalObj?.shoppingPct}</span>

        {metricsBox}
        <Link
          to={(() => {
            const map: Record<string, string> = {
              'Products With Impressions': 'withImpressions',
              'Clicked Products': 'withClicks',
              'Unclicked Products': 'withoutClicks',
              'Products Without Impressions': 'withoutImpressions',
            };
            const t = map[title] || 'withoutClicks';
            return `/playbook/performance/${t}?pageSize=100`;
          })()}
        >
          <span className='text-sm font-bold text-gray-900 flex justify-between items-center mt-2 cursor-pointer gap-1'>
            View Checks <ArrowRight size={20} />
          </span>
        </Link>
      </Card>
    );
  };

  // Hardcoded destination approval summaries
  const summaries: Record<string, string> = {
    Shopping: 'Shopping Ads',
    SurfacesAcrossGoogle: 'Free Listings',
    DisplayAds: 'Display Ads',
  };

  const rankCard = (
    title: string,
    value: React.ReactNode,
    iconUrl: string,
    variant: 'primary' | 'success' | 'warning',
    isProduct = false
  ) => {
    const variantStyles = {
      primary: 'bg-blue-100 text-blue-500',
      success: 'bg-green-100 text-green-500',
      warning: 'bg-warning/10 text-warning',
    };
    // Reference to avoid unused warnings
    void variantStyles;
    void variant;
    return (
      <Card
        className={`h-full rounded-lg text-card-foreground group relative overflow-hidden border-0 shadow-md duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up ${
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
            <p
              className={`text-sm font-medium flex items-center justify-between text-muted-foreground`}
            >
              {title}
              {isProduct && countryOptions.length > 2 && (
                <span>
                  Country
                  <select
                    className='ml-2 p-1 border rounded-md text-sm'
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                    {countryOptions.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </span>
              )}
            </p>
            {isProduct ? (
              <div className='flex  justify-between  gap-x-1'>
                {(() => {
                  // Aggregate approval by destination for the selected country (or all)
                  const agg = new Map<
                    string,
                    { active: number; disapproved: number }
                  >();
                  const filtered = (accountstatuses || []).filter((s: any) =>
                    selectedCountry === 'All'
                      ? true
                      : s.country === selectedCountry
                  );
                  for (const s of filtered) {
                    const dest = String(s.destination || 'Unknown');
                    const active = Number(s.statistics?.active || 0);
                    const disapproved = Number(s.statistics?.disapproved || 0);
                    const prev = agg.get(dest) || { active: 0, disapproved: 0 };
                    agg.set(dest, {
                      active: prev.active + active,
                      disapproved: prev.disapproved + disapproved,
                    });
                  }
                  const order = [
                    'Shopping ads',
                    'Free listings',
                    'Display ads',
                  ];
                  const items = Array.from(agg.entries()).map(
                    ([destination, stats]) => ({ destination, stats })
                  );
                  items.sort(
                    (a, b) =>
                      order.indexOf(a.destination) -
                      order.indexOf(b.destination)
                  );
                  return items.slice(0, 3);
                })().map((s, i) => (
                  <Link
                    key={i}
                    className='  w-full text-[10px] transition-all'
                    to={`/playbook/feed-audit/approvals/${encodeURIComponent(
                      s.destination
                    )}`}
                  >
                    <div
                      className={` group flex flex-col text-center border  p-2 rounded-md w-full  hover:shadow-md `}
                    >
                      <span className='text-[13px] font-medium text-gray-900 flex items-center justify-center gap-1'>
                        {summaries[s.destination] || s.destination}{' '}
                        <ArrowRight size={12} />
                      </span>
                      <span className={`font-semibold text-gray-700 mt-2`}>
                        {(() => {
                          const a = Number(
                            s.stats?.active || s.stats?.active === 0
                              ? s.stats.active
                              : 0
                          );
                          const d = Number(
                            s.stats?.disapproved || s.stats?.disapproved === 0
                              ? s.stats.disapproved
                              : 0
                          );
                          const pct =
                            a + d === 0 ? 0 : Math.floor((a / (a + d)) * 100);
                          return genericColorBadge(pct, 'middle');
                        })()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className=''>
                <p className='text-4xl font-semibold text-gray-700'>{value}</p>
                <Link to='/playbook/account-compliance-dashboard'>
                  <span className='text-[13px] font-medium text-gray-900 flex items-center mt-2 cursor-pointer gap-1'>
                    View Checks <ArrowRight size={12} />
                  </span>
                </Link>
              </div>
            )}
          </div>
          {isProduct ? (
            ''
          ) : (
            <div className={`rounded-xl  `}>
              <img src={iconUrl} alt={title} className='w-44 ' />
            </div>
          )}
        </div>
      </Card>
    );
  };

  const QualityPillars = (
    title: string,
    description: string,
    rank: string,
    isAi: boolean
  ) => {
    return (
      <Card className='p-6 border-t-4 border-gray-200 flex flex-col gap-2 bg-card text-card-foreground group relative overflow-hidden border-0 shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up rounded-2xl'>
        <CardTitle className='flex text-lg items-center gap-3 mb-2   text-foreground'>
          {isAi && <img className='w-10' src='/aiIcon.png' alt='' />} {title}
          {genericColorBadge(Number(rank.replace('%', '')), 'small')}
        </CardTitle>
        <h3 className='text-sm font-light text-foreground'>{description}</h3>

        <span className='text-sm font-bold text-gray-900 flex justify-between mt-4 items-center cursor-pointer gap-1'>
          View Checks <ArrowRight size={20} />
        </span>
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

  // Loading state: show skeleton while audit feed data is fetching or not yet loaded
  if (!auditFeedData) {
    return (
      <div>
        <Skeleton className='h-10 w-40 mb-6' />
        <div className='flex justify-between mb-10 mt-8'>
          <Skeleton className='h-8 w-64' />
          <div className='flex gap-x-3 items-center'>
            <Skeleton className='h-8 w-32' />
            <Skeleton className='h-8 w-32' />
            <Skeleton className='h-8 w-32' />
          </div>
        </div>

        <div className='grid grid-cols-7 gap-x-2 mt-5'>
          <Skeleton className='col-span-2 h-44 rounded-xl' />
          <Skeleton className='col-span-3 h-44 rounded-xl' />
          <Skeleton className='col-span-2 h-44 rounded-xl' />
        </div>

        <div className='mt-8'>
          <Skeleton className='h-6 w-80 mb-2' />
          <Skeleton className='h-4 w-40 mb-4' />
          <div className='grid grid-cols-4 gap-x-3'>
            <Skeleton className='h-40 rounded-xl' />
            <Skeleton className='h-40 rounded-xl' />
            <Skeleton className='h-40 rounded-xl' />
            <Skeleton className='h-40 rounded-xl' />
          </div>
        </div>

        <div className='mt-8'>
          <Skeleton className='h-6 w-64 mb-4' />
          <div className='grid grid-cols-4 gap-3'>
            <Skeleton className='h-36 rounded-xl' />
            <Skeleton className='h-36 rounded-xl' />
            <Skeleton className='h-36 rounded-xl' />
            <Skeleton className='h-36 rounded-xl' />
          </div>
        </div>
      </div>
    );
  }

  // (Duplicate skeleton block removed)

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
          <p className='text-sm text-muted-foreground'>Date: {DATE_LABEL}</p>
          {/* <Button variant='outline'>View Past Audit's</Button> */}
          <Button
            variant='default'
            disabled={downloading}
            onClick={async () => {
              try {
                setDownloading(true);
                await exportElementToPdf(
                  '.save-pdf',
                  'Google-Shopping-Audit.pdf',
                  {
                    scale: 2,
                    marginMm: 8,
                  }
                );
              } catch (err) {
                console.error('PDF export failed', err);
              } finally {
                setDownloading(false);
              }
            }}
          >
            {downloading ? 'Preparing…' : 'Save As PDF'}
          </Button>
        </div>
      </div>
      <div className='save-pdf'>
        <div className='grid grid-cols-7 gap-x-2 mt-5'>
          {/* Left card (normal size) */}
          <div className='col-span-2'>
            {rankCard(
              'FeedRank',
              genericColorBadge(80, 'large'),
              '/2.png',
              'primary'
            )}
          </div>

          {/* Middle card (bigger, spans 3 columns) */}
          <div className='col-span-3'>
            {rankCard(
              'Product Approval',
              genericColorBadge(80, 'large'),
              'https://www.gstatic.com/merchants/tasks/card_illustration/increase_campaign_budget.svg',
              'success',
              true
            )}
          </div>

          {/* Right card (normal size) */}
          <div className='col-span-2'>
            {rankCard(
              'Account Compliance',
              genericColorBadge(30, 'large'),
              '/1.png',
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
                    We show the last 30 days to provide context, since the
                    product data status reflects today's snapshot.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className='text-sm text-muted-foreground'>Last 30 days</p>
        </div>
        <div className='grid grid-cols-4 gap-x-3'>
          {(() => {
            const cards = [
              {
                key: 'withImpressions',
                title: 'Products With Impressions',
                count: productWithImpressions,
                approvalObj: impresionApproval,
                metricsBox: (
                  <div className='text-sm inline-block border border-gray-200 rounded-lg p-4 bg-white shadow-sm'>
                    <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                      <span className='text-gray-700 font-medium'>
                        Total Impressions:
                      </span>
                      {productsPerformanceLoading ? (
                        <Skeleton className='h-5 w-20' />
                      ) : (
                        <span className='text-gray-900 font-semibold'>
                          {formatCompact(
                            productsPerformanceSummary?.summary
                              ?.productsWithImpressions?.totalImpressions ?? 0
                          )}
                        </span>
                      )}
                    </div>
                    <div className='flex justify-between items-center pt-2'>
                      <span className='text-gray-700 font-medium'>
                        Avg. Impr./Product:
                      </span>
                      {productsPerformanceLoading ? (
                        <Skeleton className='h-5 w-16' />
                      ) : (
                        <span className='text-gray-900 font-semibold'>
                          {(() => {
                            const totalImpr =
                              productsPerformanceSummary?.summary
                                ?.productsWithImpressions?.totalImpressions ??
                              0;
                            const count =
                              productsPerformanceSummary?.summary
                                ?.productsWithImpressions?.count ?? 0;
                            const avg =
                              count === 0 ? 0 : Math.round(totalImpr / count);
                            return formatCompact(avg);
                          })()}
                        </span>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                key: 'withClicks',
                title: 'Clicked Products',
                count: productWithClicks,
                approvalObj: clickApproval,
                metricsBox: (
                  <div className='text-sm inline-block border border-gray-200 rounded-lg p-4 bg-white shadow-sm'>
                    <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                      <span className='text-gray-700 font-medium'>
                        Total Clicks:
                      </span>
                      {productsPerformanceLoading ? (
                        <Skeleton className='h-5 w-16' />
                      ) : (
                        <span className='text-gray-900 font-semibold'>
                          {formatCompact(
                            productsPerformanceSummary?.summary
                              ?.productsWithClicks?.totalClicks ?? 0
                          )}
                        </span>
                      )}
                    </div>
                    <div className='flex justify-between items-center pt-2'>
                      <span className='text-gray-700 font-medium'>
                        Avg. Clicks/Product:
                      </span>
                      {productsPerformanceLoading ? (
                        <Skeleton className='h-5 w-16' />
                      ) : (
                        <span className='text-gray-900 font-semibold'>
                          {(() => {
                            const totalClicks =
                              productsPerformanceSummary?.summary
                                ?.productsWithClicks?.totalClicks ?? 0;
                            const count =
                              productsPerformanceSummary?.summary
                                ?.productsWithClicks?.count ?? 0;
                            const avg =
                              count === 0 ? 0 : Math.round(totalClicks / count);
                            return formatCompact(avg);
                          })()}
                        </span>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                key: 'withoutClicks',
                title: 'Unclicked Products',
                count: productWithOutClicks,
                approvalObj: nonClickApproval,
                metricsBox: (
                  <div className='text-sm inline-block border border-gray-200 rounded-lg p-4 bg-white shadow-sm'>
                    <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                      <span className='text-gray-700 font-medium'>
                        Product Approved:
                      </span>

                      <span className='text-sm text-gray-900 font-normal'>
                        Coming
                      </span>
                    </div>
                    <div className='flex justify-between items-center pt-2'>
                      <span className='text-gray-700 font-medium'>
                        Products Disapproved:
                      </span>

                      <span className='text-sm text-gray-900 font-normal'>
                        {' '}
                        Coming
                      </span>
                    </div>
                  </div>
                ),
              },
              {
                key: 'withoutImpressions',
                title: 'Products Without Impressions',
                count: productWithOutImpressions,
                approvalObj: nonImpresionApproval,
                metricsBox: (
                  <div className='text-sm inline-block border border-gray-200 rounded-lg p-4 bg-white shadow-sm'>
                    <div className='flex justify-between items-center pb-2 border-b border-gray-200'>
                      <span className='text-gray-700 font-medium'>
                        Product Approved:
                      </span>

                      <span className='text-sm text-gray-900 font-normal'>
                        Coming
                      </span>
                    </div>
                    <div className='flex justify-between items-center pt-2'>
                      <span className='text-gray-700 font-medium'>
                        Products Disapproved:
                      </span>

                      <span className='text-sm text-gray-900 font-normal'>
                        {' '}
                        Coming
                      </span>
                    </div>
                  </div>
                ),
              },
            ];

            const toRender = productsPerformanceLoading
              ? cards
              : cards.filter((c) =>
                  typeof c.count === 'number'
                    ? c.count > 0
                    : Number(c.count) > 0
                );

            if (!productsPerformanceLoading && toRender.length === 0) {
              return (
                <div className='col-span-4'>
                  <Card className='p-6'>
                    <p className='text-sm text-muted-foreground'>
                      No relevant product performance data available for the
                      selected period.
                    </p>
                  </Card>
                </div>
              );
            }

            return toRender.map((c) =>
              card(c.title, c.count, c.approvalObj, c.metricsBox)
            );
          })()}
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
        <div className='grid grid-cols-4 gap-3 mb-10'>
          {QualityPillars(
            'Essential Product Data',
            'Overall Merchant Center health — suspensions, policies, feed sync, and account links.',
            '70%',
            false
          )}
          {QualityPillars(
            'Identification & Categorization ',
            'The essential attributes Google requires for products to serve (IDs, titles, prices, images, identifiers).',
            '70%',
            false
          )}
          {QualityPillars(
            'Data Enrichment',
            'Ensures products are correctly classified into Google’s taxonomy for accurate matching.',
            '70%',
            true
          )}
          {QualityPillars(
            'Search Optimizationa',
            'Additional attributes that enhance visibility and filtering (color, size, material, gender, etc.)',
            '70%',
            true
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedAudit;
