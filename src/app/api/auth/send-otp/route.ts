import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP } from '@/lib/auth'
import { sendOtp } from '@/lib/whatsapp'
import { checkRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const schema = z.object({
  phone: z.string().min(8, 'Numéro de téléphone requis').transform((val) => {
    // Nettoyer et normaliser le format
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
})

// Max 5 OTP requests per phone per 15 minutes
const OTP_RATE_LIMIT = 5
const OTP_RATE_WINDOW = 15 * 60 * 1000

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone } = schema.parse(body)

    // Rate limiting per phone number
    const rateCheck = checkRateLimit(`otp:${phone}`, OTP_RATE_LIMIT, OTP_RATE_WINDOW)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.' },
        { status: 429 }
      )
    }

    const code = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Invalidate previous unused codes
    await prisma.otpCode.updateMany({
      where: { phone, used: false },
      data: { used: true },
    })

    // Store new code in database
    await prisma.otpCode.create({
      data: { phone, code, expiresAt },
    })

    // Send code via WhatsApp
    const result = await sendOtp(phone, code)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Impossible d'envoyer le code WhatsApp. Vérifiez votre numéro et réessayez.",
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.provider === 'dev-console'
        ? `[Mode Test] Code simulé : ${result.devCode}`
        : 'Code de connexion envoyé par WhatsApp',
      phone,
      ...(result.devCode ? { devCode: result.devCode } : {}),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Numéro invalide' },
        { status: 400 }
      )
    }
    console.error('Erreur send-otp:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de l\'envoi du code' },
      { status: 500 }
    )
  }
}
