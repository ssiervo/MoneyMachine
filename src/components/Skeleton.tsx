import { cn } from '@/lib/utils/cn';

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('animate-pulse rounded-md bg-slate-200 dark:bg-slate-700', className)} {...props} />
);
