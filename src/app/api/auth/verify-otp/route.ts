import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const schema = z.object({
  phone: z.string().min(8).transform((val) => {
    let cleaned = val.replace(/[\s.-]/g, '')
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('00')) {
        cleaned = '+' + cleaned.slice(2)
      } else if (cleaned.length === 9) {
        cleaned = '+221' + cleaned
      } else {
        cleaned = '+' + cleaned
      }
    }
    return cleaned
  }),
  code: z.string().min(4).max(8),
  fullName: z.string().optional(),
})

// Max 10 verify attempts per phone per 15 minutes
const VERIFY_RATE_LIMIT = 10
const VERIFY_RATE_WINDOW = 15 * 60 * 1000

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone, code, fullName } = schema.parse(body)

    const rateCheck = checkRateLimit(`verify:${phone}`, VERIFY_RATE_LIMIT, VERIFY_RATE_WINDOW)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Trop de tentatives. Veuillez patienter 15 minutes.' },
        { status: 429 }
      )
    }

    // Verify OTP from database
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'Code invalide ou expiré' },
        { status: 401 }
      )
    }

    // Mark code as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    })

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone } })
    let isNewUser = false

    if (!user) {
      isNewUser = true
      user = await prisma.user.create({
        data: {
          phone,
          fullName: fullName || null,
          isVerified: true,
        },
      })
    } else if (fullName && !user.fullName) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { fullName },
      })
    }

    // Check for super admin auto promotion
    const SUPER_ADMIN_PHONE = process.env.SUPER_ADMIN_PHONE
    if (SUPER_ADMIN_PHONE && user.phone === SUPER_ADMIN_PHONE && !user.isAdmin) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isAdmin: true },
      })
    }

    // Sign JWT token
    const token = await signToken({ userId: user.id, phone: user.phone })

    const response = NextResponse.json({
      success: true,
      message: isNewUser ? 'Compte créé avec succès' : 'Connexion réussie',
      is_new_user: isNewUser,
      token,
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        city: user.city,
        address: user.address,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        ratingAvg: user.ratingAvg,
        exchangeCount: user.exchangeCount,
        isAdmin: user.isAdmin,
      },
    })

    // Set HTTP-only cookie for web browsers
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }
    console.error('Erreur verify-otp:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la vérification' },
      { status: 500 }
    )
  }
}
