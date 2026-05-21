import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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

  const isAuthPage = pathname === '/login' || pathname === '/register'
  const isDashboardPage = pathname.startsWith('/dashboard')

  if (!sessionToken && isDashboardPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Removido o redirecionamento automático de isAuthPage para dashboard
  // para evitar loops de redirecionamento quando a sessão é inválida no banco
  // mas o cookie ainda existe no navegador.

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
