import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { z } from 'zod'

const createConvSchema = z.object({
  offer_id: z.string().or(z.number().transform((n) => n.toString())),
  message: z.string().min(1, 'Le message ne peut pas être vide'),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { initiatorId: session.userId },
          { ownerId: session.userId },
        ],
      },
      include: {
        offer: {
          select: {
            id: true,
            title: true,
            resourceType: true,
            offeredResource: true,
            wantedResource: true,
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
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    // Compute unread count for each conversation
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser = conv.initiatorId === session.userId ? conv.owner : conv.initiator
        const lastMsg = conv.messages[0] || null

        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: session.userId },
            readAt: null,
          },
        })

        return {
          id: conv.id,
          conversation_id: conv.id,
          conversationId: conv.id,
          offer_id: conv.offerId,
          offerId: conv.offerId,
          offer_title: conv.offer?.title,
          offerTitle: conv.offer?.title,
          offer: conv.offer,
          status: conv.status,
          other_user: otherUser
            ? {
                id: otherUser.id,
                phone: otherUser.phone,
                full_name: otherUser.fullName,
                fullName: otherUser.fullName,
                avatar_url: otherUser.avatarUrl,
                avatarUrl: otherUser.avatarUrl,
                city: otherUser.city,
              }
            : null,
          otherUser,
          last_message: lastMsg ? lastMsg.content.slice(0, 100) : null,
          lastMessage: lastMsg ? lastMsg.content.slice(0, 100) : null,
          last_message_at: lastMsg ? lastMsg.createdAt : conv.createdAt,
          lastMessageAt: lastMsg ? lastMsg.createdAt : conv.createdAt,
          unread_count: unreadCount,
          unreadCount,
          created_at: conv.createdAt,
          updated_at: conv.updatedAt,
        }
      })
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur GET /api/messages/conversations:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createConvSchema.parse({
      offer_id: body.offer_id || body.offerId,
      message: body.message || body.content,
    })

    const offer = await prisma.offer.findUnique({
      where: { id: parsed.offer_id },
    })

    if (!offer) {
      return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 })
    }

    // R7: Cannot initiate conversation on own offer
    if (offer.userId === session.userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas démarrer une discussion sur votre propre offre' },
        { status: 400 }
      )
    }

    // R6: Check if conversation already exists
    let conversation = await prisma.conversation.findUnique({
      where: {
        offerId_initiatorId: {
          offerId: parsed.offer_id,
          initiatorId: session.userId,
        },
      },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })

    if (conversation) {
      // Add message to existing conversation
      const message = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: session.userId,
          content: parsed.message,
        },
      })

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      })

      return NextResponse.json({
        conversation_id: conversation.id,
        conversationId: conversation.id,
        offer_id: conversation.offerId,
        initiator_id: conversation.initiatorId,
        owner_id: conversation.ownerId,
        status: conversation.status,
        messages: [
          ...conversation.messages.map((m) => ({
            id: m.id,
            sender_id: m.senderId,
            senderId: m.senderId,
            content: m.content,
            read_at: m.readAt,
            created_at: m.createdAt,
          })),
          {
            id: message.id,
            sender_id: message.senderId,
            senderId: message.senderId,
            content: message.content,
            read_at: message.readAt,
            created_at: message.createdAt,
          },
        ],
      })
    }

    // Create new conversation
    conversation = await prisma.conversation.create({
      data: {
        offerId: parsed.offer_id,
        initiatorId: session.userId,
        ownerId: offer.userId,
        status: 'open',
        messages: {
          create: [
            {
              senderId: session.userId,
              content: parsed.message,
            },
          ],
        },
      },
      include: {
        messages: true,
      },
    })

    return NextResponse.json(
      {
        conversation_id: conversation.id,
        conversationId: conversation.id,
        offer_id: conversation.offerId,
        initiator_id: conversation.initiatorId,
        owner_id: conversation.ownerId,
        status: conversation.status,
        messages: conversation.messages.map((m) => ({
          id: m.id,
          sender_id: m.senderId,
          senderId: m.senderId,
          content: m.content,
          read_at: m.readAt,
          created_at: m.createdAt,
        })),
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
    console.error('Erreur POST /api/messages/conversations:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
