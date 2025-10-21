import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import Screen from '../components/Screen';
import api from '../api/client';
import { useCurrency } from '../state/CurrencyContext';
import { setLanguage } from '../i18n';
import { signOutUser } from '../hooks/useAuth';

interface SettingsForm {
  brokerEmail: string;
  defaultCurrency: 'VES' | 'USD_BCV' | 'USD_USDT' | 'EUR';
  fxSource: 'BCV' | 'USDT' | 'ECB';
  language: 'en' | 'es';
}

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { setCurrency } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<SettingsForm>({
    brokerEmail: '',
    defaultCurrency: 'VES',
    fxSource: 'BCV',
    language: 'en',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/api/settings');
        setForm(data);
      } catch (error) {
        Alert.alert('Error', String(error));
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/api/settings', form);
      setCurrency(form.defaultCurrency);
      await setLanguage(form.language);
      Alert.alert(t('common.save'));
    } catch (error) {
      Alert.alert('Error', String(error));
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  if (loading) {
    return (
      <Screen>
        <Text>...</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>{t('settings.title')}</Text>
      <View style={styles.section}>
        <Text>{t('settings.brokerEmail')}</Text>
        <TextInput
          style={styles.input}
          value={form.brokerEmail}
          onChangeText={(text) => setForm((prev) => ({ ...prev, brokerEmail: text }))}
        />
      </View>
      <View style={styles.section}>
        <Text>{t('settings.defaultCurrency')}</Text>
        <TextInput
          style={styles.input}
          value={form.defaultCurrency}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, defaultCurrency: text as SettingsForm['defaultCurrency'] }))
          }
        />
      </View>
      <View style={styles.section}>
        <Text>{t('settings.fxSource')}</Text>
        <TextInput
          style={styles.input}
          value={form.fxSource}
          onChangeText={(text) => setForm((prev) => ({ ...prev, fxSource: text as SettingsForm['fxSource'] }))}
        />
      </View>
      <View style={styles.section}>
        <Text>{t('settings.language')}</Text>
        <View style={styles.languageRow}>
          <Button
            title={t('settings.language_en')}
            onPress={() => {
              setForm((prev) => ({ ...prev, language: 'en' }));
              setLanguage('en');
            }}
            color={form.language === 'en' ? '#1d4ed8' : undefined}
          />
          <Button
            title={t('settings.language_es')}
            onPress={() => {
              setForm((prev) => ({ ...prev, language: 'es' }));
              setLanguage('es');
            }}
            color={form.language === 'es' ? '#1d4ed8' : undefined}
          />
        </View>
      </View>
      <Button title={t('common.save')} onPress={handleSave} />
      <View style={{ height: 12 }} />
      <Button title={t('auth.signOut')} onPress={handleSignOut} color="#dc2626" />
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
  section: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  disclaimer: {
    marginTop: 24,
    color: '#9ca3af',
  },
});

export default SettingsScreen;
