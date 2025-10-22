import { cn } from '@/lib/utils/cn';

export const Section = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <section className={cn('space-y-4', className)} {...props} />
);
