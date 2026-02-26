'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import Navigation from '@/components/Navigation';
import ThemeProvider from '@/components/ThemeProvider';
import '../globals.css';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const [locale, setLocale] = useState<Locale>('en');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    params.then((p) => {
      setLocale(p.locale as Locale);
      setIsLoading(false);
    });
  }, [params]);

  if (isLoading) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="bg-background text-foreground">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </body>
      </html>
    );
  }

  const t = getTranslation(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navigation locale={locale} router={router} pathname={pathname} />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border bg-card py-6 text-center text-sm text-muted-foreground">
              <p>© 2026 Kisan Call Centre. All rights reserved.</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
