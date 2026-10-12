import { redirect, validateLocale } from '@/i18n';
import type { Locale } from 'next-intl';

export default async function Page({ params }: { params: Promise<{ locale: unknown }> }) {
  const { locale: localeParam } = await params;
  const locale: Locale = validateLocale(localeParam);

  redirect({ href: 'dashboard/overview', locale });
}
