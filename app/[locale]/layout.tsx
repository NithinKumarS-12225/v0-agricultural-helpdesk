import type { ReactNode } from 'react';
import type { Locale } from '@/i18n.config';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col font-sans antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
