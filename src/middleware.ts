import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const publicRoutes = ['/', '/auth/login', '/auth/register'];
const authRoutes = ['/auth/login', '/auth/register'];

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    if (
        nextUrl.pathname.startsWith('/api/') ||
        nextUrl.pathname.startsWith('/_next/') ||
        nextUrl.pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isSecretRoute = nextUrl.pathname.startsWith('/secret/');

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/dashboard', nextUrl));
        }
        return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute && !isSecretRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return NextResponse.redirect(
            new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
        );
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};