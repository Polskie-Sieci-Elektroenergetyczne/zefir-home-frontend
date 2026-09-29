import * as rootParams from 'next/root-params';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async () => {
  const localeParam = await rootParams.locale();

  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  return {
    locale: localeParam,
    messages: (await import(`../../messages/${localeParam}.json`)).default
  };
});
