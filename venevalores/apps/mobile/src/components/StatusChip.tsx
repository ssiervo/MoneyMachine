import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface Props {
  label: string;
  type: 'info' | 'success' | 'error' | 'pending';
}

const colors = {
  info: '#1d4ed8',
  success: '#059669',
  error: '#dc2626',
  pending: '#f59e0b',
};

const StatusChip: React.FC<Props> = ({ label, type }) => (
  <View style={[styles.container, { backgroundColor: colors[type] }]}>
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StatusChip;
