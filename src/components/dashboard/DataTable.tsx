import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type SortDirection = 'asc' | 'desc';

type Column<T> = {
  key: keyof T;
  label: string;
  numeric?: boolean;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  caption?: string;
};

function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  caption = 'A list of your records.',
}: DataTableProps<T>) {
  const [sortedData, setSortedData] = useState<T[]>(data);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: SortDirection;
  } | null>(null);

  const sortData = (key: keyof T) => {
    let direction: SortDirection = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...sortedData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    setSortedData(sorted);
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof T) => {
    if (sortConfig?.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={String(col.key)}
              className={`cursor-pointer ${col.numeric ? 'text-right' : ''}`}
              onClick={() => sortData(col.key)}
            >
              {col.label}
              {getSortIndicator(col.key)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((row, i) => (
          <TableRow key={i}>
            {columns.map((col) => (
              <TableCell
                key={String(col.key)}
                className={col.numeric ? 'text-right' : ''}
              >
                {col.numeric ? `$${row[col.key].toFixed(2)}` : row[col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DataTable;
