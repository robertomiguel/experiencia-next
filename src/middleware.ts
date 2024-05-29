import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decode, encode } from 'next-auth/jwt';

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

    // temporal, token en cookie, luego en header/session
    const token = request.cookies.get('auth')?.value;

    try {
        const tokenData = await decode({
            token,
            secret: JWT_SECRET
        });
        // validar el exp del troken es valido
        if (tokenData?.exp) {

            const current = Math.floor(Date.now() / 1000);
            const exp = tokenData.expired as number;
            const time = tokenData.time as number;
            isLogin = current < (time + exp);
            console.log('tokenData', isLogin, tokenData);

            if (isLogin) {
                const newTimeInSeconds = Math.floor(Date.now() / 1000);
                const newToken = await encode({
                    token: {
                        id: tokenData.id,
                        role: tokenData.role,
                        time: newTimeInSeconds,
                        expired: 60 * 60 * 60
                    },
                    secret: JWT_SECRET
                });


                const response = NextResponse.next();
                response.cookies.set('auth', newToken, { httpOnly: true, sameSite: "lax" }); // Configura las opciones de cookies como necesites
            }
        }
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
