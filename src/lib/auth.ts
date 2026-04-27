import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { organization } from 'better-auth/plugins'
import { ROLES } from '@/generated/prisma/enums'
import { prisma } from './prisma'

interface BetterAuthUser {
  id: string
  role?: string
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8, // Aumentado para reforçar segurança mínima
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'AUTHOR',
      },
    },
  },
  plugins: [organization()],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const authUser = user as unknown as BetterAuthUser
          try {
            const organization = await prisma.organization.findUnique({
              where: { slug: 'narrativa' },
            })
            if (organization) {
              const rawRole = authUser.role
              const finalRole =
                typeof rawRole === 'string'
                  ? (rawRole.toUpperCase() as ROLES)
                  : ROLES.AUTHOR

              await prisma.member.upsert({
                where: {
                  userId_organizationId: {
                    userId: authUser.id,
                    organizationId: organization.id,
                  },
                },
                create: {
                  userId: authUser.id,
                  role: finalRole,
                  organizationId: organization.id,
                },
                update: {
                  role: finalRole,
                },
              })
            }
          } catch (error) {
            console.error('Erro ao vincular membro:', error)
          }
        },
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  rateLimit: {
    window: 10,
    max: 100,
    pages: {
      signIn: true,
      signUp: true,
      '/login': true,
    },
  },
})
