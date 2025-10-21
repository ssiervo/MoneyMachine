import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Screen from '../components/Screen';
import { useTrades } from '../hooks/useTrades';
import StatusChip from '../components/StatusChip';
import EmptyState from '../components/EmptyState';
import { tradeFormSchema } from '../utils/validators';

const TradesScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { trades, createTrade } = useTrades();
  const [form, setForm] = useState({ ticker: '', side: 'BUY', quantity: '', priceVES: '' });

  const handleSubmit = async () => {
    const parsed = tradeFormSchema.safeParse({
      ticker: form.ticker.toUpperCase(),
      side: form.side as 'BUY' | 'SELL',
      quantity: Number(form.quantity),
      priceVES: Number(form.priceVES),
    });
    if (!parsed.success) {
      Alert.alert(t('errors.validation'));
      return;
    }
    try {
      await createTrade.mutateAsync(parsed.data);
      Alert.alert(t('toasts.emailSent'));
      setForm({ ticker: '', side: 'BUY', quantity: '', priceVES: '' });
    } catch (error) {
      Alert.alert(t('toasts.emailFailed'), String(error));
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return { label: t('trades.confirmed'), type: 'success' as const };
      case 'REJECTED':
        return { label: t('trades.rejected'), type: 'error' as const };
      case 'SENT':
        return { label: t('trades.sent'), type: 'info' as const };
      default:
        return { label: t('trades.pending'), type: 'pending' as const };
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>{t('trades.title')}</Text>
      <View style={styles.formRow}>
        <TextInput
          placeholder={t('trades.newTrade')}
          value={form.ticker}
          onChangeText={(text) => setForm((prev) => ({ ...prev, ticker: text.toUpperCase() }))}
          style={styles.input}
          autoCapitalize="characters"
        />
      </View>
      <View style={styles.formRow}>
        <TextInput
          placeholder={t('trades.quantity')}
          value={form.quantity}
          keyboardType="numeric"
          onChangeText={(text) => setForm((prev) => ({ ...prev, quantity: text }))}
          style={styles.input}
        />
        <TextInput
          placeholder={t('trades.priceVES')}
          value={form.priceVES}
          keyboardType="decimal-pad"
          onChangeText={(text) => setForm((prev) => ({ ...prev, priceVES: text }))}
          style={styles.input}
        />
      </View>
      <View style={styles.sideRow}>
        {(['BUY', 'SELL'] as const).map((side) => (
          <TouchableOpacity
            key={side}
            style={[styles.sideButton, form.side === side ? styles.sideActive : undefined]}
            onPress={() => setForm((prev) => ({ ...prev, side }))}
          >
            <Text style={form.side === side ? styles.sideActiveText : styles.sideText}>
              {side === 'BUY' ? t('trades.buy') : t('trades.sell')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title={t('trades.submit')} onPress={handleSubmit} />

      <Text style={styles.section}>{t('trades.title')}</Text>
      {trades.isLoading ? (
        <Text>...</Text>
      ) : trades.data?.length ? (
        trades.data.map((trade: any) => {
          const status = statusLabel(trade.status);
          return (
            <View key={trade.tradeId} style={styles.tradeCard}>
              <View style={styles.tradeHeader}>
                <Text style={styles.tradeTicker}>{trade.ticker}</Text>
                <StatusChip label={status.label} type={status.type} />
              </View>
              <Text>
                {trade.side} • {trade.quantity} @ {trade.priceVES} VES
              </Text>
              <Text>{new Date(trade.createdAt?.seconds ? trade.createdAt.toDate() : trade.createdAt).toLocaleString(i18n.language)}</Text>
            </View>
          );
        })
      ) : (
        <EmptyState title={t('trades.title')} subtitle={t('disclaimer')} />
      )}
      <Text style={styles.disclaimer}>{t('disclaimer')}</Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  sideRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sideButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1d4ed8',
    alignItems: 'center',
  },
  sideActive: {
    backgroundColor: '#1d4ed8',
  },
  sideText: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  sideActiveText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '600',
  },
  tradeCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 12,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tradeTicker: {
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimer: {
    marginTop: 24,
    color: '#9ca3af',
    fontSize: 12,
  },
});

export default TradesScreen;
