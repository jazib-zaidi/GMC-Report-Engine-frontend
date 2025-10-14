import { useEffect, useState } from 'react';
import FeedValidationTool from './AuditFeed/FeedValidationTool';
import { useAuth } from '@/context/AuthContext';
import PerformanceDashboardSkeleton from '@/components/dashboard/PerformanceDashboardSkeleton';
import GoBack from '@/components/GoBack';

const AuditFeed = () => {
  const [feedUrl] = useState('');
  const { auditFeed } = useAuth();
  const [loading, setLoading] = useState(true);

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
