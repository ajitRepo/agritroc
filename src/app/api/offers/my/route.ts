import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { serializeOffer } from '../route'

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const offers = await prisma.offer.findMany({
      where: { userId: session.userId },
      include: {
        user: true,
        images: { orderBy: { position: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(offers.map(serializeOffer))
  } catch (error) {
    console.error('Erreur GET /api/offers/my:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
