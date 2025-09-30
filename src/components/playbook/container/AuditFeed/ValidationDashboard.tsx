import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Package,
  ShoppingCart,
  Eye,
  BarChart3,
  Edit,
  Store,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { t } from 'framer-motion/dist/types.d-DDSxwf0n';
import { stringify } from 'postcss';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  availability: string;
  link: string;
  image_link: string;
  brand?: string;
  gtin?: string;
  mpn?: string;
  domain?: string;
}

interface ValidationDashboardProps {
  products: Product[];
  domain?: string;
}

const ValidationDashboard = ({
  products,
  domain,
}: ValidationDashboardProps) => {
  const {
    allProducts: auditFeedData,
    setAuditFeedData,
    allProducts,
  } = useAuth();

  const totalProducts = auditFeedData.length;

  const inStockProducts = 12;
  const [showAllIssues, setShowAllIssues] = useState(false);
  const getOverallStatus = (
    p: Product
  ): 'approved' | 'limited' | 'disapproved' => {
    const statuses = p.destinationStatuses?.map((s) => s.status) ?? [];
    if (statuses.length === 0) return 'approved'; // fallback: treat as OK
    if (statuses.every((s) => s === 'approved')) return 'approved';
    if (statuses.every((s) => s === 'disapproved')) return 'disapproved';
    return 'limited';
  };

  const totalError = auditFeedData.filter(
    (p) => getOverallStatus(p) === 'disapproved'
  ).length;

  const approveProduct = auditFeedData.filter(
    (p) => getOverallStatus(p) === 'approved'
  ).length;

  const limitedError = auditFeedData.filter(
    (p) => getOverallStatus(p) === 'limited'
  ).length;

  const issueMap: Record<
    string,
    (typeof auditFeedData)[0]['itemLevelIssues'][0]
  > = {};

  auditFeedData.forEach((p) => {
    (p.itemLevelIssues ?? []).forEach((issue) => {
      issueMap[issue.code] = issue;
    });
  });

  const uniqueIssues = Object.values(issueMap);

  function formatNumber(num) {
    return num?.toLocaleString();
  }
  function filterItemsByIssueDescription(items, query) {
    if (!query) return items;
    const q = String(query).toLowerCase().trim();

    return items.filter((p) =>
      (p.itemLevelIssues ?? []).some((iss) =>
        String(iss.description || '')
          .toLowerCase()
          .includes(q)
      )
    );
  }

  // usage:

  const handleViewProductClick = (type) => {
    const filtered = filterItemsByIssueDescription(allProducts, type);
    console.log(filtered);
    setAuditFeedData(filtered);
    const element = document.getElementById('product-table');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const buildFeedopsUrl = (totalproducts = []) => {
    const baseUrl = `https://app.feedops.com/feed_ops/1586/product_feeds/product_level_optimizations`;
    // const baseUrl = `https://app.feedops.com/feed_ops/${websiteId}/ai_optimisation`;

    const channel = 'google';
    const allSku = totalproducts.map((product) =>
      String(product.productId.split(':')[3])
    );

    const filters = JSON.stringify([
      {
        attribute_name: 'Sku',
        filter_type: 'is equal to',
        values: allSku.slice(0, 400),
        meta_data: {},
      },
    ]);
    return `${baseUrl}?channel=${channel}&filters=${filters}`;
  };

  const metrics = [
    {
      title: 'Total Products',
      value: formatNumber(totalProducts),
      icon: Package,
      color: 'text-gray-700',
      bgColor: 'bg-white',
      svg: '/images/metrics/total_products.svg',
    },
    {
      title: 'Approved Products',
      value: formatNumber(approveProduct),
      icon: CheckCircle2,
      color: 'text-gray',
      bgColor: 'bg-white',
      svg: 'https://www.gstatic.com/merchants/tasks/card_illustration/first_click.svg',
    },
    {
      title: 'Products with Issues',
      value: formatNumber(totalError),
      icon: AlertTriangle,
      color: 'text-gray-700',
      bgColor: 'bg-white',
      svg: 'https://www.gstatic.com/merchants/tasks/card_illustration/product_issues.svg',
    },
    {
      title: 'Products with Limited Issues',
      value: formatNumber(limitedError),
      icon: TrendingUp,
      color: 'text-gray-700',
      bgColor: 'bg-white',
      svg: 'https://www.gstatic.com/merchants/tasks/card_illustration/product_issues.svg',
    },
    {
      title: 'Approval Rate (%)',
      value: ((approveProduct / totalProducts) * 100).toFixed(2) + '%',
      icon: TrendingUp,
      color: 'text-gray-700',
      bgColor: 'bg-white',
      svg: 'https://www.gstatic.com/merchants/tasks/card_illustration/increase_campaign_budget.svg',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='border-b border-border pb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-foreground mb-2'>
              Audit Shopping Feed
            </h1>
            <p className='text-muted-foreground'>
              Monitor your product data quality and optimize for better
              performance across channels
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Badge
              variant='outline'
              className='text-sm text-blue-500 font-medium p-2 gap-2'
            >
              <Store className='mr-1 h-4 w-4' />
              <a
                href={`https://${domain}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {domain}
              </a>
            </Badge>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className={`border border-border shadow-[var(--shadow-soft)] ${metric.bgColor}`}
          >
            <div className='flex flex-row items-center justify-between space-y-3 py-3 px-5'>
              <div className={`text-3xl font-bold ${metric.color}`}>
                <CardTitle className='flex items-center gap-3'>
                  <div
                    className={`p-2 rounded-lg ${metric.bgColor} border border-border/50`}
                  >
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <span className=' text-sm font-medium text-muted-foreground'>
                    {metric.title}
                  </span>
                </CardTitle>
                <p className='mt-4 font-bold'>{metric.value}</p>
              </div>
              <img className='w-20' src={metric.svg} alt='' />
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card
        style={{
          borderWidth: '0.0625rem',
          borderStyle: 'solid',
          borderColor: 'rgb(164, 87, 247)',
          background: 'rgb(252, 255, 253)',
        }}
        className='border border-border shadow-[var(--shadow-medium)] mb-3'
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-3 py-3 px-5'>
          <CardTitle className='text-lg font-semibold text-foreground'>
            Quick Insights
          </CardTitle>
          <div className=''>
            {/* <Button variant='link'>Show all Issues (3) </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {uniqueIssues
              .slice(0, showAllIssues ? uniqueIssues.length : 3)
              .map((issue) => (
                <div
                  key={issue.code}
                  className='p-4 border border-border rounded-lg bg-muted/30 flex flex-col justify-between'
                >
                  <div className=''>
                    <h4 className='font-medium text-foreground mb-2 flex items-center gap-2'>
                      <svg
                        width='23'
                        height='23'
                        viewBox='0 0 23 23'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M11.4998 16.292C11.7714 16.292 11.9991 16.2 12.1831 16.016C12.3671 15.832 12.4588 15.6045 12.4582 15.3337C12.4575 15.0628 12.3655 14.8353 12.1822 14.6513C11.9988 14.4673 11.7714 14.3753 11.4998 14.3753C11.2283 14.3753 11.0009 14.4673 10.8175 14.6513C10.6341 14.8353 10.5421 15.0628 10.5415 15.3337C10.5409 15.6045 10.6329 15.8323 10.8175 16.0169C11.0021 16.2016 11.2296 16.2933 11.4998 16.292ZM10.5415 12.4587H12.4582V6.70866H10.5415V12.4587ZM11.4998 21.0837C10.1741 21.0837 8.92831 20.8319 7.76234 20.3285C6.59637 19.825 5.58213 19.1424 4.71963 18.2805C3.85713 17.4187 3.17448 16.4044 2.67167 15.2378C2.16887 14.0712 1.91714 12.8254 1.91651 11.5003C1.91587 10.1753 2.16759 8.92944 2.67167 7.76283C3.17576 6.59621 3.85841 5.58198 4.71963 4.72012C5.58085 3.85826 6.59509 3.1756 7.76234 2.67216C8.92959 2.16871 10.1754 1.91699 11.4998 1.91699C12.8243 1.91699 14.0701 2.16871 15.2373 2.67216C16.4046 3.1756 17.4188 3.85826 18.28 4.72012C19.1413 5.58198 19.8242 6.59621 20.329 7.76283C20.8337 8.92944 21.0851 10.1753 21.0832 11.5003C21.0813 12.8254 20.8295 14.0712 20.328 15.2378C19.8265 16.4044 19.1438 17.4187 18.28 18.2805C17.4163 19.1424 16.402 19.8254 15.2373 20.3294C14.0726 20.8335 12.8268 21.0849 11.4998 21.0837ZM11.4998 19.167C13.6401 19.167 15.453 18.4243 16.9384 16.9389C18.4238 15.4534 19.1665 13.6406 19.1665 11.5003C19.1665 9.36005 18.4238 7.5472 16.9384 6.06178C15.453 4.57637 13.6401 3.83366 11.4998 3.83366C9.35956 3.83366 7.54671 4.57637 6.0613 6.06178C4.57588 7.5472 3.83317 9.36005 3.83317 11.5003C3.83317 13.6406 4.57588 15.4534 6.0613 16.9389C7.54671 18.4243 9.35956 19.167 11.4998 19.167Z'
                          fill='#C5221F'
                        />
                      </svg>

                      {issue.description}
                    </h4>
                    <p className='text-sm text-muted-foreground'>
                      {issue.detail}{' '}
                      <a
                        target='_blank'
                        className='text-sm text-blue-700 underline '
                        href={issue.documentation}
                      >
                        Learn more{' '}
                        <ExternalLink className='inline-block ml-1 h-4 w-4' />
                      </a>
                    </p>
                  </div>
                  <div className='w-full flex items-center justify-end mt-2 gap-2'>
                    <Button
                      variant='link'
                      size='sm'
                      onClick={() => handleViewProductClick(issue.description)}
                    >
                      View Products
                    </Button>
                    <Button variant='link' size='sm'>
                      <a
                        target='_blank'
                        href={buildFeedopsUrl(
                          filterItemsByIssueDescription(
                            allProducts,
                            issue.description
                          )
                        )}
                      >
                        Fix Issue
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
          {uniqueIssues.length > 3 && (
            <div className='flex justify-center mt-4'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowAllIssues(!showAllIssues)}
              >
                {showAllIssues ? 'Show Less' : 'Show All Issues'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationDashboard;
