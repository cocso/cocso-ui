import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18n } from "~/libs/i18n";

const localeCookieName = "FD_LOCALE";
const oneYearInSeconds = 60 * 60 * 24 * 365;
const languagePriorityList = i18n.languages as readonly string[];

const isSupportedLanguage = (
  value: string
): value is (typeof i18n.languages)[number] =>
  languagePriorityList.includes(value);

const readPathLanguage = (pathname: string) => {
  const segment = pathname.split("/")[1];

  if (!segment) {
    return undefined;
  }

  return isSupportedLanguage(segment) ? segment : undefined;
};

const parseAcceptLanguage = (acceptLanguageHeader: string | null) => {
  if (!acceptLanguageHeader) {
    return i18n.defaultLanguage;
  }

  const rankedLanguages = acceptLanguageHeader
    .split(",")
    .map((entry) => {
      const [tag, qualityPart] = entry.trim().split(";");
      const quality = qualityPart?.startsWith("q=")
        ? Number.parseFloat(qualityPart.slice(2))
        : 1;

      return {
        tag: tag?.toLowerCase() ?? "",
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const candidate of rankedLanguages) {
    const [primarySubtag] = candidate.tag.split("-");

    if (primarySubtag && isSupportedLanguage(primarySubtag)) {
      return primarySubtag;
    }
  }

  return i18n.defaultLanguage;
};

const setLocaleCookie = (
  response: NextResponse,
  language: (typeof i18n.languages)[number]
) => {
  response.cookies.set(localeCookieName, language, {
    path: "/",
    maxAge: oneYearInSeconds,
    sameSite: "lax",
  });
};

const addLanguagePrefix = (pathname: string, language: string) =>
  `/${language}${pathname}`.replaceAll(/\/+/g, "/");

const i18nMiddleware = createI18nMiddleware(i18n);

export default async function proxy(request: NextRequest, evt: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;
  const pathLanguage = readPathLanguage(pathname);

  if (!pathLanguage) {
    const cookieLanguage = request.cookies.get(localeCookieName)?.value;
    const preferredLanguage =
      cookieLanguage && isSupportedLanguage(cookieLanguage)
        ? cookieLanguage
        : parseAcceptLanguage(request.headers.get("accept-language"));

    if (preferredLanguage === i18n.defaultLanguage) {
      const response = await i18nMiddleware(request, evt);

      if (response instanceof NextResponse) {
        setLocaleCookie(response, preferredLanguage);
      }

      return response;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = addLanguagePrefix(pathname, preferredLanguage);

    const response = NextResponse.redirect(redirectUrl);
    setLocaleCookie(response, preferredLanguage);

    return response;
  }

  const response = (await i18nMiddleware(request, evt)) ?? NextResponse.next();

  if (response instanceof NextResponse) {
    setLocaleCookie(response, pathLanguage);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|llms\\.txt|.*\\..*).*)"],
};
