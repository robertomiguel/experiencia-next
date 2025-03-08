import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('firebaseToken')?.value;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname); // Guardar la URL original
    return NextResponse.redirect(loginUrl);
  }

  const response = await fetch(`${req.nextUrl.origin}/api/validate-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname); // Guardar la URL original
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete('firebaseToken');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/chat/:path*',
    '/cripto/:path*',
    '/coin/:path*',
  ],
};
