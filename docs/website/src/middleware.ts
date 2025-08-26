import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = (request: NextRequest): NextResponse => {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);
  headers.set('x-pathname', pathname);

  return NextResponse.next({ request: { headers } });
};

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.ico|apple-icon.ico|static|data:image|api).*)',
  ],
};
