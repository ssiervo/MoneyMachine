import { useEffect } from 'react';

import i18n from '@/i18n/setup';
import { useSettingsStore } from '@/lib/store/settings';

export const SettingsEffect = () => {
  const { language, theme } = useSettingsStore((state) => ({
    language: state.language,
    theme: state.theme,
  }));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    void i18n.changeLanguage(language);
  }, [language]);

  return null;
};
