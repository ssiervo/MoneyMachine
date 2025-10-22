import { Button } from './ui/Button';
import { useSettingsStore } from '@/lib/store/settings';

export const CurrencyToggle = () => {
  const { currency, setCurrency } = useSettingsStore((state) => ({
    currency: state.currency,
    setCurrency: state.setCurrency,
  }));

  const nextCurrency = currency === 'USD' ? 'VES' : 'USD';

  return (
    <Button variant="ghost" onClick={() => setCurrency(nextCurrency)}>
      {currency}
    </Button>
  );
};
