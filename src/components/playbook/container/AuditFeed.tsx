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
import { Button } from '@/components/ui/Button';
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
    setShowOnMount(false);
    await auditFeed(feedUrl);
    setLoading(false);
    await auditFeed(feedUrl, true);
  };

  const feedValidationModal = () => {
    return (
      <Dialog open={showOnMount} onOpenChange={setShowOnMount}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Audit Feed</DialogTitle>
            <DialogDescription>
              Paste your product feed URL to run automated validations and
              detect missing attributes, formatting issues, and optimization
              gaps.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4 space-y-3'>
            <Label htmlFor='feedUrl'>Enter Feed URL</Label>
            <Input
              id='feedUrl'
              type='text'
              placeholder='https://example.com/feed.xml'
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button className=' w-full' onClick={handleSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className='container mx-auto px-4'>
      <GoBack />
      {feedValidationModal()}
      {loading ? (
        <PerformanceDashboardSkeleton />
      ) : (
        <FeedValidationTool domain={domain} />
      )}
    </div>
  );
};

export default AuditFeed;
