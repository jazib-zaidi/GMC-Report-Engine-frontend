import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarketingMethodFilterNested } from './MarketingMethodFilter';

// Types
type Status = 'approved' | 'disapproved' | 'limited';

type Product = {
  productId: string;
  title: string;
  link: string;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  destinationStatuses: { destination: string; status: Status | string }[];
  itemLevelIssues: {
    code: string;
    description: string;
    documentation?: string;
    destination: string;
  }[];
};

type MethodState = Record<string, Status[]>;

export default function ProductStatusTable({
  products,
  method,
  matrix,
}: {
  products: Product[];
  method: string;
  matrix: boolean;
}) {
  const [openIssues, setOpenIssues] = useState<Record<string, boolean>>({});
  const [isAll, setIsAll] = useState<boolean>(method === 'all');
  const [methodState, setMethodState] = useState<MethodState>(
    method === 'all' ? {} : { [method]: ['approved', 'disapproved'] }
  );
  const [allProducts] = useState<Product[]>(products);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // change as needed

  const filteredProducts = isAll
    ? allProducts
    : allProducts.filter((p) =>
        p.destinationStatuses?.some((s) =>
          methodState[s.destination]?.includes(s.status as Status)
        )
      );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const allAvailableMethods =
    products[0]?.destinationStatuses?.map((s) => ({
      key: s.destination,
      label: s.destination,
    })) || [];

  const toggleIssues = (pid: string) =>
    setOpenIssues((prev) => ({ ...prev, [pid]: !prev[pid] }));

  // helper: is a given destination/status pair selected?
  const isSelected = (dest: string, status: string): boolean => {
    const sel = methodState[dest];
    if (!sel) return false;
    return sel.includes(status as Status);
  };

  // Compute overall status for a product given current filter
  const getOverallStatus = (
    p: Product,
    isAllMode: boolean,
    selected: MethodState
  ): Status => {
    const statuses = p.destinationStatuses ?? [];

    if (isAllMode) {
      if (statuses.length === 0) return 'approved';
      if (statuses.every((s) => s.status === 'approved')) return 'approved';
      if (statuses.every((s) => s.status === 'disapproved'))
        return 'disapproved';
      return 'limited';
    }

    const filtered = statuses.filter((s) =>
      selected[s.destination]?.includes(s.status as Status)
    );

    if (filtered.length === 0) return 'approved';
    if (filtered.every((s) => s.status === 'approved')) return 'approved';
    if (filtered.every((s) => s.status === 'disapproved')) return 'disapproved';
    return 'limited';
  };

  const findProductStatus = (product: Product) => {
    const overall = getOverallStatus(product, isAll, methodState);
    if (overall === 'disapproved')
      return <Badge variant='destructive'>Disapproved</Badge>;
    if (overall === 'limited') return <Badge variant='warning'>Limited</Badge>;
    return <Badge variant='success'>Approved</Badge>;
  };

  const buildFilter = () => {
    if (isAll) return null;
    return (
      <div className='text-[12px] border rounded-2xl p-1 px-4'>
        Method:{' '}
        {Object.entries(methodState).map(([m, sts]) => (
          <span key={m} className='ml-1'>
            {m} ({sts.join(', ')})
          </span>
        ))}
        <span onClick={() => setIsAll(true)} className='ml-2 cursor-pointer'>
          ✕
        </span>
      </div>
    );
  };

  const handleFilterAll = () => {
    setIsAll(true);
    setMethodState({});
  };

  const handleFilterApply = (val: MethodState) => {
    setMethodState(val);
    setIsAll(false);
    setCurrentPage(1); // reset pagination when filters change
  };

  return (
    <Card className='p-3'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center gap-2'>
          {buildFilter()}

          <MarketingMethodFilterNested
            eligibleMethods={allAvailableMethods}
            defaultSelection={isAll ? {} : methodState}
            onApply={handleFilterApply}
            handleAll={handleFilterAll}
            triggerLabel={isAll ? 'Add Filter' : 'Edit Filter'}
            isAll={isAll}
          />
        </div>
        <Button disabled title='Export is not available' variant='outline'>
          Export
        </Button>
      </div>

      <Table className='mt-6'>
        <TableCaption>Feed Audit Products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Approval Status</TableHead>
            {matrix && (
              <>
                <TableHead>Click</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>CTR</TableHead>
              </>
            )}
            <TableHead>Marketing Methods</TableHead>
            <TableHead>Error from Merchant Center</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts?.map((product, i) => (
            <TableRow key={i}>
              <TableCell className='font-mono text-xs'>
                {product.productId}
              </TableCell>
              <TableCell className='max-w-[250px] truncate'>
                <a
                  href={product.link}
                  target='_blank'
                  rel='noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  {product.title}
                </a>
              </TableCell>

              <TableCell className='py-4'>
                {findProductStatus(product)}
              </TableCell>
              {matrix && (
                <>
                  <TableCell className='py-4'>{product?.clicks || 0}</TableCell>
                  <TableCell className='py-4'>
                    {product?.impressions || 0}
                  </TableCell>
                  <TableCell className='py-4'>
                    {product?.ctr?.toFixed(2) || 0}
                  </TableCell>
                </>
              )}

              <TableCell className='py-4 text-start w-[164px]'>
                {isAll
                  ? product.destinationStatuses?.map((status) => (
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
                    ))
                  : product.destinationStatuses
                      .filter((s) =>
                        methodState[s.destination]?.includes(s.status as Status)
                      )
                      .map((status) => (
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

              <TableCell className='py-4 text-start w-[164px]'>
                {(() => {
                  const relevantIssues = isAll
                    ? product.itemLevelIssues
                    : product.itemLevelIssues?.filter(
                        (iss) => methodState[iss.destination]
                      );
                  console.log(methodState);
                  console.log(relevantIssues);
                  if (!relevantIssues || relevantIssues.length === 0) {
                    return 'No issues found';
                  }

                  // how many to show by default
                  const limit = 1;
                  const isExpanded = openIssues[product.productId] || false;
                  const visibleIssues = isExpanded
                    ? relevantIssues
                    : relevantIssues.slice(0, limit);

                  return (
                    <div className='flex flex-col items-start space-y-1'>
                      {visibleIssues.map((iss, idx) => (
                        <div
                          key={`${iss.code}-${idx}`}
                          className='text-sm font-mono px-1.5 py-0.5 rounded'
                        >
                          {iss.servability == 'unaffected'
                            ? 'Approved with warning:'
                            : '❌'}{' '}
                          {iss.description}{' '}
                          {iss.documentation && (
                            <a
                              href={iss.documentation}
                              target='_blank'
                              rel='noreferrer'
                              className='text-blue-500 hover:underline'
                            >
                              docs
                            </a>
                          )}
                        </div>
                      ))}

                      {relevantIssues.length > limit && (
                        <button
                          onClick={() =>
                            setOpenIssues((prev) => ({
                              ...prev,
                              [product.productId]: !prev[product.productId],
                            }))
                          }
                          className='text-xs text-blue-600 hover:underline mt-1'
                        >
                          {isExpanded
                            ? 'Show less'
                            : `Read more (${
                                relevantIssues.length - limit
                              } more)`}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className='flex justify-center items-center gap-2 mt-4'>
        <Button
          variant='outline'
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant='outline'
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}
