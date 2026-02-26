export const locales = ['en', 'kn', 'hi'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];
