import { FormEvent, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import { CurrencyToggle } from '@/components/CurrencyToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Number } from '@/components/Number';
import { useSettingsStore } from '@/lib/store/settings';
import { usePortfolioStore } from '@/lib/store/portfolio';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { to: '/portfolio', labelKey: 'navigation.portfolio' },
  { to: '/markets', labelKey: 'navigation.markets' },
  { to: '/trade', labelKey: 'navigation.trade' },
  { to: '/predictions', labelKey: 'navigation.predictions' },
  { to: '/news', labelKey: 'navigation.news' },
  { to: '/settings', labelKey: 'navigation.settings' },
];

export const AppLayout = () => {
  const { t } = useTranslation();
  const metrics = usePortfolioStore((state) => state.metrics);
  const currency = useSettingsStore((state) => state.currency);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query) return;
    navigate(`/symbol/${query.toUpperCase()}`);
    setQuery('');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden w-60 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="mb-8 text-2xl font-bold">{t('app.title')}</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800',
                  isActive ? 'bg-slate-200 dark:bg-slate-800' : undefined,
                )
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex flex-col border-b border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-2">
            <Link to="/portfolio" className="text-lg font-semibold lg:hidden">
              {t('app.title')}
            </Link>
            <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
              <input
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                placeholder={t('app.search') ?? ''}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </form>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <CurrencyToggle />
              <ThemeToggle />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Metric label={t('portfolio.equity')} value={<Number value={metrics.equity} currency={currency} />} />
            <Metric label={t('portfolio.cash')} value={<Number value={metrics.cash} currency={currency} />} />
            <Metric
              label={t('portfolio.marketValue')}
              value={<Number value={metrics.marketValue} currency={currency} />}
            />
            <Metric label={t('portfolio.unrealizedPnl')} value={<Number value={metrics.unrealizedPnl} currency={currency} />} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="rounded-md border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    <div className="text-base font-semibold">{value}</div>
  </div>
);
