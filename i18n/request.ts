import { getRequestConfig } from "next-intl/server";

// 支持的语言列表
export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // 获取语言，如果不支持则使用默认语言
  const locale = await requestLocale;
  const validLocale =
    locale && locales.includes(locale as Locale) ? locale : "zh";

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
  };
});
