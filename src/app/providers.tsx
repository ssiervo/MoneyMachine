import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/i18n/setup';
import { SettingsEffect } from '@/components/SettingsEffect';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <SettingsEffect />
        {children}
      </QueryClientProvider>
    </I18nextProvider>
  );
};
