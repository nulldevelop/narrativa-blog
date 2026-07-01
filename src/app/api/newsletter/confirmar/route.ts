import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const baseUrl = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/?newsletter=invalido`)
  }

  const subscriber = await prisma.subscriber.findUnique({
    where: { confirmToken: token },
  })

  if (!subscriber) {
    return NextResponse.redirect(`${baseUrl}/?newsletter=invalido`)
  }

  if (subscriber.confirmed) {
    return NextResponse.redirect(`${baseUrl}/?newsletter=ja-confirmado`)
  }

  await prisma.subscriber.update({
    where: { confirmToken: token },
    data: { confirmed: true, confirmToken: null },
  })

  return NextResponse.redirect(`${baseUrl}/?newsletter=confirmado`)
}
