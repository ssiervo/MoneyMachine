import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/Skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useNews } from '@/lib/api/hooks';
import { formatDate } from '@/lib/utils/format';

export const NewsPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useNews();

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="text-slate-500 dark:text-slate-300">
              {item.source} · {formatDate(item.publishedAt)}
            </div>
            <p>{item.summary}</p>
            <a className="text-brand" href={item.url} target="_blank" rel="noreferrer">
              {t('news.title')}
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
