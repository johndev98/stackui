import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  try {
    const requested = await requestLocale;

    if (!requested || typeof requested !== "string") {
      return {
        locale: routing.defaultLocale,
        messages: (await import(`../messages/${routing.defaultLocale}.json`))
          .default,
      };
    }

    const locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

    const messages = (await import(`../messages/${locale}.json`)).default;

    if (!messages || typeof messages !== "object") {
      throw new Error(`Invalid messages for locale: ${locale}`);
    }

    return {
      locale,
      messages,
    };
  } catch (error) {
    console.error("Error loading i18n config:", error);
    // Fallback to default locale
    return {
      locale: routing.defaultLocale,
      messages: (await import(`../messages/${routing.defaultLocale}.json`))
        .default,
    };
  }
});
