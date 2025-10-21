import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  ticker: string;
  quantity: number;
  price: string;
  value: string;
  subtitle: string;
}

const HoldingRow: React.FC<Props> = ({ ticker, quantity, price, value, subtitle }) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.ticker}>{ticker}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <View style={styles.right}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.quantity}>{quantity}</Text>
      <Text style={styles.price}>{price}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  ticker: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 12,
  },
  right: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
  quantity: {
    color: '#4b5563',
  },
  price: {
    color: '#4b5563',
  },
});

export default HoldingRow;
