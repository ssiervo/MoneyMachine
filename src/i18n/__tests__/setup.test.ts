import { describe, expect, it } from 'vitest';

import i18n from '@/i18n/setup';

describe('i18n setup', () => {
  it('switches languages', async () => {
    await i18n.changeLanguage('es');
    expect(i18n.t('actions.buy')).toBe('Comprar');
    await i18n.changeLanguage('en');
    expect(i18n.t('actions.buy')).toBe('Buy');
  });
});
