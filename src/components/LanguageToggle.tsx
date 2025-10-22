import { useTranslation } from 'react-i18next';

import { Button } from './ui/Button';
import { useSettingsStore } from '@/lib/store/settings';

export const LanguageToggle = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useSettingsStore((state) => ({
    language: state.language,
    toggleLanguage: state.toggleLanguage,
  }));

  return (
    <Button variant="ghost" onClick={toggleLanguage} aria-label={t('actions.toggleLanguage')}>
      {language === 'en' ? 'EN' : 'ES'}
    </Button>
  );
};
