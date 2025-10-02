import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';

type Method =
  | 'freeListings'
  | 'shoppingAds'
  | 'dynamicRemarketing'
  | 'localListings';

type Status = 'approved' | 'disapproved';

type Selection = Record<Method, Status[]>;

const METHOD_OPTIONS: { key: Method; label: string }[] = [
  { key: 'freeListings', label: 'Free listings' },
  { key: 'shoppingAds', label: 'Shopping ads' },
  { key: 'dynamicRemarketing', label: 'Dynamic remarketing' },
  { key: 'localListings', label: 'Local listings' },
];

const STATUS_CHILDREN: { key: Status; label: string }[] = [
  { key: 'approved', label: 'Approved' },
  { key: 'disapproved', label: 'Disapproved' },
];

type Props = {
  /** Preload selection (e.g., { freeListings: ["approved","disapproved"] }) */
  defaultSelection?: Selection;
  /** Restrict which methods are selectable */
  eligibleMethods?: Method[];
  /** Called with the final selection map */
  onApply?: (selection: Selection) => void;
  triggerLabel?: string;
  handleAll?: () => void;
};

export function MarketingMethodFilterNested({
  defaultSelection,
  eligibleMethods,
  onApply,
  triggerLabel = 'Add Filter',
  handleAll,
  isAll,
}: Props) {
  const [open, setOpen] = React.useState(false);
  console.log(eligibleMethods);
  // default: nothing selected; when a method is checked we add both statuses by default
  const [selection, setSelection] = React.useState<Selection>(
    defaultSelection ?? {}
  );
  console.log(defaultSelection);
  console.log(selection);
  const isMethodDisabled = (m: Method) =>
    eligibleMethods ? !eligibleMethods.includes(m) : false;

  const methodChecked = (m: Method) =>
    !!selection[m] && selection[m]!.length > 0;

  const toggleMethod = (m: Method) => {
    setSelection((prev) => {
      const next = { ...prev };
      if (methodChecked(m)) {
        // unselect method entirely
        delete next[m];
      } else {
        // selecting a method -> default both statuses
        next[m] = ['approved', 'disapproved'];
      }
      return next;
    });
  };

  const toggleChild = (m: Method, s: Status) => {
    setSelection((prev) => {
      const next = { ...prev };
      const current = new Set(next[m] ?? []);
      if (current.has(s)) current.delete(s);
      else current.add(s);

      // if no children left, collapse method entirely
      if (current.size === 0) {
        delete next[m];
      } else {
        next[m] = Array.from(current) as Status[];
      }
      return next;
    });
  };

  const handleApply = () => {
    onApply?.(selection);
    setOpen(false);
  };

  useEffect(() => {
    if (isAll) {
      setSelection({});
    }
  }, [isAll]);

  const clearAll = () => {
    setSelection({});
    handleAll();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline'>{triggerLabel}</Button>
      </PopoverTrigger>

      <PopoverContent
        align='start'
        sideOffset={8}
        className='w-[340px] p-0 rounded-2xl shadow-lg'
      >
        <div className='p-4'>
          <h3 className='text-base font-medium'>Marketing Methods</h3>
          <p className='text-sm text-muted-foreground mt-1'>
            Choose marketing method
          </p>
        </div>

        <Separator />

        <div className='p-3 space-y-2'>
          {eligibleMethods.map(({ key: m, label }) => {
            const checked = methodChecked(m);

            return (
              <div key={m} className='rounded-lg'>
                <label
                  className={`flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted cursor-pointer`}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleMethod(m)}
                  />
                  <span className='text-[15px] leading-none'>{label}</span>
                </label>

                {/* Children: Approved / Not approved (shown only when method is selected) */}
                {checked && (
                  <div className='pl-8 pb-2 space-y-2'>
                    {STATUS_CHILDREN.map(({ key: s, label: sLabel }) => (
                      <label
                        key={`${m}-${s}`}
                        className='flex items-center gap-3 rounded-md px-2 py-1 hover:bg-muted cursor-pointer'
                      >
                        <Checkbox
                          checked={selection[m]?.includes(s) ?? false}
                          onCheckedChange={() => toggleChild(m, s)}
                        />
                        <span className='text-sm'>{sLabel}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className='p-3 pt-0 flex items-center justify-end gap-2'>
          <Button variant='ghost' onClick={clearAll}>
            Clear
          </Button>
          <Button onClick={handleApply} className='rounded-lg'>
            APPLY
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
