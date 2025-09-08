import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Package,
  Search,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
}

interface ProductTableProps {
  products: Product[];
  title: string;
  icon: React.ReactNode;
  type: 'shortest' | 'longest' | 'shortestDescription';
  isLoading?: boolean;
}

const ProductTable = ({
  products,
  title,
  icon,
  type,
  isLoading = false,
}: ProductTableProps) => {
  const getTitleStatus = (title: string) => {
    return (
      <Badge variant='destructive' className='text-xs'>
        Too Short
      </Badge>
    );
  };

  const { auditFeedData } = useAuth();

  const { websiteInfo } = auditFeedData.data;

  const buildFeedopsUrl = (column, skuId) => {
    const baseUrl = `https://app.feedops.com/feed_ops/${websiteInfo[0]?.website_id}/product_feeds/product_level_optimizations`;
    // const baseUrl = `https://app.feedops.com/feed_ops/${websiteId}/ai_optimisation`;
    const columns = column;
    const channel = 'google';

    const filters = JSON.stringify([
      {
        attribute_name: 'Sku',
        filter_type: 'is equal to',
        values: skuId,
        meta_data: {},
      },
    ]);

    return `${baseUrl}?columns=${columns}&channel=${channel}&filters=${filters}`;
  };
  // Loading state
  if (isLoading) {
    return (
      <Card className='border border-border shadow-[var(--shadow-medium)]'>
        <CardHeader className='border-b border-border bg-muted/30'>
          <CardTitle className='flex items-center gap-3 text-lg font-semibold text-foreground'>
            {icon}
            {title}
            <Skeleton className='h-6 w-20 ml-auto' />
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex items-center space-x-4'>
                <Skeleton className='h-6 w-6 rounded-full' />
                <div className='space-y-2 flex-1'>
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-3 w-1/2' />
                </div>
                <Skeleton className='h-6 w-16' />
                <Skeleton className='h-6 w-20' />
                <Skeleton className='h-6 w-6' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <Card className='border border-border shadow-[var(--shadow-medium)]'>
        <CardHeader className='border-b border-border bg-muted/30'>
          <CardTitle className='flex items-center gap-3 text-lg font-semibold text-foreground'>
            {icon}
            {title}
            <Badge variant='outline' className='ml-auto'>
              0 products
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-12'>
          <div className='text-center space-y-4'>
            <div className='mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
              <Package className='h-8 w-8 text-muted-foreground' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold text-foreground'>
                No products found
              </h3>
              <p className='text-sm text-muted-foreground max-w-md mx-auto'>
                {type === 'missing'
                  ? 'Great! All your products have complete data and optimal formatting.'
                  : 'No products match the current criteria. Your feed might be well-optimized!'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='border border-border shadow-[var(--shadow-medium)] overflow-hidden'>
      <CardHeader className='border-b border-border bg-muted/30 py-4'>
        <CardTitle className='flex items-center gap-3 text-lg font-semibold text-foreground'>
          {icon}
          {title}
          <Badge variant='outline' className='ml-auto text-xs px-2 py-1'>
            {products.length} product{products.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <ScrollArea className='h-[600px]'>
          <div className='min-w-full'>
            <Table>
              <TableHeader className='sticky top-0 bg-background z-10'>
                <TableRow className='border-b border-border bg-muted/20 hover:bg-muted/20'>
                  <TableHead className='w-16 text-center font-medium py-3'>
                    id
                  </TableHead>
                  <TableHead className='min-w-[80px] font-medium py-3'>
                    {type === 'shortestDescription' ? 'Description' : 'Title'}
                  </TableHead>
                  <TableHead className='w-28 text-center font-medium py-3'>
                    {type === 'shortestDescription' ? 'Description' : 'Title'}{' '}
                    Length
                  </TableHead>
                  <TableHead className='w-28 text-center font-medium py-3'>
                    Availability
                  </TableHead>
                  <TableHead className='w-20 text-center font-medium py-3'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow
                    key={product.id}
                    className='border-b border-border hover:bg-muted/30 transition-colors duration-200 group'
                  >
                    <TableCell className='py-4'>
                      <div className='space-y-2'>
                        <div className='flex items-start gap-2'>
                          <div className='h-12 w-12 rounded-md overflow-hidden'>
                            <img
                              className='h-full w-full object-contain'
                              src={product.imgUrl}
                              alt={'img'}
                            />
                          </div>
                          <span className='text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded'>
                            #{index + 1}
                          </span>
                          <div className='flex-1 min-w-0'>
                            <h4 className='font-medium text-sm text-foreground leading-snug line-clamp-2 mb-1'>
                              {product?.id}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className=' py-4'>
                      {type === 'shortestDescription'
                        ? product.description
                        : product.title}
                    </TableCell>

                    <TableCell className='text-center py-4'>
                      <div className='space-y-2'>
                        <div className='text-sm font-mono font-medium'>
                          {product.length}
                        </div>
                        {getTitleStatus(product?.title)}
                      </div>
                    </TableCell>
                    <TableCell className=' py-4'>{product?.stock}</TableCell>
                    <TableCell className='text-center py-4'>
                      <a
                        target='_blank'
                        href={buildFeedopsUrl('Description', [product?.id])}
                      >
                        <Button
                          variant='link'
                          size='sm'
                          onClick={() => window.open(product?.link, '_blank')}
                          className=' hover:bg-primary/10 hover:text-primary transition-colors duration-200'
                          title='View product'
                        >
                          <ExternalLink className='h-4 w-4' /> Fix Product
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProductTable;
