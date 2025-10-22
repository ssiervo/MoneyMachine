import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useSettingsStore } from '@/lib/store/settings';
import { authStorage } from '@/lib/utils/auth';

const refreshIntervals = [5000, 10000, 30000, 60000];

export const SettingsPage = () => {
  const { t } = useTranslation();
  const { language, currency, theme, refreshInterval, setLanguage, setCurrency, setTheme, setRefreshInterval } =
    useSettingsStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-2">
          <label className="block font-medium">{t('settings.language')}</label>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as 'en' | 'es')}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block font-medium">{t('settings.currency')}</label>
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as 'USD' | 'VES')}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
          >
            <option value="USD">USD</option>
            <option value="VES">VES</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block font-medium">{t('settings.theme')}</label>
          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value as 'light' | 'dark')}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
          >
            <option value="light">{t('settings.light')}</option>
            <option value="dark">{t('settings.dark')}</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block font-medium">{t('settings.refreshInterval')}</label>
          <select
            value={refreshInterval}
            onChange={(event) => setRefreshInterval(Number(event.target.value))}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
          >
            {refreshIntervals.map((interval) => (
              <option key={interval} value={interval}>
                {Math.round(interval / 1000)}s
              </option>
            ))}
          </select>
        </div>
        <Button variant="secondary" onClick={() => authStorage.logout()}>
          {t('actions.logout')}
        </Button>
      </CardContent>
    </Card>
  );
};
