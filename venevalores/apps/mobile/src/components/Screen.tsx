import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ViewProps } from 'react-native';

const Screen: React.FC<ViewProps> = ({ children, style, ...rest }) => (
  <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={[styles.container, style]} {...rest}>
      <View>{children}</View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 16,
  },
});

export default Screen;
