import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { validateLocale } from '@/i18n/validate-locale';
import type { Locale } from 'next-intl';

export default async function Dashboard({ params }: { params: Promise<{ locale: unknown }> }) {
  const { locale: localeParam } = await params;
  const locale: Locale = validateLocale(localeParam);
  const path =
    locale === routing.defaultLocale ? '/dashboard/overview' : `/${locale}/dashboard/overview`;

  redirect(path);
}
