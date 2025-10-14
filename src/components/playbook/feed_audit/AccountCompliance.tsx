import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Globe,
  Phone,
  MapPin,
  Building2,
  Wifi,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMemo, useState } from 'react';

interface AccountComplianceProps {
  accountName: string;
  accountId: string;
  website: string;
  phone: string;
  phoneVerificationStatus?: string;
  region: string;
  complianceScore: number;
  feeds: number;
  hasAccountWarnings?: boolean;
  feedsList?: any[];
}

export default function AccountCompliance(props: AccountComplianceProps) {
  const {
    accountName,
    accountId,
    website,
    phone,
    phoneVerificationStatus = '',
    region,
    complianceScore,
    feeds,
    hasAccountWarnings = false,
    feedsList = [],
  } = props;

  const hasPhone = typeof phone === 'string' && phone.trim().length > 0;
  const isOnlyCountryAU =
    typeof region === 'string' && region.trim().toUpperCase() === 'AU';
  const hasAddress =
    typeof region === 'string' && region.trim().length > 0 && !isOnlyCountryAU;

  const [open, setOpen] = useState(false);
  console.log(feedsList);
  const rows = useMemo(() => {
    return (feedsList || []).map((f: any) => {
      const targets = Array.isArray(f.targets) ? f.targets : [];
      const destinations = Array.from(
        new Set(
          targets.flatMap(
            (t: any) => (t?.includedDestinations || []) as string[]
          )
        )
      ).join(', ');
      const excludedDestinations = Array.from(
        new Set(
          targets.flatMap(
            (t: any) => (t?.excludedDestinations || []) as string[]
          )
        )
      ).join(', ');
      const countries = Array.from(
        new Set(
          targets.flatMap((t: any) => {
            const arr: string[] = [];
            if (Array.isArray(t?.targetCountries))
              arr.push(...t.targetCountries);
            if (t?.country) arr.push(t.country);
            return arr;
          })
        )
      ).join(', ');
      const labels = Array.from(
        new Set(targets.map((t: any) => t?.feedLabel).filter(Boolean))
      ).join(', ');
      const languages = Array.from(
        new Set(targets.map((t: any) => t?.language).filter(Boolean))
      ).join(', ');
      return {
        id: f.id,
        name: f.name,
        contentType: f.contentType,
        fileName: f.fileName,
        fetchUrl: f.fetchSchedule?.fetchUrl,
        timeZone: f.fetchSchedule?.timeZone,
        hour: f.fetchSchedule?.hour,
        destinations,
        excludedDestinations,
        countries,
        labels,
        languages,
        paused: f.fetchSchedule?.paused === true,
      };
    });
  }, [feedsList]);

  return (
    <Card className=' w-full mx-auto shadow-sm rounded-2xl'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-xl font-semibold'>
          Account Compliance
        </CardTitle>
      </CardHeader>

      <CardContent className='grid grid-cols-1 md:grid-cols-6 gap-6 items-center'>
        {/* Compliance Score */}
        <div className='flex flex-col items-center justify-center space-y-2'>
          <div className='text-2xl font-bold text-red-500'>
            {complianceScore}%
          </div>
          {hasAccountWarnings && (
            <div className='flex items-center text-sm text-yellow-600 font-medium'>
              <AlertTriangle className='h-4 w-4 mr-1' />
              Suspension warning
            </div>
          )}
        </div>

        {/* Total Feeds */}
        <div className='text-center border-l md:pl-4'>
          <div className='flex text-sm justify-center items-center gap-2 text-gray-600 mb-1'>
            <Wifi className='h-4 w-4' /> Total Feeds
          </div>
          <div className='text-xl font-semibold'>{feeds}</div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant='link' className='text-blue-600 text-sm mt-1'>
                View All Feed
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-6xl '>
              <DialogHeader>
                <DialogTitle>All Feeds</DialogTitle>
              </DialogHeader>
              <div className='overflow-auto max-h-[70vh]'>
                <table className='w-full text-sm table-auto'>
                  <thead>
                    <tr className='text-left border-b sticky top-0 bg-white'>
                      <th className='py-2 pr-4'>ID</th>
                      <th className='py-2 pr-4'>Name</th>
                      <th className='py-2 pr-4'>Type</th>
                      <th className='py-2 pr-4'>Label</th>
                      <th className='py-2 pr-4'>Language</th>

                      <th className='py-2 pr-4'>Countries</th>

                      <th className='py-2 pr-4'>Fetch URL</th>
                      <th className='py-2 pr-4'>Time Zone</th>
                      <th className='py-2 pr-4'>Hour</th>
                      <th className='py-2 pr-4'>Paused</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, idx) => (
                      <tr key={idx} className='border-b'>
                        <td className='py-2 pr-4 whitespace-nowrap text-xs text-gray-600'>
                          {r.id}
                        </td>
                        <td
                          className='py-2 pr-4 max-w-[160px] truncate'
                          title={r.name}
                        >
                          {r.name}
                        </td>
                        <td className='py-2 pr-4 whitespace-nowrap'>
                          {r.contentType}
                        </td>
                        <td
                          className='py-2 pr-4 max-w-[120px] truncate'
                          title={r.labels}
                        >
                          {r.labels || '-'}
                        </td>
                        <td className='py-2 pr-4 whitespace-nowrap'>
                          {r.languages || '-'}
                        </td>

                        <td
                          className='py-2 pr-4 max-w-[140px] truncate'
                          title={r.countries}
                        >
                          {r.countries}
                        </td>

                        <td
                          className='py-2 pr-4 max-w-[220px] truncate'
                          title={r.fetchUrl}
                        >
                          {r.fetchUrl ? (
                            <a
                              href={r.fetchUrl}
                              className='text-blue-600 hover:underline'
                              target='_blank'
                              rel='noreferrer'
                            >
                              {r.fetchUrl}
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className='py-2 pr-4 whitespace-nowrap'>
                          {r.timeZone || '-'}
                        </td>
                        <td className='py-2 pr-4 text-center'>
                          {r.hour ?? '-'}
                        </td>
                        <td className='py-2 pr-4 whitespace-nowrap'>
                          {r.paused ? (
                            <Badge variant='secondary'>Paused</Badge>
                          ) : (
                            <Badge variant='success'>Active</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Account Name */}
        <div className='text-center border-l md:pl-4'>
          <div className='flex text-sm justify-center items-center gap-2 text-gray-600 mb-1'>
            <Building2 className='h-4 w-4' /> Account Name
          </div>
          <div className='text-sm font-semibold'>{accountName}</div>
          <div className='text-[12px] text-gray-500'>
            Account ID: {accountId}
          </div>
        </div>

        {/* Website */}
        <div className='text-center border-l md:pl-4'>
          <div className='flex text-sm justify-center items-center gap-2 text-gray-600 mb-1'>
            <Globe className='h-4 w-4' /> Website
          </div>
          <a
            href={website}
            className='text-blue-600 font-medium text-[12px] hover:underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            {website.replace(/^https?:\/\//, '')}
          </a>
          {/* Could add claimed status badge here if needed */}
        </div>

        {/* Phone Number */}
        <div className='text-center border-l md:pl-4'>
          <div className='flex text-sm  justify-center items-center gap-2 text-gray-600 mb-1'>
            <Phone className='h-4 w-4' /> Phone Number
          </div>
          <div className='text-[12px] font-semibold'>
            {hasPhone ? phone : '-'}
          </div>
          <div className='mt-1 flex items-center justify-center'>
            {!hasPhone ? (
              <Badge variant='destructive' className='text-xs'>
                Not Provided
              </Badge>
            ) : phoneVerificationStatus === 'VERIFIED' ? (
              <Badge variant='success' className='text-xs'>
                Verified
              </Badge>
            ) : (
              <Badge variant='secondary' className='text-xs'>
                Unverified
              </Badge>
            )}
          </div>
        </div>
        <div className='text-center border-l md:pl-4'>
          <div className='flex text-sm  gap-1 text-gray-600 mb-1'>
            <MapPin className='h-4 w-4 text-gray-600' /> Business Address
          </div>
          <div className='text-[12px] font-semibold'>
            {hasAddress ? region : '-'}
          </div>
          {!hasAddress && (
            <Badge variant='destructive' className='mt-1 text-xs'>
              Not Verified
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
