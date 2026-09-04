import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        phone: true,
        fullName: true,
        city: true,
        address: true,
        avatarUrl: true,
        bio: true,
        ratingAvg: true,
        ratingCount: true,
        exchangeCount: true,
        isAdmin: true,
        isVerified: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    const activeOffersCount = await prisma.offer.count({
      where: { userId: user.id, status: 'active' },
    })

    return NextResponse.json({
      id: user.id,
      phone: user.phone,
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
      is_admin: user.isAdmin,
      isAdmin: user.isAdmin,
      is_verified: user.isVerified,
      isVerified: user.isVerified,
      active_offers_count: activeOffersCount,
      created_at: user.createdAt,
    })
  } catch (error) {
    console.error('Erreur auth/me:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
