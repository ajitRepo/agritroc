import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  full_name: z.string().optional(),
  fullName: z.string().optional(),
  city: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  avatar_url: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
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
      is_verified: user.isVerified,
      isVerified: user.isVerified,
      is_admin: user.isAdmin,
      isAdmin: user.isAdmin,
      active_offers_count: activeOffersCount,
      activeOffersCount,
      created_at: user.createdAt,
    })
  } catch (error) {
    console.error('Erreur GET /api/profile:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateProfileSchema.parse(body)

    const fullName = parsed.full_name ?? parsed.fullName
    const avatarUrl = parsed.avatar_url ?? parsed.avatarUrl

    const dataToUpdate: any = {}
    if (fullName !== undefined) dataToUpdate.fullName = fullName
    if (parsed.city !== undefined) dataToUpdate.city = parsed.city
    if (parsed.address !== undefined) dataToUpdate.address = parsed.address
    if (avatarUrl !== undefined) dataToUpdate.avatarUrl = avatarUrl
    if (parsed.bio !== undefined) dataToUpdate.bio = parsed.bio

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: dataToUpdate,
    })

    const activeOffersCount = await prisma.offer.count({
      where: { userId: updated.id, status: 'active' },
    })

    return NextResponse.json({
      id: updated.id,
      phone: updated.phone,
      full_name: updated.fullName,
      fullName: updated.fullName,
      city: updated.city,
      address: updated.address,
      avatar_url: updated.avatarUrl,
      avatarUrl: updated.avatarUrl,
      bio: updated.bio,
      rating_avg: updated.ratingAvg,
      ratingAvg: updated.ratingAvg,
      rating_count: updated.ratingCount,
      ratingCount: updated.ratingCount,
      exchange_count: updated.exchangeCount,
      exchangeCount: updated.exchangeCount,
      is_verified: updated.isVerified,
      isVerified: updated.isVerified,
      is_admin: updated.isAdmin,
      isAdmin: updated.isAdmin,
      active_offers_count: activeOffersCount,
      activeOffersCount,
      created_at: updated.createdAt,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }
    console.error('Erreur PUT /api/profile:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
