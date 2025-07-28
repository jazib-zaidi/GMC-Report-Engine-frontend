'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Pencil, X } from 'lucide-react';

interface TitleOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TitleOptionsModal({
  open,
  onOpenChange,
}: TitleOptionsModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  const fields = [
    {
      label: 'Start with',
      example: 'Brand',
      current: 'Brand',
      tooltip:
        'Begin the title with its most important element (often the brand or core product name) so shoppers grasp relevance instantly.',
    },
    {
      label: 'Highlight features',
      example: 'Material, Compatibility, Size',
      current: 'Material, Size, Model, Series',
      tooltip:
        'Call out buyer-critical details—material, compatibility, size, or similar specs.',
    },
    {
      label: 'Always Include',
      example: 'Size',
      current: 'Size, Size Type',
      tooltip:
        'Ensure key attributes like brand, model, or size are shown in the title if present in the source data.',
    },
    {
      label: 'Other Instructions',
      example: '---',
      current: '(Custom logic or overrides)',
      tooltip:
        'Add any custom rules or overrides here. These can break or replace the default logic.',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle className='flex justify-between items-center'>
            <span>Title Options</span>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onOpenChange(false)}
            >
              <X className='w-4 h-4' />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className='overflow-x-auto'>
          <table className='w-full table-auto border border-gray-200 text-sm'>
            <thead>
              <tr className='bg-muted text-muted-foreground text-left'>
                <th className='p-2 border'>Field</th>
                {isEditing ? (
                  <>
                    <th className='p-2 border'>Current Value</th>
                    <th className='p-2 border'>New Value</th>
                  </>
                ) : (
                  <th className='p-2 border'>Example Value</th>
                )}
              </tr>
            </thead>
            <tbody>
              {fields.map(({ label, example, current, tooltip }) => (
                <tr key={label}>
                  <td className='p-2 border align-top'>
                    <div className='flex items-start gap-1 font-medium'>
                      {label}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='text-xs text-muted-foreground cursor-help'>
                            ⓘ
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{tooltip}</TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                  {isEditing ? (
                    <>
                      <td className='p-2 border text-muted-foreground'>
                        {current}
                      </td>
                      <td className='p-2 border'>
                        <Input placeholder='{ }' />
                      </td>
                    </>
                  ) : (
                    <td className='p-2 border'>{example}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DialogFooter className='mt-4 flex justify-end gap-2'>
          {isEditing ? (
            <>
              <Button variant='outline' onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className='flex items-center gap-1'
            >
              <Pencil className='w-4 h-4' />
              Edit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
