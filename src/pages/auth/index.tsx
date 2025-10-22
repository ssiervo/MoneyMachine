import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { authStorage } from '@/lib/utils/auth';

export const AuthPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;
    authStorage.login();
    const next = (location.state as { from?: { pathname: string } } | undefined)?.from?.pathname ?? '/portfolio';
    navigate(next, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
              />
            </div>
            <Button type="submit" className="w-full">
              {t('auth.submit')}
            </Button>
            <p className="text-xs text-slate-500">{t('auth.hint')}</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
