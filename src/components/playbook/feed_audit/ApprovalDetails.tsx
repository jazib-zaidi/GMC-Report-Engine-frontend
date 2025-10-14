import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ApprovalDetails: React.FC = () => {
  const navigate = useNavigate();
  const { destination: destParam } = useParams();
  const { auditFeedData } = useAuth() as any;
  // Show skeleton while audit feed data is not yet available
  if (!auditFeedData) {
    return (
      <div>
        <Skeleton className='h-6 w-48 mb-4' />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8'>
          <Card className='p-4'>
            <Skeleton className='h-5 w-40 mb-3' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-2/3' />
            </div>
          </Card>
          <Card className='p-4'>
            <Skeleton className='h-5 w-40 mb-3' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-2/3' />
            </div>
          </Card>
          <Card className='p-4'>
            <Skeleton className='h-5 w-40 mb-3' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-2/3' />
            </div>
          </Card>
        </div>
        <Skeleton className='h-5 w-56 mb-2' />
        <div className='border rounded-md'>
          <div className='p-3 border-b flex gap-4'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-24' />
          </div>
          <div className='p-3 space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
          </div>
        </div>
      </div>
    );
  }

  const destination = decodeURIComponent(destParam || '').trim();
  const accountProducts: any[] = auditFeedData?.accountstatuses?.products || [];

  // Normalize and filter by destination
  const rows = useMemo(() => {
    const norm = (s: string) => String(s || '').toLowerCase();
    return accountProducts.filter(
      (p) => norm(p.destination) === norm(destination)
    );
  }, [accountProducts, destination]);

  const formatNumber = (v: any) =>
    new Intl.NumberFormat('en-US').format(Number(v || 0));
  const pct = (num: number, den: number) =>
    den === 0 ? 0 : Math.floor((num / den) * 100);

  // Gather item-level issues across filtered rows
  const issues = useMemo(() => {
    const list = rows.flatMap((r: any) => r.itemLevelIssues || []);
    return list;
  }, [rows]);

  // Filters and sorting for issues
  const [servabilityFilter, setServabilityFilter] = useState<string>('All');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const availableServabilities = useMemo(() => {
    const set = new Set<string>();
    for (const it of issues) {
      const val = String(it?.servability || '').toLowerCase();
      if (val) set.add(val);
    }
    return Array.from(set).sort();
  }, [issues]);

  const filteredIssues = useMemo(() => {
    let arr = issues;
    if (servabilityFilter !== 'All') {
      const target = servabilityFilter.toLowerCase();
      arr = arr.filter(
        (it: any) => String(it?.servability || '').toLowerCase() === target
      );
    }
    const sorted = [...arr].sort((a: any, b: any) => {
      const na = Number(a.numItems || 0);
      const nb = Number(b.numItems || 0);
      return sortDir === 'asc' ? na - nb : nb - na;
    });
    return sorted;
  }, [issues, servabilityFilter, sortDir]);

  return (
    <div>
      <Button
        variant='link'
        className='px-0'
        onClick={() => navigate('/playbook/feed-audit?skipFetch=true')}
      >
        &larr; Back to Feed Audit
      </Button>

      <h1 className='text-2xl font-semibold my-3'>
        {destination || 'Approvals'} Details
      </h1>

      {rows.length === 0 ? (
        <p className='text-sm text-muted-foreground'>
          No data found for this destination.
        </p>
      ) : (
        <>
          <div className='grid grid-cols-3 gap-2'>
            {rows.map((r, idx) => {
              const stats = r.statistics || {};
              const active = Number(stats.active || 0);
              // const pending = Number(stats.pending || 0);
              const disapproved = Number(stats.disapproved || 0);
              // const expiring = Number(stats.expiring || 0);
              const approvalPct = pct(active, active + disapproved);
              const totalIssues = r.itemLevelIssues.length;
              const badgeColor =
                approvalPct >= 90
                  ? 'bg-[#edfcf3] text-[#23c45f]'
                  : approvalPct >= 70
                  ? 'bg-[#fffbe8] text-[#f39e0c]'
                  : 'bg-[#fef1f1] text-[#ef4443]';
              return (
                <Card
                  key={idx}
                  className='p-4 border border-gray-200 rounded-xl shadow-sm gap-2'
                >
                  <CardTitle className='text-base font-semibold mb-2'>
                    {r.country} · {String(r.channel || '').toLowerCase()}
                  </CardTitle>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-600'>Approval</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${badgeColor}`}
                    >
                      {approvalPct}%
                    </span>
                  </div>
                  <div className='mt-3 grid grid-cols-2 gap-2 text-sm'>
                    <div className='flex items-center justify-between border rounded-md px-2 py-1'>
                      <span className='text-gray-600'>Active</span>
                      <span className='font-semibold'>
                        {formatNumber(active)}
                      </span>
                    </div>

                    <div className='flex items-center justify-between border rounded-md px-2 py-1'>
                      <span className='text-gray-600'>Disapproved</span>
                      <span className='font-semibold'>
                        {formatNumber(disapproved)}
                      </span>
                    </div>
                  </div>
                  <div className='mt-3 flex items-center justify-between text-sm'>
                    <span className='text-gray-600'>Total issues</span>
                    <span className='font-semibold'>
                      {formatNumber(totalIssues)}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className='mb-3 mt-5'>
            <div className='flex items-end justify-between gap-3 flex-wrap'>
              <div>
                <h2 className='text-lg font-semibold'>Item-level issues</h2>
                <p className='text-sm text-muted-foreground'>
                  {filteredIssues.length} issues listed for this destination
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <label className='text-sm text-gray-700'>Servability</label>
                <select
                  className='border rounded-md p-1 text-sm'
                  value={servabilityFilter}
                  onChange={(e) => setServabilityFilter(e.target.value)}
                >
                  <option value='All'>All</option>
                  {availableServabilities.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <label className='text-sm text-gray-700'>Sort</label>
                <select
                  className='border rounded-md p-1 text-sm'
                  value={sortDir}
                  onChange={(e) => setSortDir(e.target.value as 'asc' | 'desc')}
                >
                  <option value='desc'>Affected items (High → Low)</option>
                  <option value='asc'>Affected items (Low → High)</option>
                </select>
              </div>
            </div>
          </div>
          <Card>
            {filteredIssues.length === 0 ? (
              <p className='text-sm text-muted-foreground'>
                No issues to display.
              </p>
            ) : (
              <div className='border rounded-md overflow-hidden'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-[10%]'>Title</TableHead>
                      <TableHead className='w-[12%]'>Servability</TableHead>

                      <TableHead className='w-[14%]'>Attribute</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className='text-right w-[10%]'>
                        Affected Items
                      </TableHead>
                      <TableHead className='w-[12%]'>Docs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIssues.map((it: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className='font-medium'>
                          {it.description}
                        </TableCell>
                        <TableCell className='capitalize'>
                          {String(it.servability || '').toLowerCase()}
                        </TableCell>

                        <TableCell>{it.attributeName || '-'}</TableCell>
                        <TableCell>
                          <div className='text-sm text-gray-800'>
                            {it.description}
                          </div>
                          {it.detail && (
                            <div className='text-xs text-gray-600 mt-1'>
                              {it.detail}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className='text-right'>
                          {formatNumber(it.numItems)}
                        </TableCell>
                        <TableCell>
                          {it.documentation ? (
                            <a
                              href={it.documentation}
                              target='_blank'
                              rel='noreferrer'
                              className='text-blue-600 underline text-sm'
                            >
                              Link
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default ApprovalDetails;
