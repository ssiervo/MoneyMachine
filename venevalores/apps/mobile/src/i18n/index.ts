import React, { useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import * as Localization from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import en from './locales/en.json';
import es from './locales/es.json';
import api from '../api/client';
import { getFirebaseAuth, ensureFirebaseApp } from '../utils/firebase';

const LANGUAGE_KEY = 'venevalores-language';

const resources = { en: { translation: en }, es: { translation: es } };

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const setLanguage = async (language: 'en' | 'es') => {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
  await i18n.changeLanguage(language);
};

const detectLocale = () => {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    const primary = locales[0].languageCode;
    if (primary.startsWith('es')) {
      return 'es';
    }
  }
  return 'en';
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
      const language = stored || detectLocale();
      await i18n.changeLanguage(language);
      setReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    ensureFirebaseApp();
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
      }
      try {
        const { data } = await api.get('/api/settings');
        if (data.language) {
          await setLanguage(data.language);
        }
      } catch (error) {
        console.warn('Failed to sync language', error);
      }
    });
    return unsub;
  }, []);

  if (!ready) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default i18n;
