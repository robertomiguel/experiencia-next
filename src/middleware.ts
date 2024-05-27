import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decode } from 'next-auth/jwt';

// definiciones de rutas publicas
const publicRoutes = [
    '/',
    '/home',
    '/login',
    '/login/register',
    '/api/login',
    '/api/login/register',
    '/api/seed',
    '/iadraw',
    '/api/translate',
];

const noAccessIfLogged = [
    '/login',
    '/login/register',
];

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function middleware(request: NextRequest) {

    const nextUrl = request.nextUrl.pathname;
    const method = request.method;

    // cargar archivos estaticos
    const isStaticAsset = nextUrl.startsWith('/_next/static/') || nextUrl.includes('.');
    if (isStaticAsset) {
        return NextResponse.next();
    }

    if (nextUrl.startsWith('/wiki')) {
        return NextResponse.next();
    }

    let isLogin = false;

    // solo de ejemplo - se usa token para auotentificar peticiones
    const token = request.cookies.get('auth')?.value;


    try {
        const tokenData = await decode({
            token,
            secret: JWT_SECRET
        });
        isLogin = tokenData?.password === process.env.PASSWORD;
    } catch {
        isLogin = false;
    }

    // no acceder a rutas publicas si esta logueado
    const canNoAccessIfLogged = isLogin && noAccessIfLogged.includes(nextUrl);
    if (canNoAccessIfLogged) {
        return NextResponse.redirect(new URL('/login/user', request.url));
    }

    // no acceder a rutas privadas si no esta logueado
    const noAccess = !isLogin && !publicRoutes.includes(nextUrl)

    if (noAccess && method === 'GET') {
        return NextResponse.redirect(new URL('/login', request.url));
    } else if (noAccess) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    return NextResponse.next();
}
