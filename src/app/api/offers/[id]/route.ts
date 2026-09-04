import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { serializeOffer } from '../route'
import { z } from 'zod'

const updateOfferSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional().nullable(),
  resource_type: z.string().optional(),
  offered_resource: z.string().optional(),
  wanted_resource: z.string().optional(),
  complement_type: z.string().optional(),
  complement_desc: z.string().optional().nullable(),
  location: z.string().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  images: z.array(z.string()).optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        user: true,
        images: { orderBy: { position: 'asc' } },
      },
    })

    if (!offer) {
      return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 })
    }

    // Increment views asynchronously
    prisma.offer.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {})

    return NextResponse.json(serializeOffer(offer))
  } catch (error) {
    console.error('Erreur GET /api/offers/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.offer.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 })
    }

    if (existing.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez modifier que vos propres offres' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const parsed = updateOfferSchema.parse({
      title: body.title,
      description: body.description,
      resource_type: body.resource_type || body.resourceType,
      offered_resource: body.offered_resource || body.offeredResource,
      wanted_resource: body.wanted_resource || body.wantedResource,
      complement_type: body.complement_type || body.complementType,
      complement_desc: body.complement_desc || body.complementDesc,
      location: body.location,
      latitude: body.latitude,
      longitude: body.longitude,
      images: body.images,
    })

    const dataToUpdate: any = {}
    if (parsed.title !== undefined) dataToUpdate.title = parsed.title
    if (parsed.description !== undefined) dataToUpdate.description = parsed.description
    if (parsed.resource_type !== undefined) dataToUpdate.resourceType = parsed.resource_type
    if (parsed.offered_resource !== undefined) dataToUpdate.offeredResource = parsed.offered_resource
    if (parsed.wanted_resource !== undefined) dataToUpdate.wantedResource = parsed.wanted_resource
    if (parsed.complement_type !== undefined) dataToUpdate.complementType = parsed.complement_type
    if (parsed.complement_desc !== undefined) dataToUpdate.complementDesc = parsed.complement_desc
    if (parsed.location !== undefined) dataToUpdate.location = parsed.location
    if (parsed.latitude !== undefined) dataToUpdate.latitude = parsed.latitude
    if (parsed.longitude !== undefined) dataToUpdate.longitude = parsed.longitude

    if (parsed.images && parsed.images.length > 0) {
      // Re-create images
      await prisma.offerImage.deleteMany({ where: { offerId: id } })
      await prisma.offerImage.createMany({
        data: parsed.images.map((url, idx) => ({
          offerId: id,
          imageUrl: url,
          position: idx,
        })),
      })
    }

    const updated = await prisma.offer.update({
      where: { id },
      data: dataToUpdate,
      include: {
        user: true,
        images: { orderBy: { position: 'asc' } },
      },
    })

    return NextResponse.json(serializeOffer(updated))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }
    console.error('Erreur PUT /api/offers/[id]:', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.offer.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 })
    }

    if (existing.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez annuler que vos propres offres' },
        { status: 403 }
      )
    }

    // Soft delete / cancel
    await prisma.offer.update({
      where: { id },
      data: { status: 'cancelled' },
    })

    return NextResponse.json({ message: 'Offre annulée avec succès' })
  } catch (error) {
    console.error('Erreur DELETE /api/offers/[id]:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'annulation' }, { status: 500 })
  }
}
