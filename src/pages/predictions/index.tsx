import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const sentiments = [
  { symbol: 'BVC', bullish: 0.62, probability: 0.7 },
  { symbol: 'PVSA', bullish: 0.48, probability: 0.55 },
  { symbol: 'MNDA', bullish: 0.71, probability: 0.8 },
];

export const PredictionsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {sentiments.map((item) => (
        <Card key={item.symbol}>
          <CardHeader>
            <CardTitle>
              {item.symbol} · {t('predictions.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              {t('predictions.bullish')}: {(item.bullish * 100).toFixed(0)}%
            </div>
            <div>
              {t('predictions.bearish')}: {((1 - item.bullish) * 100).toFixed(0)}%
            </div>
            <div>
              {t('predictions.probability')}: {(item.probability * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
