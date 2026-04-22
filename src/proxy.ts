import { type NextRequest, NextResponse } from 'next/server'
import { ROLES } from './lib/permissions/enum'
import { hasRoutePermission } from './lib/permissions/route-matcher'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Ignorar rotas de API do Better Auth, arquivos estáticos e etc para evitar loop
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. Obtém a sessão do Better Auth via Fetch para evitar importar o Prisma no Edge Runtime
  const response = await fetch(
    `${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
    {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    },
  )

  const session = response.ok ? await response.json() : null

  // 3. Se o usuário já está logado e tenta ir para o login ou registro, manda para a Home
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 4. Proteção de Rotas de Dashboard
  const isDashboardRoute = pathname.startsWith('/dashboard')

  if (isDashboardRoute) {
    // Se não estiver logado, redireciona para login
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Validação de Roles
    interface SessionUser {
      role?: string
      email?: string
    }
    const sessionUser = session.user as unknown as SessionUser
    const userRole = (sessionUser.role?.toUpperCase() as ROLES) ?? ROLES.AUTHOR
    if (!hasRoutePermission(pathname, userRole)) {
      console.warn(
        `Acesso negado: ${sessionUser.email} (${userRole}) tentou acessar ${pathname}`,
      )
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Monitoramos as rotas de login, registro e todos os dashboards
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/dashboard-owner/:path*',
    '/dashboard-editor/:path*',
    '/dashboard-author/:path*',
  ],
}
