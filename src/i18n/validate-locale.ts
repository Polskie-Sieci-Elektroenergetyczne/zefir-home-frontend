import { hasLocale, type Locale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n';

export function validateLocale(locale: unknown): Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return locale;
}
