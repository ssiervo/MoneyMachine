import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Screen from '../components/Screen';
import CurrencyPill from '../components/CurrencyPill';
import HoldingRow from '../components/HoldingRow';
import LineChart from '../components/LineChart';
import EmptyState from '../components/EmptyState';
import { usePortfolio } from '../hooks/usePortfolio';
import { useCurrency } from '../state/CurrencyContext';
import { formatMoney, mapCurrencyToIntl } from '../utils/currency';
import { formatDateTime } from '../utils/format';

const ranges: Array<'1W' | '1M' | '1Y' | 'ALL'> = ['1W', '1M', '1Y', 'ALL'];

type Nav = {
  navigate: (screen: string) => void;
};

const PortfolioScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<Nav>();
  const { currency, setCurrency } = useCurrency();
  const { portfolio, history } = usePortfolio();
  const [range, setRange] = useState<typeof ranges[number]>('1M');

  const holdings = portfolio.data?.holdings ?? [];
  const totals = portfolio.data?.totals ?? {};
  const rates = portfolio.data?.rates;

  const chartData = useMemo(() => {
    if (!history.data) return [];
    const slice = history.data.slice(0, 365);
    return slice
      .map((point: any) => ({
        x: new Date(point.timestamp.seconds ? point.timestamp.toDate() : point.timestamp),
        y: point.totalVES,
      }))
      .slice(0, range === '1W' ? 7 : range === '1M' ? 30 : range === '1Y' ? 365 : slice.length)
      .reverse();
  }, [history.data, range]);

  const currencyLabels: Record<string, string> = {
    VES: 'VES',
    USD_BCV: 'USD (BCV)',
    USD_USDT: 'USD (USDT)',
    EUR: 'EUR',
  };

  const value = totals[currency] ?? 0;
  const formattedValue = formatMoney(value, mapCurrencyToIntl(currency), i18n.language);

  return (
    <Screen>
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Trades')}>
          <Text style={styles.navLink}>{t('trades.title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('FX')}>
          <Text style={styles.navLink}>{t('fx.title')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.navLink}>{t('settings.title')}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{t('portfolio.title')}</Text>
      <View style={styles.pills}>
        {(Object.keys(currencyLabels) as Array<typeof currency>).map((cur) => (
          <CurrencyPill
            key={cur}
            label={currencyLabels[cur]}
            active={currency === cur}
            onPress={() => setCurrency(cur)}
          />
        ))}
      </View>
      {portfolio.isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('portfolio.totalValue')}</Text>
          <Text style={styles.cardValue}>{formattedValue}</Text>
          {rates ? (
            <Text style={styles.timestamp}>
              {t('portfolio.sourceLabel')}: {rates.source} • {formatDateTime(rates.timestamp, i18n.language)}
            </Text>
          ) : null}
        </View>
      )}

      <View style={styles.chartTabs}>
        {ranges.map((r) => (
          <TouchableOpacity key={r} onPress={() => setRange(r)} style={range === r ? styles.tabActive : styles.tab}>
            <Text style={range === r ? styles.tabActiveText : styles.tabText}>{t(`portfolio.chartRanges.${r}`)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {history.isLoading ? <ActivityIndicator /> : <LineChart data={chartData} />}

      <Text style={styles.section}>{t('portfolio.holdings')}</Text>
      {holdings.length === 0 ? (
        <EmptyState title={t('portfolio.holdings')} subtitle={t('disclaimer')} />
      ) : (
        holdings.map((holding: any) => {
          const priceText = formatMoney(
            holding.lastPriceVES,
            mapCurrencyToIntl('VES'),
            i18n.language,
          );
          const valueText = formatMoney(
            holding.quantity * holding.lastPriceVES,
            mapCurrencyToIntl('VES'),
            i18n.language,
          );
          const subtitle = `${t('portfolio.sourceLabel')} ${holding.source || 'BVC'} • ${formatDateTime(
            holding.lastUpdated,
            i18n.language,
          )}`;
          return (
            <HoldingRow
              key={holding.ticker}
              ticker={holding.ticker}
              quantity={holding.quantity}
              price={priceText}
              value={valueText}
              subtitle={subtitle}
            />
          );
        })
      )}
      <Text style={styles.disclaimer}>{t('disclaimer')}</Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  navRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  navLink: {
    marginLeft: 12,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  pills: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    marginBottom: 16,
  },
  cardLabel: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
  timestamp: {
    marginTop: 8,
    color: '#4b5563',
  },
  chartTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  tabActive: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1d4ed8',
  },
  tabText: {
    color: '#1f2937',
  },
  tabActiveText: {
    color: '#ffffff',
  },
  section: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    marginTop: 24,
    color: '#9ca3af',
    fontSize: 12,
  },
});

export default PortfolioScreen;
