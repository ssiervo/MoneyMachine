export const formatDateTime = (value: Date | string, language: string) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat(language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};
