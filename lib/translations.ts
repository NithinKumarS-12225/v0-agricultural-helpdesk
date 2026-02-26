import type { Locale } from '@/i18n.config';

const translations: Record<Locale, Record<string, any>> = {
  en: require('@/translations/en.json'),
  kn: require('@/translations/kn.json'),
  hi: require('@/translations/hi.json'),
};

export function getTranslation(locale: Locale) {
  return translations[locale] || translations.en;
}

export function t(locale: Locale, key: string): string {
  const parts = key.split('.');
  let value: any = translations[locale] || translations.en;

  for (const part of parts) {
    value = value?.[part];
  }

  return typeof value === 'string' ? value : key;
}
