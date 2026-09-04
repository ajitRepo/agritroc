import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { serializeOffer } from '../../route'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const { id } = await params
    const offer = await prisma.offer.findUnique({ where: { id } })

    if (!offer) {
      return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 })
    }

    if (offer.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Seul le propriétaire de l\'offre peut la marquer comme conclue' },
        { status: 403 }
      )
    }

    const updated = await prisma.$transaction(async (tx) => {
      const o = await tx.offer.update({
        where: { id },
        data: { status: 'completed' },
        include: {
          user: true,
          images: { orderBy: { position: 'asc' } },
        },
      })

      // Increment user's exchange count
      await tx.user.update({
        where: { id: session.userId },
        data: { exchangeCount: { increment: 1 } },
      })

      return o
    })

    return NextResponse.json(serializeOffer(updated))
  } catch (error) {
    console.error('Erreur complete offer:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
