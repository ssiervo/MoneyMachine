import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from './src/i18n';
import AuthScreen from './src/screens/AuthScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import TradesScreen from './src/screens/TradesScreen';
import FXScreen from './src/screens/FXScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { useAuthState } from './src/hooks/useAuth';
import { CurrencyProvider } from './src/state/CurrencyContext';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const AppNavigator = () => {
  const { user, initializing } = useAuthState();

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Portfolio" component={PortfolioScreen} />
          <Stack.Screen name="Trades" component={TradesScreen} />
          <Stack.Screen name="FX" component={FXScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </CurrencyProvider>
      </QueryClientProvider>
    </I18nProvider>
  );
}
