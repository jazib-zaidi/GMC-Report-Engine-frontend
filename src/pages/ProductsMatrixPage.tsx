import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';

type PerfType =
  | 'withImpressions'
  | 'withClicks'
  | 'withoutImpressions'
  | 'withoutClicks';

export default function ProductsMatrixPage() {
  const { fetchProductsMatrixPaginated } = useAuth() as any;
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = (params.type as PerfType) || 'withoutClicks';
  const pageSize = Number(searchParams.get('pageSize') || 100);
  const pageToken = searchParams.get('pageToken') || undefined;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();

  const toNumber = (v: any): number => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const formatCompact = (v: any): string =>
    new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(toNumber(v));

  const formatPercent = (v: any): string => {
    const n = toNumber(v);
    const pct = n <= 1 ? n * 100 : n;
    return `${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(pct)}%`;
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchProductsMatrixPaginated(
          type,
          pageSize,
          pageToken
        );
        if (!cancelled && res) {
          setItems(res.items || []);
          setNextPageToken(res.nextPageToken);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to fetch');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [type, pageSize, pageToken]);

  const title = useMemo(() => {
    const map: Record<PerfType, string> = {
      withImpressions: 'Products With Impressions',
      withClicks: 'Clicked Products',
      withoutImpressions: 'Products Without Impressions',
      withoutClicks: 'Unclicked Products',
    };
    return map[type] || type;
  }, [type]);

  const gotoNext = () => {
    if (nextPageToken) {
      setSearchParams((prev) => {
        const p = new URLSearchParams(prev);
        p.set('pageSize', String(pageSize));
        p.set('pageToken', nextPageToken!);
        return p;
      });
    }
  };

  const resetPaging = () => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('pageSize', String(pageSize));
      p.delete('pageToken');
      return p;
    });
  };

  return (
    <div className='container mx-auto px-4 py-6'>
      <Button variant='link' asChild>
        <Link to='/playbook/feed-audit?skipFetch=true'>
          &larr; Back to Feed Audit
        </Link>
      </Button>
      <h1 className='text-2xl font-semibold mb-4'>{title}</h1>

      <Card className='p-4'>
        <div className='flex items-center justify-between mb-3'>
          <div className='text-sm text-muted-foreground'>
            Page size: {pageSize}
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              disabled={!nextPageToken || loading}
              onClick={gotoNext}
            >
              Next Page
            </Button>
            <Button
              variant='ghost'
              disabled={loading || !pageToken}
              onClick={resetPaging}
            >
              Reset
            </Button>
          </div>
        </div>

        {error && <div className='text-sm text-red-600 mb-3'>{error}</div>}

        {loading ? (
          <div className='space-y-2'>
            <Skeleton className='h-6 w-40' />
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-full' />
            <Skeleton className='h-6 w-full' />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className='text-right'>Clicks</TableHead>
                <TableHead className='text-right'>Impressions</TableHead>
                <TableHead className='text-right'>CTR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='text-center text-sm text-muted-foreground'
                  >
                    No items found.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className='font-mono text-xs'>
                      {p.segments?.offerId}
                    </TableCell>
                    <TableCell className='max-w-[420px] truncate'>
                      {p.segments?.title}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatCompact(p.metrics?.clicks ?? 0)}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatCompact(p.metrics?.impressions ?? 0)}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatPercent(p.metrics?.ctr ?? 0)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
