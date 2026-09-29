import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'
  ]
};
