import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
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
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { t } from 'framer-motion/dist/types.d-DDSxwf0n';
import { stringify } from 'postcss';

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
  const { auditFeedData } = useAuth();

  const totalProducts = auditFeedData.data.totalProducts;

  const inStockProducts = auditFeedData.data.inStockProducts;

  const {
    titlesUnder40Chars,
    descriptionUnder500Chars,
    titleLargerThan150Chars,
    totalTitlesUnder40Chars,
    totalDescriptionsUnder500Chars,
    totalTitleLargerThan150Chars,
    websiteInfo,
  } = auditFeedData.data;
  let issuesFound = 0;
  if (titlesUnder40Chars.length > 0) {
    issuesFound += 1;
  }
  if (descriptionUnder500Chars.length > 0) {
    issuesFound += 1;
  }
  if (titleLargerThan150Chars.length > 0) {
    issuesFound += 1;
  }

  const metrics = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-foreground',
      bgColor: 'bg-card',
      svg: 'https://www.gstatic.com/merchants/tasks/card_illustration/increase_campaign_budget.svg',
    },
    {
      title: 'In Stock',
      value: inStockProducts,
      icon: ShoppingCart,
      color: 'text-foreground',
      bgColor: 'bg-card',
      svg: 'https://www.gstatic.com/merchants/tasks/card_illustration/first_click.svg',
    },
    {
      title: 'Issues Found',
      value: issuesFound,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-card',
      svg: 'https://www.gstatic.com/merchants/tasks/card_illustration/product_issues.svg',
    },
  ];

  const buildFeedopsUrl = (column, totalproducts = []) => {
    const baseUrl = `https://app.feedops.com/feed_ops/${websiteInfo[0]?.website_id}/product_feeds/product_level_optimizations`;
    // const baseUrl = `https://app.feedops.com/feed_ops/${websiteId}/ai_optimisation`;
    const columns = column;
    const channel = 'google';
    const allSku = totalproducts
      .filter((product) => !String(product.id).includes('#'))
      .map((product) => String(product.id));

    const filters = JSON.stringify([
      {
        attribute_name: 'Sku',
        filter_type: 'is equal to',
        values: allSku.slice(0, 400),
        meta_data: {},
      },
    ]);

    return `${baseUrl}?columns=${columns}&channel=${channel}&filters=${filters}`;
  };

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
            {/* <CardContent> */}
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
            {/* </CardContent> */}
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
        className='border border-border shadow-[var(--shadow-medium)]'
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
            {totalTitlesUnder40Chars > 0 && (
              <div className='p-4 border border-border rounded-lg bg-muted/30'>
                <h4 className='font-medium text-foreground mb-2'>
                  Short Titles
                </h4>
                <p className='text-sm text-muted-foreground'>
                  {totalTitlesUnder40Chars} products have titles too short under
                  35 characters.
                </p>
                <div className='w-full flex items-center justify-end mt-2'>
                  <Button variant='link' size='sm'>
                    <a
                      target='_blank'
                      href={buildFeedopsUrl('Title', titlesUnder40Chars)}
                    >
                      Fix Short Titles
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {totalTitleLargerThan150Chars && (
              <div className='p-4 border border-border rounded-lg bg-muted/30'>
                <h4 className='font-medium text-foreground mb-2'>
                  Long Titles
                </h4>
                <p className='text-sm text-muted-foreground'>
                  {totalTitleLargerThan150Chars} products have titles too long
                  over 150 characters.
                </p>
                <div className='w-full flex items-center justify-end mt-2'>
                  <Button variant='link' size='sm'>
                    <a
                      target='_blank'
                      href={buildFeedopsUrl('Title', titleLargerThan150Chars)}
                    >
                      Fix Long Titles
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {totalDescriptionsUnder500Chars > 0 && (
              <div className='p-4 border border-border rounded-lg bg-muted/30'>
                <h4 className='font-medium text-foreground mb-2'>
                  Short Descriptions
                </h4>
                <p className='text-sm text-muted-foreground'>
                  {totalDescriptionsUnder500Chars} products have descriptions
                  too short under 100 characters.
                </p>
                <div className='w-full flex items-center justify-end mt-2'>
                  <Button variant='link' size='sm'>
                    <a
                      target='_blank'
                      href={buildFeedopsUrl(
                        'Description',
                        descriptionUnder500Chars
                      )}
                    >
                      Fix Short Descriptions
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {/* <div className='p-4 border border-border rounded-lg bg-muted/30'>
              <h4 className='font-medium text-foreground mb-2'>
                Missing Identifiers
              </h4>
              <p className='text-sm text-muted-foreground'>
                {products.filter((p) => !p.gtin && !p.mpn).length} products
                missing GTIN or MPN identifiers
              </p>
              <div className='w-full flex items-center justify-end mt-2'>
                <Button variant='link' size='sm'>
                  <a target='_blank' href={buildFeedopsUrl()}>
                    Fix Missing Attribute
                  </a>
                </Button>
              </div>
            </div>
            <div className='p-4 border border-border rounded-lg bg-muted/30'>
              <h4 className='font-medium text-foreground mb-2'>
                Brand Information
              </h4>
              <p className='text-sm text-muted-foreground'>
                {products.filter((p) => !p.brand).length} products missing brand
                information
              </p>
              <div className='w-full flex items-center justify-end mt-2'>
                <Button variant='link' size='sm'>
                  <a target='_blank' href={buildFeedopsUrl()}>
                    Fix Missing Brand
                  </a>
                </Button>
              </div>
            </div>
            <div className='p-4 border border-border rounded-lg bg-muted/30'>
              <h4 className='font-medium text-foreground mb-2'>Short Titles</h4>
              <p className='text-sm text-muted-foreground'>
                {products.filter((p) => p.title.length < 50).length} products
                have titles too short.
              </p>
              <div className='w-full flex items-center justify-end mt-2'>
                <Button variant='link' size='sm'>
                  <a target='_blank' href={buildFeedopsUrl()}>
                    Fix Short Titles
                  </a>
                </Button>
              </div>
            </div> */}

            {/* <div className='p-4 border border-border rounded-lg bg-muted/30'>
              <h4 className='font-medium text-foreground mb-2'>
                Missing Identifiers
              </h4>
              <p className='text-sm text-muted-foreground'>
                {products.filter((p) => !p.gtin && !p.mpn).length} products
                missing GTIN or MPN identifiers
              </p>
              <div className='w-full flex items-center justify-end mt-2'>
                <Button variant='link' size='sm'>
                  <a target='_blank' href={buildFeedopsUrl()}>
                    Fix Missing Attribute
                  </a>
                </Button>
              </div>
            </div>
            <div className='p-4 border border-border rounded-lg bg-muted/30'>
              <h4 className='font-medium text-foreground mb-2'>
                Brand Information
              </h4>
              <p className='text-sm text-muted-foreground'>
                {products.filter((p) => !p.brand).length} products missing brand
                information
              </p>
              <div className='w-full flex items-center justify-end mt-2'>
                <Button variant='link' size='sm'>
                  <a target='_blank' href={buildFeedopsUrl()}>
                    Fix Missing Brand
                  </a>
                </Button>
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationDashboard;
