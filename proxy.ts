import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  const pathnameLocale = request.nextUrl.pathname.split("/")[1];
  if ((routing.locales as readonly string[]).includes(pathnameLocale)) {
    response.cookies.set("NEXT_LOCALE", pathnameLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: "/((?!api|learn|courses|trpc|_next|_vercel|.*\\..*).*)",
};
