import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from './ui/Button';

export const ErrorState = ({ onRetry }: { onRetry?: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center space-y-2 rounded-md border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
      <AlertTriangle className="h-6 w-6 text-red-500" />
      <p className="text-sm text-red-600 dark:text-red-300">{t('common.error')}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          {t('actions.retry')}
        </Button>
      ) : null}
    </div>
  );
};
