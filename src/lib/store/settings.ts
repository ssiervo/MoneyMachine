import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { env } from '@/lib/utils/env';

type Theme = 'light' | 'dark';
type Language = 'en' | 'es';
type Currency = 'USD' | 'VES';

type SettingsState = {
  language: Language;
  currency: Currency;
  theme: Theme;
  refreshInterval: number;
  setLanguage: (language: Language) => void;
  setCurrency: (currency: Currency) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  setRefreshInterval: (interval: number) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: env.defaultLanguage === 'es' ? 'es' : 'en',
      currency: env.defaultCurrency === 'VES' ? 'VES' : 'USD',
      theme: env.defaultTheme === 'dark' ? 'dark' : 'light',
      refreshInterval: 15000,
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      toggleLanguage: () => set({ language: get().language === 'en' ? 'es' : 'en' }),
      setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
    }),
    {
      name: 'venevalores-settings',
    },
  ),
);
