import * as rootParams from 'next/root-params';
import { getRequestConfig } from 'next-intl/server';
import { validateLocale } from '@/i18n/validate-locale';

export default getRequestConfig(async () => {
  const locale = validateLocale(await rootParams.locale());

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
