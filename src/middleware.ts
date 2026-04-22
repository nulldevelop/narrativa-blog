import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(`🔍 [MIDDLEWARE] Acessando: ${pathname}`)

  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const sessionToken =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token')

  console.log(
    `🍪 [MIDDLEWARE] Session Cookie: ${sessionToken ? 'Presente' : 'Ausente'}`,
  )

  const isAuthPage = pathname === '/login' || pathname === '/register'
  const isDashboardPage = pathname.startsWith('/dashboard')

  if (!sessionToken && isDashboardPage) {
    console.log(
      `🚫 [MIDDLEWARE] Redirecionando ${pathname} -> /login (Sem sessão)`,
    )
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (sessionToken && isAuthPage) {
    console.log(
      `🏠 [MIDDLEWARE] Redirecionando ${pathname} -> /dashboard-author (Já logado)`,
    )
    return NextResponse.redirect(new URL('/dashboard-author', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/dashboard-owner/:path*',
    '/dashboard-editor/:path*',
    '/dashboard-author/:path*',
  ],
}
