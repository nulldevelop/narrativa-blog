import { ROLES } from '@/generated/prisma/enums'
import type { Action } from './types'

// Permissões por role
export const ROLE_PERMISSIONS: Partial<Record<ROLES, Action[]>> = {
  [ROLES.OWNER]: ['create', 'read', 'update', 'delete'],
  [ROLES.ADMIN]: ['create', 'read', 'update', 'delete'],
  [ROLES.EDITOR]: ['create', 'read', 'update'],
  [ROLES.AUTHOR]: ['read', 'create', 'update', 'delete'],
}

// Rotas protegidas (Middleware)
export const ROUTE_PERMISSIONS: Record<string, ROLES[]> = {
  '/dashboard-admin': [ROLES.OWNER, ROLES.ADMIN],
  '/dashboard-editor': [ROLES.OWNER, ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR],
  '/dashboard-author': [ROLES.OWNER, ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR],
  '/dashboard': [ROLES.OWNER, ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR],
}

export type ProtectedRoute = keyof typeof ROUTE_PERMISSIONS
