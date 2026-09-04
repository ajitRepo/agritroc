import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serializeOffer } from '../../offers/route'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        offers: {
          where: { status: 'active' },
          include: {
            user: true,
            images: { orderBy: { position: 'asc' } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      full_name: user.fullName,
      fullName: user.fullName,
      city: user.city,
      address: user.address,
      avatar_url: user.avatarUrl,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      rating_avg: user.ratingAvg,
      ratingAvg: user.ratingAvg,
      rating_count: user.ratingCount,
      ratingCount: user.ratingCount,
      exchange_count: user.exchangeCount,
      exchangeCount: user.exchangeCount,
      is_verified: user.isVerified,
      isVerified: user.isVerified,
      active_offers_count: user.offers.length,
      activeOffersCount: user.offers.length,
      offers: user.offers.map(serializeOffer),
      created_at: user.createdAt,
    })
  } catch (error) {
    console.error('Erreur GET /api/profile/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
