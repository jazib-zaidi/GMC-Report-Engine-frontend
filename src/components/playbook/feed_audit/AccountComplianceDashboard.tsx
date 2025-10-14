// components/AccountComplianceDashboard.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AccountCompliance from './AccountCompliance';
import { useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Utility to map API data to dashboard structure
function mapAuditDataToDashboard(auditData: any) {
  console.log(auditData);
  const account = auditData.account || {};
  const feeds = auditData.allFeed?.resources || [];
  const status = auditData.accountstatuses || {};

  const accountName = account.name || '';
  const accountId = account.id || '';
  const website = account.websiteUrl || '';
  const phone = account.businessInformation?.phoneNumber || '';
  // Build full address string from businessInformation.address
  const addr = account.businessInformation?.address || {};
  const street =
    typeof addr.streetAddress === 'string'
      ? addr.streetAddress.replace(/\n/g, '').trim()
      : '';
  const locality = addr.locality || '';
  const stateRegion = addr.region || '';
  const postalCode = addr.postalCode || '';
  const country = addr.country || '';
  const region = [
    street,
    [locality, stateRegion].filter(Boolean).join(', '),
    [postalCode, country].filter(Boolean).join(', '),
  ]
    .filter((part) => part && String(part).trim().length > 0)
    .join(', ');
  const complianceScore = 17; // Placeholder, calculate if available
  const feedsCount = feeds.length;

  // Sections: Example for Account Issues, Business Info, Homepage, Programs, Shipping, Return Policy
  const sections: any[] = [];

  // Account Issues
  const adsLinked = account.adsLinks && account.adsLinks.length > 0;
  const websiteClaimed = status.websiteClaimed;
  const accountIssues = [];
  if (!adsLinked) {
    accountIssues.push({
      type: 'No Google Ads account linked',
      severity: 'ERROR',
      detail: 'Link your Google Ads account to Merchant Center to create ads.',
    });
  }
  if (!websiteClaimed) {
    accountIssues.push({
      type: 'Unclaimed website',
      severity: 'CRITICAL',
      detail: 'Make sure your website is verified and claimed.',
    });
  }
  if (accountIssues.length > 0) {
    sections.push({
      title: 'Account Issues',
      status: accountIssues.length > 0 ? 'FAIL' : 'PASS',
      issues: accountIssues,
    });
  }
  const hasAccountWarnings = accountIssues.length > 0;

  // Business Information (expanded details)
  const businessInfoIssues: any[] = [];

  // Address
  if (region && region.trim()) {
    businessInfoIssues.push({
      type: 'Business Address',
      severity: 'VERIFIED',
      detail: region,
    });
  } else {
    businessInfoIssues.push({
      type: 'Business Address',
      severity: 'INCOMPLETE',
      detail: 'Address lines are empty.',
    });
  }

  // Business Phone (value) and Phone Verification (status)
  if (phone && String(phone).trim()) {
    businessInfoIssues.push({
      type: 'Business Phone',
      severity: 'SET',
      detail: String(phone),
    });
  } else {
    businessInfoIssues.push({
      type: 'Business Phone',
      severity: 'INCOMPLETE',
      detail: 'No business phone provided.',
    });
  }

  if (account.businessInformation?.phoneVerificationStatus === 'VERIFIED') {
    businessInfoIssues.push({
      type: 'Phone Verification',
      severity: 'VERIFIED',
      detail: 'Phone number verified.',
    });
  } else {
    businessInfoIssues.push({
      type: 'Phone Verification',
      severity: 'UNVERIFIED',
      detail: 'Phone number needs to be verified.',
    });
  }

  // Customer Service details
  const cs = account.businessInformation?.customerService || {};
  if (cs.url && String(cs.url).trim()) {
    businessInfoIssues.push({
      type: 'Customer Service URL',
      severity: 'SET',
      detail: String(cs.url),
    });
  } else {
    businessInfoIssues.push({
      type: 'Customer Service URL',
      severity: 'INCOMPLETE',
      detail: 'Customer service URL not provided.',
    });
  }
  if (cs.email && String(cs.email).trim()) {
    businessInfoIssues.push({
      type: 'Customer Service Email',
      severity: 'SET',
      detail: String(cs.email),
    });
  } else {
    businessInfoIssues.push({
      type: 'Customer Service Email',
      severity: 'INCOMPLETE',
      detail: 'Customer service email not provided.',
    });
  }
  if (cs.phoneNumber && String(cs.phoneNumber).trim()) {
    businessInfoIssues.push({
      type: 'Customer Service Phone',
      severity: 'SET',
      detail: String(cs.phoneNumber),
    });
  } else {
    businessInfoIssues.push({
      type: 'Customer Service Phone',
      severity: 'INCOMPLETE',
      detail: 'Customer service phone not provided.',
    });
  }

  // Country code (explicit)
  if (country) {
    businessInfoIssues.push({
      type: 'Country Code',
      severity: 'SET',
      detail: String(country),
    });
  }

  if (businessInfoIssues.length > 0) {
    const hasNegative = businessInfoIssues.some((it) =>
      ['INCOMPLETE', 'UNVERIFIED'].includes(it.severity)
    );
    sections.push({
      title: 'Business Information',
      status: hasNegative ? 'FAIL' : 'PASS',
      issues: businessInfoIssues,
    });
  }

  // Homepage Claimed
  const homepageIssues = [];
  if (website) {
    homepageIssues.push({
      type: 'Website URI',
      severity: 'SET',
      detail: 'Homepage URL is configured.',
    });
  }
  if (!websiteClaimed) {
    homepageIssues.push({
      type: 'Claimed Status',
      severity: 'UNCLAIMED',
      detail: 'Website must be verified and claimed.',
    });
  }
  if (homepageIssues.length > 0) {
    sections.push({
      title: 'Homepage Claimed',
      status: websiteClaimed ? 'PASS' : 'FAIL',
      issues: homepageIssues,
    });
  }

  // Programs Enabled (dynamic)
  const destMap: Record<
    string,
    { countries: Set<string>; channels: Set<string> }
  > = {};
  const productStatuses = status.products || [];
  for (const ps of productStatuses) {
    const dest = ps.destination;
    if (!dest) continue;
    if (!destMap[dest])
      destMap[dest] = { countries: new Set(), channels: new Set() };
    if (ps.country) destMap[dest].countries.add(ps.country);
    if (ps.channel) destMap[dest].channels.add(ps.channel);
  }

  for (const feed of feeds) {
    const targets = feed.targets || [];
    for (const t of targets) {
      const included = t.includedDestinations || [];
      const countries: string[] = [];
      if (Array.isArray(t.targetCountries))
        countries.push(...t.targetCountries);
      if (t.country) countries.push(t.country);
      for (const d of included) {
        if (!destMap[d])
          destMap[d] = { countries: new Set(), channels: new Set() };
        countries.forEach((c) => c && destMap[d].countries.add(c));
      }
    }
  }

  const labelForDestination = (d: string) => {
    const map: Record<string, string> = {
      Shopping: 'Shopping Ads',
      DisplayAds: 'Display Ads',
      SurfacesAcrossGoogle: 'Surfaces across Google',
      LocalSurfacesAcrossGoogle: 'Local surfaces across Google',
      YouTubeShopping: 'YouTube Shopping',
      FreeListings: 'Free listings',
    };
    return map[d] || d;
  };

  const programs: any[] = Object.keys(destMap).map((d) => {
    const info = destMap[d];
    const countries = Array.from(info.countries);
    const channels = Array.from(info.channels);
    const detailParts: string[] = [];
    if (channels.length) detailParts.push(`Channels: ${channels.join(', ')}`);
    if (countries.length)
      detailParts.push(`Countries: ${countries.join(', ')}`);
    return {
      type: labelForDestination(d),
      severity: 'ENABLED',
      detail: detailParts.join(' | ') || 'Enabled',
    };
  });

  // Optional extras inferred from account
  if (account.googleMyBusinessLink?.status === 'active') {
    programs.push({
      type: 'Google Business Profile',
      severity: 'ENABLED',
      detail: `Linked as ${
        account.googleMyBusinessLink.gmbEmail ||
        account.googleMyBusinessLink.gmbAccountId
      }`,
    });
  }
  if (account.conversionSettings?.freeListingsAutoTaggingEnabled) {
    programs.push({
      type: 'Free listings auto-tagging',
      severity: 'ENABLED',
      detail: 'Auto-tagging for free listings is enabled.',
    });
  }

  if (programs.length > 0) {
    sections.push({
      title: 'Programs Enabled',
      status: 'PASS',
      issues: programs,
    });
  }

  // Shipping Settings
  const shippingIssues = [];
  // If no shipping settings found in feeds
  if (!feeds.some((f: any) => f.name?.toLowerCase().includes('shipping'))) {
    shippingIssues.push({
      type: 'ShippingSetting',
      severity: 'NOT_FOUND',
      detail: 'Shipping setting not found for account.',
    });
  }
  if (shippingIssues.length > 0) {
    sections.push({
      title: 'Shipping Settings',
      status: 'FAIL',
      issues: shippingIssues,
    });
  }

  // Return Policy
  const returnPolicyIssues = [];
  // If no return policy found (not present in account)
  if (!account.returnPolicies) {
    returnPolicyIssues.push({
      type: 'Return Policy',
      severity: 'NOT_FOUND',
      detail: 'No return policy found for your account.',
    });
  }
  if (returnPolicyIssues.length > 0) {
    sections.push({
      title: 'Return Policy',
      status: 'FAIL',
      issues: returnPolicyIssues,
    });
  }

  return {
    accountName,
    accountId,
    website,
    phone,
    region,
    phoneVerificationStatus: account.businessInformation?.phoneVerificationStatus || '',
    complianceScore,
    feeds: feedsCount,
    sections,
    hasAccountWarnings,
  };
}

// Accepts auditData prop
export default function AccountComplianceDashboard() {
  const { auditFeedData } = useAuth(); // Replace with actual data fetching logic
  const data = useMemo(
    () => mapAuditDataToDashboard(auditFeedData),
    [auditFeedData]
  );

  const getSectionBg = (status: string) => {
    const s = String(status || '').toLowerCase();
    const hasPass = s.includes('pass');
    const hasFail = s.includes('fail');
    if (hasPass && !hasFail) return 'bg-green-50 border-green-200'; // all pass
    if (hasFail && !hasPass) return 'bg-[#fff7f6] border-red-200'; // all fail
    return 'bg-yellow-50 border-yellow-200'; // warning for mixed/other statuses
  };
  console.log(data.feeds);
  return (
    <div className='max-w-6xl mx-auto p-6 space-y-8'>
      <Button variant='link' asChild>
        <Link to='/playbook/feed-audit?skipFetch=true'>
          &larr; Back to Feed Audit
        </Link>
      </Button>
      <AccountCompliance
        accountName={data.accountName}
        accountId={data.accountId}
        website={data.website}
        phone={data.phone}
        phoneVerificationStatus={data.phoneVerificationStatus}
        region={data.region}
        complianceScore={data.complianceScore}
        feeds={data.feeds}
        hasAccountWarnings={data.hasAccountWarnings}
        feedsList={auditFeedData?.allFeed?.resources || []}
      />

      <Card className='p-4 w-full mx-auto shadow-sm rounded-2xl'>
        <CardHeader className=''>
          <CardTitle className='text-xl p-0 font-semibold flex items-center gap-2'>
            <ShieldCheck /> Compliance Checks
          </CardTitle>
        </CardHeader>
        <Accordion type='multiple' className='px-8'>
          {data.sections.map((section: any, i: number) => (
            <AccordionItem
              className={`border px-2 rounded-md mb-2 ${getSectionBg(
                section.status
              )}`}
              key={i}
              value={`item-${i}`}
            >
              <AccordionTrigger className='text-md font-normal '>
                <div className='flex items-center gap-2'>
                  <span>{section.title}</span>
                  {section.status.includes('PASS') ? (
                    <Badge variant='success'>✓ {section.status}</Badge>
                  ) : (
                    <Badge variant='destructive'>✗ {section.status}</Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className='bg-gray-50'>
                  <CardContent className='pt-4'>
                    <table className='w-full text-sm '>
                      <thead>
                        <tr className='text-left border-b'>
                          <th className='pb-2'>Issue Type</th>
                          <th className='pb-2'>Detail</th>
                          <th className='pb-2'>Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.issues.map((issue: any, j: number) => (
                          <tr key={j} className='border-b'>
                            <td className='py-2'>{issue.type}</td>
                            <td className='py-2'>{issue.detail}</td>
                            <td className='py-2'>
                              <Badge
                                variant={
                                  [
                                    'CRITICAL',
                                    'ERROR',
                                    'UNVERIFIED',
                                    'INCOMPLETE',
                                  ].includes(issue.severity)
                                    ? 'destructive'
                                    : [
                                        'ENABLED',
                                        'ELIGIBLE',
                                        'VERIFIED',
                                      ].includes(issue.severity)
                                    ? 'success'
                                    : 'secondary'
                                }
                              >
                                {issue.severity}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}
