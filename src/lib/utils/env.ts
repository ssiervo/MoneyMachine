const getEnv = (key: string, fallback?: string) => {
  const value = import.meta.env[key as keyof ImportMetaEnv] as string | undefined;
  if (value === undefined || value === '') {
    if (fallback === undefined) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return fallback;
  }
  return value;
};

export const env = {
  apiBaseUrl: getEnv('VITE_API_BASE_URL', 'https://mock.bvc.ve/api'),
  dataSource: getEnv('VITE_DATA_SOURCE', 'mock') as 'mock' | 'bvc',
  defaultLanguage: getEnv('VITE_DEFAULT_LANGUAGE', 'en'),
  defaultCurrency: getEnv('VITE_DEFAULT_CURRENCY', 'USD'),
  defaultTheme: getEnv('VITE_DEFAULT_THEME', 'light'),
};
