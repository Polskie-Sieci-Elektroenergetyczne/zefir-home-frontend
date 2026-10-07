import { ActiveThemeProvider } from '@/components/themes/active-theme';
import ThemeProvider from '@/components/themes/theme-provider';
import { DEFAULT_THEME } from '@/components/themes/theme.config';
import { Toaster } from '@/components/ui/sonner';
import { routing } from '@/i18n/routing';
import { render, type RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import type { ReactElement, ReactNode } from 'react';
import { SWRConfig } from 'swr';
import messages from '../../messages/pl.json';

function Providers({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale={routing.defaultLocale} messages={messages}>
      <NuqsTestingAdapter>
        <ThemeProvider attribute='class' defaultTheme='light' disableTransitionOnChange>
          <ActiveThemeProvider initialTheme={DEFAULT_THEME}>
            <SWRConfig
              value={{ provider: () => new Map(), dedupingInterval: 0, shouldRetryOnError: false }}
            >
              <Toaster />
              {children}
            </SWRConfig>
          </ActiveThemeProvider>
        </ThemeProvider>
      </NuqsTestingAdapter>
    </NextIntlClientProvider>
  );
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Providers, ...options });
}
