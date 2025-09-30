import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import FeedValidationTool from './AuditFeed/FeedValidationTool';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import PerformanceDashboardSkeleton from '@/components/dashboard/PerformanceDashboardSkeleton';
import GoBack from '@/components/GoBack';

const AuditFeed = () => {
  const [showOnMount, setShowOnMount] = useState(false);
  const [feedUrl, setFeedUrl] = useState('');
  const { auditFeed } = useAuth();
  const [loading, setLoading] = useState(true);
  // Run only on mount
  useEffect(() => {
    setShowOnMount(true);
  }, []);

  const match = feedUrl.match(/f\.feedops\.com\/([^_]+)/);
  const domain = match ? match[1] : null;

  const handleSubmit = async () => {
    setLoading(true);
    await auditFeed(feedUrl);
    setLoading(false);
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <div className='container mx-auto px-4'>
      <GoBack />

      {loading ? (
        <PerformanceDashboardSkeleton />
      ) : (
        <FeedValidationTool domain={'domain'} />
      )}
    </div>
  );
};

export default AuditFeed;
