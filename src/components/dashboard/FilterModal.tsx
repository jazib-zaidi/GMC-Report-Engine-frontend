import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ComparisonPeriod from '../ComparisonPeriod';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface FilterModalProps {
  openByDefault?: boolean; // if true → modal opens on mount
}

const FilterModal: React.FC<FilterModalProps> = ({ openByDefault = false }) => {
  const [open, setOpen] = useState(false);
  const {
    user,
    logout,
    merchantAccounts,
    setMerchantSelect,
    setReportData,
    merchantSelect,
    fetchGoogleProductCategory,
    setSelectedDateRange,
    setFilter,
    setStartFetching,
    startFetching,
    setShowFilterModal,
  } = useAuth();

  useEffect(() => {
    if (openByDefault) {
      setOpen(true);
    }
  }, [openByDefault]);

  const fetchData = () => {
    if (selectedMerchant) {
      setMerchantSelect({
        id: selectedMerchant.merchantId,
        name: selectedMerchant.name,
      });
      setFilter({});
      let date = {
        endDate: new Date(),
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      };

      const formattedCurrentStart = format(date.startDate, 'yyyy-MM-dd');
      const formattedCurrentEnd = format(date.endDate, 'yyyy-MM-dd');

      let selectedRange = {
        startDate: formattedCurrentStart,
        endDate: formattedCurrentEnd,
      };

      setSelectedDateRange(selectedRange);

      toast.promise(fetchGoogleProductCategory(selectedMerchant.merchantId), {
        loading: <b> Fetching Google Product Category, please wait...</b>,
        success: <b>Google Product Category successfully loaded!</b>,
        error: (
          <b>
            Failed to load Google Product Category. Please try refreshing the
            page. or Login again
          </b>
        ),
      });
      localStorage.setItem('previousType', 'year');
      setReportData(null);
    }
  };

  useEffect(() => {
    let date = {
      endDate: new Date(),
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    };

    const formattedCurrentStart = format(date.startDate, 'yyyy-MM-dd');
    const formattedCurrentEnd = format(date.endDate, 'yyyy-MM-dd');

    let selectedRange = {
      startDate: formattedCurrentStart,
      endDate: formattedCurrentEnd,
    };

    setSelectedDateRange(selectedRange);
  }, []);

  const handleApply = () => {
    setOpen(false);
    setStartFetching(!startFetching);
    setShowFilterModal(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger is optional if you also want manual opening */}
      <Button variant='outline' onClick={() => setOpen(true)}>
        Filters
      </Button>

      <DialogContent
        className='
    sm:max-w-4xl
    w-full
    top-10
    translate-y-0
    left-1/2 -translate-x-1/2
    fixed
    rounded-2xl
  '
      >
        <DialogHeader>
          <DialogTitle>Filter Options</DialogTitle>
          <DialogDescription>
            Compares performance of items that had impressions during the same
            period.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <ComparisonPeriod />
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='secondary'
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type='button' onClick={handleApply}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
