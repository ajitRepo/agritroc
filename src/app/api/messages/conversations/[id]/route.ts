import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Le message ne peut pas être vide'),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const { id } = await params

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        offer: {
          select: {
            id: true,
            title: true,
            resourceType: true,
            offeredResource: true,
            wantedResource: true,
            location: true,
          },
        },
        initiator: {
          select: {
            id: true,
            phone: true,
            fullName: true,
            avatarUrl: true,
            city: true,
          },
        },
        owner: {
          select: {
            id: true,
            phone: true,
            fullName: true,
            avatarUrl: true,
            city: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Discussion introuvable' }, { status: 404 })
    }

    // Permission check
    if (conversation.initiatorId !== session.userId && conversation.ownerId !== session.userId) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    // Mark unread messages from other user as read
    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: session.userId },
        readAt: null,
      },
      data: { readAt: new Date() },
    })

    const otherUser = conversation.initiatorId === session.userId ? conversation.owner : conversation.initiator

    return NextResponse.json({
      id: conversation.id,
      conversation_id: conversation.id,
      conversationId: conversation.id,
      offer: conversation.offer,
      status: conversation.status,
      other_user: otherUser,
      otherUser,
      messages: conversation.messages.map((m) => ({
        id: m.id,
        sender_id: m.senderId,
        senderId: m.senderId,
        content: m.content,
        read_at: m.readAt,
        readAt: m.readAt,
        created_at: m.createdAt,
        createdAt: m.createdAt,
      })),
    })
  } catch (error) {
    console.error('Erreur GET /api/messages/conversations/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

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
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Discussion introuvable' }, { status: 404 })
    }

    if (conversation.initiatorId !== session.userId && conversation.ownerId !== session.userId) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    if (conversation.status !== 'open') {
      return NextResponse.json({ error: 'Cette conversation est clôturée' }, { status: 400 })
    }

    const body = await req.json()
    const { content } = sendMessageSchema.parse(body)

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: session.userId,
        content,
      },
    })

    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(
      {
        id: message.id,
        sender_id: message.senderId,
        senderId: message.senderId,
        content: message.content,
        created_at: message.createdAt,
        createdAt: message.createdAt,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }
    console.error('Erreur POST /api/messages/conversations/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
