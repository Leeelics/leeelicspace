import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

export default createMiddleware({
  locales,
  defaultLocale: 'zh',
  localePrefix: 'as-needed'
});

export const config = {
  // 跳过所有非页面路径
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
