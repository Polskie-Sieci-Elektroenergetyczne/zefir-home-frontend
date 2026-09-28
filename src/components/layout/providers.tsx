'use client';
import React from 'react';
import { ProgressProvider } from '@bprogress/next/app';
import { ActiveThemeProvider } from '@/components/themes/active-theme';
import QueryProvider from '@/components/layout/query-provider';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <ProgressProvider color='var(--primary)' options={{ showSpinner: false }} shallowRouting>
        <ActiveThemeProvider initialTheme={activeThemeValue}>
          <QueryProvider>{children}</QueryProvider>
        </ActiveThemeProvider>
      </ProgressProvider>
    </>
  );
}
