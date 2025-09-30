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
import { ArrowLeft } from 'lucide-react';

interface Check {
  name: string;
  description: string;
  response: string;
  variant: 'success' | 'warning' | 'error';
}

interface PillarDetailTableProps {
  title: string;
  feedRank: string;
  checks: Check[];
  onBack?: () => void;
}

export const PillarDetailTable = ({
  title,
  feedRank,
  checks,
  onBack,
}: PillarDetailTableProps) => {
  const getTextColor = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-amber-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className='space-y-6'>
      {onBack && (
        <Button variant='ghost' onClick={onBack} className='gap-2'>
          <ArrowLeft className='h-4 w-4' />
          Back to Overview
        </Button>
      )}

      <div className='flex items-baseline gap-3'>
        <h2 className='text-3xl font-bold text-foreground'>{title}</h2>
        <span className='text-2xl font-semibold text-muted-foreground'>
          {feedRank}
        </span>
      </div>

      <Card className='overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[200px] font-bold'>Check</TableHead>
              <TableHead className='font-bold'>Description</TableHead>
              <TableHead className='w-[250px] font-bold'>Response</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checks.map((check, index) => (
              <TableRow key={index}>
                <TableCell
                  className={`font-semibold p-8 ${getTextColor(check.variant)}`}
                >
                  {check.name}
                </TableCell>
                <TableCell className={`text-sm ${getTextColor(check.variant)}`}>
                  {check.description}
                </TableCell>
                <TableCell
                  className={`font-mono text-sm ${getTextColor(check.variant)}`}
                >
                  {check.response}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
