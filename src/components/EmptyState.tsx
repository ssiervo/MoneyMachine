import { Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const EmptyState = ({ message }: { message?: string }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center space-y-2 rounded-md border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/40">
      <Inbox className="h-6 w-6 text-slate-500" />
      <p className="text-sm text-slate-600 dark:text-slate-300">{message ?? t('common.empty')}</p>
    </div>
  );
};
