import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const token = request.cookies.get('accesstoken')?.value

    const protectedRoutes = [
        '/menu',
        '/checkout',
        '/profile/cart',
        '/profile/orders',
        '/profile/addresses',
        '/profile/personal-info',
    ]

    const isProtected = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Not logged in → redirect to /profile (shows logged out state)
    if (!token && isProtected) {
        return NextResponse.redirect(new URL('/profile', request.url))
    }

    // Logged in → block auth pages
    if (token && (
        pathname === '/login' ||
        pathname === '/signup' ||
        pathname === '/verify-otp'
    )) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/menu/:path*',
        '/checkout/:path*',
        '/profile/cart/:path*',
        '/profile/orders/:path*',
        '/profile/addresses/:path*',
        '/profile/personal-info/:path*',
        '/login',
        '/signup',
        '/verify-otp',
    ],
}