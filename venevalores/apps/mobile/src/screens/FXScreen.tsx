import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import Screen from '../components/Screen';
import { useFx } from '../hooks/useFX';
import { formatMoney } from '../utils/currency';

const FXScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data } = useFx();
  const [vesAmount, setVesAmount] = useState('1000');

  const vesValue = Number(vesAmount) || 0;

  const usdBcv = data ? vesValue / data.bcvRateUsd : 0;
  const usdUsdt = data ? vesValue / data.usdtRateUsd : 0;
  const eur = data ? vesValue / data.eurRate : 0;

  return (
    <Screen>
      <Text style={styles.title}>{t('fx.title')}</Text>
      <View style={styles.card}>
        <Text>
          {t('fx.timestamp')}: {data ? new Date(data.timestamp).toLocaleString(i18n.language) : '...'}
        </Text>
        <Text>BCV: {data?.bcvRateUsd}</Text>
        <Text>USDT: {data?.usdtRateUsd}</Text>
        <Text>EUR: {data?.eurRate}</Text>
      </View>

      <Text style={styles.section}>{t('fx.converter')}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={vesAmount}
        onChangeText={setVesAmount}
        placeholder="1000"
      />
      <View style={styles.row}>
        <Text>{t('fx.bcv')}</Text>
        <Text>{formatMoney(usdBcv, 'USD', i18n.language)}</Text>
      </View>
      <View style={styles.row}>
        <Text>{t('fx.usdt')}</Text>
        <Text>{formatMoney(usdUsdt, 'USD', i18n.language)}</Text>
      </View>
      <View style={styles.row}>
        <Text>{t('fx.eur')}</Text>
        <Text>{formatMoney(eur, 'EUR', i18n.language)}</Text>
      </View>
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
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    marginBottom: 16,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  disclaimer: {
    marginTop: 24,
    color: '#9ca3af',
    fontSize: 12,
  },
});

export default FXScreen;
