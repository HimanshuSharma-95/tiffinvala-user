// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function proxy(
//     request: NextRequest
// ) {

//     const { pathname } =
//         request.nextUrl

//     // READ COOKIE
//     const token =
//         request.cookies
//             .get('accesstoken')
//             ?.value

//     // PROTECTED ROUTES
//     const protectedRoutes = [
//         '/menu',
//         '/checkout',
//         '/profile/cart',
//         '/profile/orders',
//         '/profile/addresses',
//         '/profile/personal-info',
//     ]

//     const isProtected =
//         protectedRoutes.some(route =>
//             pathname.startsWith(route)
//         )

//     // NOT LOGGED IN
//     if (
//         !token &&
//         isProtected
//     ) {

//         return NextResponse.redirect(
//             new URL(
//                 '/profile',
//                 request.url
//             )
//         )
//     }

//     // LOGGED IN USER
//     // SHOULD NOT ACCESS AUTH PAGES
//     if (
//         token &&
//         (
//             pathname === '/login' ||
//             pathname === '/signup' ||
//             pathname === '/verify-otp'
//         )
//     ) {

//         return NextResponse.redirect(
//             new URL(
//                 '/',
//                 request.url
//             )
//         )
//     }

//     return NextResponse.next()
// }

// export const config = {
//     matcher: [
//         '/menu/:path*',
//         '/checkout/:path*',
//         '/profile/cart/:path*',
//         '/profile/orders/:path*',
//         '/profile/addresses/:path*',
//         '/profile/personal-info/:path*',
//         '/login',
//         '/signup',
//         '/verify-otp',
//     ],
// }








import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(
    request: NextRequest
) {

    const { pathname } =
        request.nextUrl

    // ACCESS TOKEN
    const token =
        request.cookies
            .get('accesstoken')
            ?.value

    // PROTECTED ROUTES
    const protectedRoutes = [
        '/menu',
        '/checkout',
        '/profile/cart',
        '/profile/orders',
        '/profile/addresses',
        '/profile/personal-info',
    ]

    const isProtected =
        protectedRoutes.some(route =>
            pathname.startsWith(route)
        )

    // BLOCK IF NOT LOGGED IN
    if (
        !token &&
        isProtected
    ) {

        return NextResponse.redirect(
            new URL(
                '/login',
                request.url
            )
        )
    }

    // BLOCK AUTH PAGES FOR LOGGED USER
    if (
        token &&
        (
            pathname === '/login' ||
            pathname === '/signup' ||
            pathname === '/verify-otp'
        )
    ) {

        return NextResponse.redirect(
            new URL(
                '/',
                request.url
            )
        )
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