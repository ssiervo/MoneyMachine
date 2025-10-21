import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  active?: boolean;
  onPress: () => void;
}

const CurrencyPill: React.FC<Props> = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.pill, active ? styles.active : undefined]}
    onPress={onPress}
  >
    <Text style={[styles.text, active ? styles.activeText : undefined]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1d4ed8',
    marginRight: 8,
  },
  active: {
    backgroundColor: '#1d4ed8',
  },
  text: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  activeText: {
    color: '#ffffff',
  },
});

export default CurrencyPill;
