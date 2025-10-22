import { useState } from 'react';

import { cn } from '@/lib/utils/cn';

export type Column<T> = {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  getRowId?: (item: T, index: number) => string | number;
};

export const DataTable = <T,>({ data, columns, onRowClick, getRowId }: DataTableProps<T>) => {
  const [sortKey, setSortKey] = useState<string>();
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');

  const sortedData = (() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortKey];
      const bValue = (b as Record<string, unknown>)[sortKey];

      if (aValue === bValue) return 0;
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  })();

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setDirection('asc');
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-900/40">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn('px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500', column.className)}
              >
                <button
                  type="button"
                  className={cn('flex items-center gap-1', column.sortable ? 'cursor-pointer select-none' : 'cursor-default')}
                  onClick={() => handleSort(String(column.key), column.sortable)}
                >
                  {column.header}
                  {sortKey === column.key ? (direction === 'asc' ? '↑' : '↓') : null}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-sm dark:divide-slate-800 dark:bg-slate-950/40">
          {sortedData.map((item, index) => {
            const id = getRowId ? getRowId(item, index) : index;
            return (
              <tr
                key={id}
                className={cn('transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60', onRowClick && 'cursor-pointer')}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className={cn('px-4 py-2', column.className)}>
                    {column.render ? column.render(item) : String((item as Record<string, unknown>)[column.key as string] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
