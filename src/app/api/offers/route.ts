import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const createOfferSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().optional().nullable(),
  resource_type: z.string().min(1, 'Le type de ressource est requis'),
  offered_resource: z.string().min(2, 'La ressource proposée est requise'),
  wanted_resource: z.string().min(2, 'La ressource recherchée est requise'),
  complement_type: z.string().default('none'),
  complement_desc: z.string().optional().nullable(),
  location: z.string().min(2, 'La localisation est requise'),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  images: z.array(z.string()).optional(),
})

export function serializeOffer(offer: any) {
  return {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    resource_type: offer.resourceType,
    resourceType: offer.resourceType,
    offered_resource: offer.offeredResource,
    offeredResource: offer.offeredResource,
    wanted_resource: offer.wantedResource,
    wantedResource: offer.wantedResource,
    complement_type: offer.complementType,
    complementType: offer.complementType,
    complement_desc: offer.complementDesc,
    complementDesc: offer.complementDesc,
    location: offer.location,
    latitude: offer.latitude,
    longitude: offer.longitude,
    status: offer.status,
    views_count: offer.viewsCount,
    user: offer.user
      ? {
          id: offer.user.id,
          phone: offer.user.phone,
          full_name: offer.user.fullName,
          fullName: offer.user.fullName,
          city: offer.user.city,
          avatar_url: offer.user.avatarUrl,
          avatarUrl: offer.user.avatarUrl,
          rating_avg: offer.user.ratingAvg,
          ratingAvg: offer.user.ratingAvg,
          exchange_count: offer.user.exchangeCount,
        }
      : null,
    images: (offer.images || []).map((img: any) => ({
      id: img.id,
      image_url: img.imageUrl,
      imageUrl: img.imageUrl,
      position: img.position,
    })),
    created_at: offer.createdAt,
    updated_at: offer.updatedAt,
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const resourceType = searchParams.get('resource_type') || searchParams.get('category')
    const location = searchParams.get('location')
    const status = searchParams.get('status') || 'active'
    const search = searchParams.get('q') || searchParams.get('search')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('per_page') || '20', 10)))

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (resourceType && resourceType !== 'all') {
      where.resourceType = resourceType
    }

    if (location) {
      where.location = { contains: location }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { offeredResource: { contains: search } },
        { wantedResource: { contains: search } },
        { location: { contains: search } },
      ]
    }

    const total = await prisma.offer.count({ where })
    const pages = Math.ceil(total / perPage) || 1

    const offers = await prisma.offer.findMany({
      where,
      include: {
        user: true,
        images: { orderBy: { position: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return NextResponse.json({
      items: offers.map(serializeOffer),
      total,
      page,
      per_page: perPage,
      pages,
    })
  } catch (error) {
    console.error('Erreur GET /api/offers:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération des offres' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createOfferSchema.parse({
      title: body.title,
      description: body.description,
      resource_type: body.resource_type || body.resourceType,
      offered_resource: body.offered_resource || body.offeredResource,
      wanted_resource: body.wanted_resource || body.wantedResource,
      complement_type: body.complement_type || body.complementType || 'none',
      complement_desc: body.complement_desc || body.complementDesc,
      location: body.location,
      latitude: body.latitude,
      longitude: body.longitude,
      images: body.images,
    })

    const offer = await prisma.offer.create({
      data: {
        userId: session.userId,
        title: parsed.title,
        description: parsed.description,
        resourceType: parsed.resource_type,
        offeredResource: parsed.offered_resource,
        wantedResource: parsed.wanted_resource,
        complementType: parsed.complement_type,
        complementDesc: parsed.complement_desc,
        location: parsed.location,
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        status: 'active',
        images: parsed.images && parsed.images.length > 0
          ? {
              create: parsed.images.map((url, idx) => ({
                imageUrl: url,
                position: idx,
              })),
            }
          : undefined,
      },
      include: {
        user: true,
        images: true,
      },
    })

    return NextResponse.json(serializeOffer(offer), { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }
    console.error('Erreur POST /api/offers:', error)
    return NextResponse.json({ error: 'Erreur lors de la création de l\'offre' }, { status: 500 })
  }
}
