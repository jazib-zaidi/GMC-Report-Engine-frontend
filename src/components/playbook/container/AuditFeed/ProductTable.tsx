import React, { useMemo, useState } from 'react';
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
import { Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
interface Product {
  productId: string;
  title: string;
  link: string;
  destinationStatuses: {
    destination: string;
    status: 'approved' | 'disapproved' | string;
  }[];
  itemLevelIssues?: { description: string }[];
}

interface ProductTableProps {
  products: Product[];
  title: string;
  icon: React.ReactNode;
  type: 'shortest' | 'longest' | 'shortestDescription' | 'missing' | string;
  isLoading?: boolean;
}

const ProductTable = ({
  products,
  title,
  icon,
  type,
  isLoading = false,
}: ProductTableProps) => {
  // NEW: simple status filter
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'approved' | 'limited' | 'disapproved'
  >('all');
  const { setAuditFeedData, allProducts } = useAuth();

  const [openIssues, setOpenIssues] = useState<Record<string, boolean>>({});
  const toggleIssues = (pid: string) =>
    setOpenIssues((prev) => ({ ...prev, [pid]: !prev[pid] }));
  // Helper: derive overall status for a product
  const getOverallStatus = (
    p: Product
  ): 'approved' | 'limited' | 'disapproved' => {
    const statuses = p.destinationStatuses?.map((s) => s.status) ?? [];
    if (statuses.length === 0) return 'approved'; // fallback: treat as OK
    if (statuses.every((s) => s === 'approved')) return 'approved';
    if (statuses.every((s) => s === 'disapproved')) return 'disapproved';
    return 'limited';
  };

  // Existing badge renderer (unchanged behavior)
  const findProductStatus = (product: Product) => {
    const overall = getOverallStatus(product);
    if (overall === 'disapproved')
      return <Badge variant='destructive'>Disapproved</Badge>;
    if (overall === 'limited') return <Badge variant='warning'>Limited</Badge>;
    return <Badge variant='success'>Approved</Badge>;
  };

  // NEW: apply filter before rendering
  const filtered = useMemo(() => {
    if (statusFilter === 'all') return products;
    return products.filter((p) => getOverallStatus(p) === statusFilter);
  }, [products, statusFilter]);

  // Loading state (unchanged)
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

  // Empty state respects filter
  if (filtered.length === 0) {
    return (
      <Card className='border border-border shadow-[var(--shadow-medium)] mt-4'>
        <CardHeader className='border-b border-border bg-muted/30'>
          <CardTitle className='flex items-center gap-3 text-lg font-semibold text-foreground'>
            {icon}
            {title}
            {/* Filter controls even on empty state */}
            <div className='ml-auto flex items-center gap-2'>
              <Button
                size='sm'
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => {
                  setAuditFeedData(allProducts);
                  setStatusFilter('all');
                }}
              >
                All
              </Button>
              <Button
                size='sm'
                variant={statusFilter === 'approved' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('approved')}
              >
                Approved
              </Button>
              <Button
                size='sm'
                variant={statusFilter === 'limited' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('limited')}
              >
                Limited
              </Button>
              <Button
                size='sm'
                variant={statusFilter === 'disapproved' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('disapproved')}
              >
                Disapproved
              </Button>
            </div>
            <Badge variant='outline' className='ml-2'>
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
    <Card
      id='product-table'
      className='border border-border shadow-[var(--shadow-medium)] overflow-hidden mt-5'
    >
      <CardHeader className='border-b border-border bg-muted/30 py-4'>
        <CardTitle className='flex items-center gap-3 text-lg font-semibold text-foreground'>
          {icon}
          {title}

          {/* NEW: status filter controls */}
          <div className='ml-auto flex items-center gap-2'>
            <Button
              size='sm'
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              size='sm'
              variant={statusFilter === 'approved' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('approved')}
            >
              Approved
            </Button>
            <Button
              size='sm'
              variant={statusFilter === 'limited' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('limited')}
            >
              Limited
            </Button>
            <Button
              size='sm'
              variant={statusFilter === 'disapproved' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('disapproved')}
            >
              Disapproved
            </Button>

            <Badge variant='outline' className='text-xs px-2 py-1 ml-2'>
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className='p-0'>
        <ScrollArea className='h-[600px]'>
          <div className='min-w-full'>
            <Table>
              <TableHeader className='sticky top-0 bg-background z-10'>
                <TableRow className='border-b border-border bg-muted/20 hover:bg-muted/20'>
                  <TableHead className='text-center font-medium py-3'>
                    id
                  </TableHead>
                  <TableHead className='font-medium py-3'>Title</TableHead>
                  <TableHead className='text-center font-medium py-3'>
                    Status
                  </TableHead>
                  <TableHead className='text-center font-medium py-3'>
                    Approved Marketing methods
                  </TableHead>
                  <TableHead className='text-center font-medium py-3'>
                    Error
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((product, index) => (
                  <TableRow
                    key={product.productId}
                    className='border-b border-border hover:bg-muted/30 transition-colors duration-200 group'
                  >
                    <TableCell className='py-4'>
                      <div className='space-y-2'>
                        <div className='flex items-start gap-2'>
                          <span className='text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded'>
                            #{index + 1}
                          </span>
                          <div className='flex-1 min-w-0'>
                            <a
                              target='_blank'
                              href={product?.link}
                              className='hover:underline text-blue-500'
                            >
                              <h4 className='font-medium w-[200px] text-sm hover:underline text-blue-500 leading-snug line-clamp-2 mb-1'>
                                {product?.productId.split(':')[3]}
                              </h4>
                            </a>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className='py-4 w-[304px]'>
                      {product.title}
                    </TableCell>

                    <TableCell className='py-4'>
                      {findProductStatus(product)}
                    </TableCell>

                    <TableCell className='py-4 text-start w-[164px]'>
                      {product.destinationStatuses.map((status) => (
                        <div
                          key={status.destination}
                          className='flex flex-col items-start space-y-1'
                        >
                          <div className='text-sm font-mono px-1.5 py-0.5 rounded'>
                            {status.status === 'approved' ? '✅' : '❌'}{' '}
                            {status.destination === 'SurfacesAcrossGoogle'
                              ? 'Free listings'
                              : status.destination}
                          </div>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className='py-4 w-[304px]'>
                      {product?.itemLevelIssues?.length > 0 ? (
                        <div>
                          {/* first/primary issue */}
                          <div className='flex items-start gap-2'>
                            {/* red info dot */}
                            <svg
                              width='17'
                              height='17'
                              viewBox='0 0 17 17'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                              className='mt-0.5 shrink-0'
                            >
                              <path
                                d='M8.49984 12.042C8.70053 12.042 8.86888 11.974 9.00488 11.838C9.14088 11.702 9.20864 11.5339 9.20817 11.3337C9.2077 11.1334 9.1397 10.9653 9.00417 10.8293C8.86864 10.6933 8.70053 10.6253 8.49984 10.6253C8.29914 10.6253 8.13103 10.6933 7.9955 10.8293C7.85998 10.9653 7.79198 11.1334 7.7915 11.3337C7.79103 11.5339 7.85903 11.7022 7.9955 11.8387C8.13198 11.9752 8.30009 12.0429 8.49984 12.042ZM7.7915 9.20866H9.20817V4.95866H7.7915V9.20866ZM8.49984 15.5837C7.51998 15.5837 6.59914 15.3976 5.73734 15.0255C4.87553 14.6534 4.12588 14.1488 3.48838 13.5118C2.85088 12.8748 2.34631 12.1251 1.97467 11.2628C1.60303 10.4005 1.41698 9.47972 1.4165 8.50033C1.41603 7.52094 1.60209 6.6001 1.97467 5.73783C2.34725 4.87555 2.85182 4.1259 3.48838 3.48887C4.12494 2.85184 4.87459 2.34727 5.73734 1.97516C6.60009 1.60305 7.52092 1.41699 8.49984 1.41699C9.47875 1.41699 10.3996 1.60305 11.2623 1.97516C12.1251 2.34727 12.8747 2.85184 13.5113 3.48887C14.1479 4.1259 14.6527 4.87555 15.0257 5.73783C15.3988 6.6001 15.5846 7.52094 15.5832 8.50033C15.5818 9.47972 15.3957 10.4005 15.025 11.2628C14.6543 12.1251 14.1497 12.8748 13.5113 13.5118C12.8729 14.1488 12.1232 14.6536 11.2623 15.0262C10.4015 15.3988 9.48064 15.5846 8.49984 15.5837ZM8.49984 14.167C10.0818 14.167 11.4217 13.618 12.5196 12.5201C13.6175 11.4222 14.1665 10.0823 14.1665 8.50033C14.1665 6.91838 13.6175 5.57845 12.5196 4.48053C11.4217 3.38262 10.0818 2.83366 8.49984 2.83366C6.91789 2.83366 5.57796 3.38262 4.48005 4.48053C3.38213 5.57845 2.83317 6.91838 2.83317 8.50033C2.83317 10.0823 3.38213 11.4222 4.48005 12.5201C5.57796 13.618 6.91789 14.167 8.49984 14.167Z'
                                fill='#C5221F'
                              />
                            </svg>

                            <div className='text-sm'>
                              {product?.itemLevelIssues?.[0]?.description}
                            </div>
                          </div>

                          {/* rest of issues */}
                          {product.itemLevelIssues.length > 1 &&
                            !openIssues[product.productId] && (
                              <button
                                type='button'
                                className='text-blue-500 hover:underline text-sm mt-1'
                                onClick={() => toggleIssues(product.productId)}
                                aria-expanded='false'
                              >
                                +{product.itemLevelIssues.length - 1} more
                              </button>
                            )}

                          {openIssues[product.productId] && (
                            <div className='mt-2'>
                              <div className='space-y-1 pl-5 list-disc'>
                                {product.itemLevelIssues
                                  .slice(1)
                                  .map((iss, i) => (
                                    <li
                                      key={`${iss.code}-${i}`}
                                      className='text-sm'
                                    >
                                      {iss.description}
                                      {iss.documentation && (
                                        <>
                                          {' '}
                                          <a
                                            href={iss.documentation}
                                            target='_blank'
                                            rel='noreferrer'
                                            className='text-blue-500 hover:underline'
                                          >
                                            docs
                                          </a>
                                        </>
                                      )}
                                    </li>
                                  ))}
                              </div>

                              <button
                                type='button'
                                className='text-blue-500 hover:underline text-sm mt-2'
                                onClick={() => toggleIssues(product.productId)}
                                aria-expanded='true'
                              >
                                Show less
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        'No issues found'
                      )}
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
