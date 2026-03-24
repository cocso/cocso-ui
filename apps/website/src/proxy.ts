import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import { i18n } from "~/libs/i18n";

const i18nMiddleware = createI18nMiddleware(i18n);

export default function middleware(request: NextRequest, evt: NextFetchEvent) {
  const response = i18nMiddleware(request, evt);
  
  // Extract locale from URL path for x-locale header
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];
  const locale = (i18n.languages as readonly string[]).includes(firstSegment ?? "")
    ? firstSegment
    : i18n.defaultLanguage;
  
  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("x-locale", locale ?? i18n.defaultLanguage);
  
  return NextResponse.next({
    request: { headers: request.headers },
    headers: responseHeaders,
  });
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|llms\\.txt|.*\\..*).*)"],
};
