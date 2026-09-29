import { redirect } from '@/i18n/navigation';
import { validateLocale } from '@/i18n/validate-locale';
import type { Locale } from 'next-intl';

export default async function Dashboard({ params }: { params: Promise<{ locale: unknown }> }) {
  const { locale: localeParam } = await params;
  const locale: Locale = validateLocale(localeParam);

  redirect({ href: 'dashboard/overview', locale });
}
