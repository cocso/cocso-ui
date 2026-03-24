import { type NextRequest, NextResponse } from "next/server";
import { i18n } from "~/libs/i18n";

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];
  const locale = (i18n.languages as readonly string[]).includes(firstSegment ?? "")
    ? firstSegment
    : i18n.defaultLanguage;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale ?? i18n.defaultLanguage);

  return NextResponse.next({ request: { headers: requestHeaders } });
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|llms\\.txt).*)"],
};
